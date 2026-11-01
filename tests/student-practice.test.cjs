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

const { studentFields, fieldsFor } = loadSource(
  path.join(root, "src/data/fields.ts"),
);
const practice = loadSource(path.join(root, "src/data/practice.ts"));
const { documentGuidance } = loadSource(path.join(root, "src/data/student.ts"));
const { parseTemplate, templateKeys, fillTemplate, validateValues } =
  loadSource(path.join(root, "src/lib/templates.ts"));
const { TitlePagePreview, DiaryTable } = loadSource(
  path.join(root, "src/components/student/Practice.tsx"),
);
const { site } = loadSource(path.join(root, "src/data/site.ts"));

const fixedKeys = new Set(["institution"]);

test("every template tag and guidance key exists in the field registry", () => {
  const tags = practice.titlePageLines.flatMap((line) =>
    templateKeys(line.text),
  );
  for (const key of tags)
    assert.ok(fixedKeys.has(key) || key in studentFields, `unknown tag ${key}`);
  for (const key of practice.titlePageFieldKeys)
    assert.ok(tags.includes(key), `${key} is listed but not on the page`);
  for (const keys of Object.values(documentGuidance))
    for (const key of keys) assert.ok(key in studentFields, key);
  for (const [key, spec] of Object.entries(studentFields))
    assert.equal(spec.key, key);
});

test("templates parse into text and field segments and fill safely", () => {
  assert.deepEqual(parseTemplate("Курс {course}, группа {group}"), [
    { kind: "text", value: "Курс " },
    { kind: "field", key: "course" },
    { kind: "text", value: ", группа " },
    { kind: "field", key: "group" },
  ]);
  assert.equal(
    fillTemplate("Студент: {fullName} ({group})", { fullName: " Иванов " }),
    "Студент: Иванов ({group})",
  );
});

test("validation follows field specs and skips hand-written fields", () => {
  const fields = fieldsFor(["fullName", "course", "signature"]);
  assert.deepEqual(Object.keys(validateValues(fields, {})).sort(), [
    "course",
    "fullName",
  ]);
  assert.deepEqual(
    validateValues(fields, { fullName: "Иванов Иван", course: "9" }),
    { course: "Выберите значение из списка" },
  );
  assert.deepEqual(
    validateValues(fields, { fullName: "x".repeat(121), course: "2" }),
    { fullName: "Не длиннее 120 символов" },
  );
});

test("title page preview marks empty fields and shows supplied values", () => {
  const empty = renderToStaticMarkup(
    React.createElement(TitlePagePreview, { lines: practice.titlePageLines }),
  );
  assert.ok(empty.includes(site.branch));
  assert.ok(
    empty.includes(
      `<mark class="practice-tag">${studentFields.fullName.label}</mark>`,
    ),
  );
  const filled = renderToStaticMarkup(
    React.createElement(TitlePagePreview, {
      lines: practice.titlePageLines,
      values: { fullName: "Тестовый Студент" },
    }),
  );
  assert.ok(filled.includes("Тестовый Студент"));
  assert.ok(!filled.includes(`>${studentFields.fullName.label}</mark>`));
});

test("diary example is a real table with a row header per entry", () => {
  const html = renderToStaticMarkup(
    React.createElement(DiaryTable, { entries: practice.diaryExample }),
  );
  assert.ok(html.includes("<caption>"));
  assert.equal(
    (html.match(/<th scope="row"/g) || []).length,
    practice.diaryExample.length,
  );
});

test("practice templates never point at guessed files", () => {
  for (const template of practice.practiceTemplates)
    assert.equal(template.template_url, null);
});

test("field list shows a hint only when it adds something", () => {
  const { FieldList } = loadSource(
    path.join(root, "src/components/student/FieldList.tsx"),
  );
  const html = renderToStaticMarkup(
    React.createElement(FieldList, {
      fields: fieldsFor(["fullName", "group", "signature", "phone"]),
    }),
  );
  assert.equal((html.match(/<dt>/g) || []).length, 4);
  // tie() binds short words with no-break spaces.
  const text = html.replaceAll("\u00a0", " ");
  assert.ok(text.includes(studentFields.fullName.hint));
  // "Группа" has no hint, the signature says "от руки" once, not twice.
  assert.equal((html.match(/<dd>/g) || []).length, 1);
  assert.ok(html.includes("от руки"));
  assert.ok(!text.includes(studentFields.signature.hint));
  assert.ok(text.includes(studentFields.phone.example));
});

test("document field lists follow the originals' order", () => {
  for (const [slug, keys] of Object.entries(documentGuidance)) {
    assert.equal(keys.at(-1), "phone", `${slug}: phone is last on the form`);
    assert.ok(keys.includes("signature"), `${slug}: signature`);
    assert.ok(keys.indexOf("fullName") < keys.indexOf("signature"), slug);
  }
  assert.ok(
    !documentGuidance["missed-classes-explanation"].includes("absenceReason"),
  );
});
