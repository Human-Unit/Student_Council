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
  if (resolved.endsWith(".json"))
    return JSON.parse(fs.readFileSync(resolved, "utf8"));
  if (modules.has(resolved)) return modules.get(resolved).exports;
  const compiled = ts.transpileModule(fs.readFileSync(resolved, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true, // Same as tsconfig: default-import JSON.
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
const { downloadName, contentDisposition } = loadSource(
  path.join(root, "src/lib/template-files.ts"),
);
const nextConfig = loadSource(path.join(root, "next.config.ts")).default;
const previews = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/document-previews.json"), "utf8"),
);
const templatesDir = path.join(root, "public/documents/templates");
const checksums = new Map(
  fs
    .readFileSync(path.join(templatesDir, "SHA256SUMS"), "utf8")
    .trim()
    .split("\n")
    .map((line) => line.trim().split(/\s+/).reverse()),
);
const sha256 = (file) =>
  require("node:crypto")
    .createHash("sha256")
    .update(fs.readFileSync(file))
    .digest("hex");
const escapeAttribute = (value) =>
  value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");

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
      assert.equal((html.match(/ download="/g) || []).length, count);
      assert.ok(!html.includes(studentCopy.unavailableDownload));
    }
  });
}

test("every published document links its approved original, byte for byte", async () => {
  const documents = await getDocuments();
  assert.equal(documents.length, 6);
  for (const document of documents) {
    const fileName = `${document.slug}.docx`;
    assert.equal(document.template_url, `/documents/templates/${fileName}`);
    const file = path.join(templatesDir, fileName);
    assert.ok(fs.existsSync(file), `${fileName} is missing`);
    assert.equal(sha256(file), checksums.get(fileName), `${fileName} changed`);
    const bytes = fs.readFileSync(file);
    assert.equal(bytes.subarray(0, 4).toString("latin1"), "PK\x03\x04");
    assert.ok(bytes.includes("word/document.xml"), `${fileName} is not DOCX`);
  }
  assert.equal(
    checksums.size,
    documents.length,
    "SHA256SUMS lists extra files",
  );
  assert.equal(await getDocument("missing-document"), null);
  assert.equal((await getDocument(documents[0].slug)).number, "01");
});

test("each original has a rendered preview of the stated size", async () => {
  for (const document of await getDocuments()) {
    const { preview } = await getDocument(document.slug);
    assert.ok(preview, `${document.slug} has no preview`);
    assert.deepEqual(preview, previews[document.slug]);
    const png = fs.readFileSync(path.join(root, "public", preview.src));
    assert.equal(png.readUInt32BE(16), preview.width);
    assert.equal(png.readUInt32BE(20), preview.height);
  }
});

test("download saves the file under its Russian title", () => {
  const document = documentCatalog[1];
  const html = renderToStaticMarkup(
    React.createElement(DocumentDownload, { document }),
  );
  assert.ok(html.includes(`href="${document.template_url}"`));
  assert.ok(
    html.includes(`download="${escapeAttribute(downloadName(document))}"`),
  );
  assert.ok(html.includes("DOCX"));
  assert.ok(html.includes("aria-label="));
});

test("a document without an original stays visibly unavailable", () => {
  const document = { ...documentCatalog[0], template_url: null };
  const html = renderToStaticMarkup(
    React.createElement(DocumentDownload, { document }),
  );
  assert.ok(html.includes(studentCopy.unavailableDownload));
  assert.ok(!html.includes("download="));
});

test("template responses carry an attachment header with the title", async () => {
  const rules = await nextConfig.headers();
  assert.equal(rules.length, documentCatalog.length);
  for (const document of documentCatalog) {
    const rule = rules.find((entry) => entry.source === document.template_url);
    assert.ok(rule, `${document.slug} has no header rule`);
    const value = rule.headers[0].value;
    assert.equal(value, contentDisposition(document));
    assert.match(
      value,
      /^attachment; filename="[a-z-]+\.docx"; filename\*=UTF-8''/,
    );
    assert.ok(/^[\x20-\x7e]+$/.test(value), "header must be ASCII");
    const encoded = value.split("UTF-8''")[1];
    assert.equal(decodeURIComponent(encoded), `${document.title}.docx`);
  }
});

test("utility navigation resolves homepage anchors without changing homepage behavior", () => {
  assert.equal(navigationHref("#about", true), "#about");
  assert.equal(navigationHref("#about", false), "/#about");
  assert.equal(navigationHref("/student", false), "/student");
});
