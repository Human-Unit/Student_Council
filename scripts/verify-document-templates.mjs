#!/usr/bin/env node
// Checks the DOCX templates on a deployed site against SHA256SUMS:
// HTTP status, MIME type, attachment header and SHA-256 of the bytes served.
//
//   node scripts/verify-document-templates.mjs https://student-council-ecru.vercel.app
//
// Exit code 1 if any file differs from the approved original.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const DOCX_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const base = (process.argv[2] ?? "").replace(/\/+$/, "");
if (!/^https?:\/\/[^/]+/.test(base)) {
  console.error("Usage: node scripts/verify-document-templates.mjs <site-url>");
  process.exit(2);
}

const sums = readFileSync(
  new URL("../public/documents/templates/SHA256SUMS", import.meta.url),
  "utf8",
)
  .trim()
  .split("\n")
  .map((line) => line.trim().split(/\s+/));

let failed = 0;
for (const [expected, name] of sums) {
  const response = await fetch(`${base}/documents/templates/${name}`, {
    cache: "no-store",
  });
  const bytes = Buffer.from(await response.arrayBuffer());
  const hash = createHash("sha256").update(bytes).digest("hex");
  const type = response.headers.get("content-type") ?? "";
  const disposition = response.headers.get("content-disposition") ?? "";
  const problems = [];
  if (response.status !== 200) problems.push(`HTTP ${response.status}`);
  if (hash !== expected) problems.push("SHA-256 differs from the original");
  if (!type.startsWith(DOCX_TYPE)) problems.push(`type "${type}"`);
  if (!/^attachment;.*filename\*=UTF-8''/.test(disposition))
    problems.push("no attachment header with the Russian name");
  if (problems.length) failed++;
  const savedAs = decodeURIComponent(disposition.split("UTF-8''")[1] ?? "");
  console.log(
    `${problems.length ? "FAIL" : "OK  "}  ${name}  ${bytes.length} B  ${
      problems.join("; ") || `→ «${savedAs}»`
    }`,
  );
}
console.log(
  failed
    ? `${failed} of ${sums.length} templates failed`
    : `All ${sums.length} templates match the originals`,
);
process.exit(failed ? 1 : 0);
