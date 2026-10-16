/* eslint-disable @typescript-eslint/no-require-imports -- Node-only CJS loader compiles TSX in memory, not an application bundle. */
// Node's built-in runner + the existing TypeScript compiler, no new test framework.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const test = require("node:test");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const root = path.resolve(__dirname, "..");
const modules = new Map();

function loadSource(filename) {
  const resolved = [filename, filename + ".ts", filename + ".tsx"].find(
    (candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile(),
  );
  if (!resolved) throw new Error("Missing source module: " + filename);
  if (modules.has(resolved)) return modules.get(resolved).exports;
  const compiled = ts.transpileModule(fs.readFileSync(resolved, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
    },
    fileName: resolved,
  }).outputText;
  const mod = new Module(resolved, module);
  modules.set(resolved, mod);
  mod.filename = resolved;
  mod.paths = module.paths;
  mod.require = (name) => {
    if (name === "server-only") return {}; // This runner executes server data code, never bundles it for a browser.
    if (name.startsWith("@/"))
      return loadSource(path.join(root, "src", name.slice(2)));
    if (name.startsWith("."))
      return loadSource(path.resolve(path.dirname(resolved), name));
    return require(name);
  };
  mod._compile(compiled, resolved);
  return mod.exports;
}

const { DocumentList, DocumentDownload } = loadSource(
  path.join(root, "src/components/student/DocumentList.tsx"),
);
const { documentCatalog, studentCopy } = loadSource(
  path.join(root, "src/data/student.ts"),
);
const { getDocuments, getDocument } = loadSource(
  path.join(root, "src/lib/documents.ts"),
);
const { navigationHref } = loadSource(path.join(root, "src/lib/navigation.ts"));

for (const count of [0, 1, 5, 20]) {
  test(`editorial list renders ${count} records without fixed-count layout`, () => {
    const documents = Array.from({ length: count }, (_, index) => ({
      ...documentCatalog[index % documentCatalog.length],
      slug: `isolated-test-${index}`,
    }));
    const html = renderToStaticMarkup(
      React.createElement(DocumentList, { documents }),
    );
    assert.equal((html.match(/class="student-row"/g) || []).length, count);
    if (count === 0) {
      assert.ok(html.includes('role="status"'));
      assert.ok(html.includes(studentCopy.emptyTitle));
    } else {
      assert.ok(html.includes(studentCopy.unavailableDownload));
      assert.ok(!html.includes("download="));
    }
  });
}

test("catalog has only published descriptions and no invented download URLs", async () => {
  const documents = await getDocuments();
  assert.equal(documents.length, 5);
  assert.ok(
    documents.every(
      (document) => document.is_published && document.template_url === null,
    ),
  );
  assert.equal(await getDocument("missing-document"), null);
  assert.equal((await getDocument(documents[0].slug)).number, "01");
});

test("download markup identifies DOCX and exposes only an actual supplied URL", () => {
  // Markup-only fixture; not a claim that this test-only file exists or is official.
  const document = {
    ...documentCatalog[0],
    template_url: "/documents/templates/isolated-test.docx",
  };
  const html = renderToStaticMarkup(
    React.createElement(DocumentDownload, { document }),
  );
  assert.ok(html.includes('download=""'));
  assert.ok(html.includes('href="/documents/templates/isolated-test.docx"'));
  assert.ok(html.includes("DOCX"));
  assert.ok(html.includes("aria-label="));
});

test("utility navigation resolves homepage anchors without changing homepage behavior", () => {
  assert.equal(navigationHref("#about", true), "#about");
  assert.equal(navigationHref("#about", false), "/#about");
  assert.equal(navigationHref("/student", false), "/student");
});
