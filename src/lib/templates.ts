import type { FieldSpec } from "@/data/fields";

/**
 * Plain-text template helpers shared by the on-page previews and a future
 * document generator. Tags use the `{fieldKey}` syntax, the same default
 * delimiters as DOCX templating tools, so one set of field keys serves both.
 */

export type TemplateSegment =
  { kind: "text"; value: string } | { kind: "field"; key: string };

export type FieldValues = Partial<Record<string, string>>;

const TAG = /\{([A-Za-z][A-Za-z0-9]*)\}/g;

export function parseTemplate(template: string): TemplateSegment[] {
  const segments: TemplateSegment[] = [];
  let cursor = 0;
  for (const match of template.matchAll(TAG)) {
    if (match.index > cursor)
      segments.push({
        kind: "text",
        value: template.slice(cursor, match.index),
      });
    segments.push({ kind: "field", key: match[1] });
    cursor = match.index + match[0].length;
  }
  if (cursor < template.length)
    segments.push({ kind: "text", value: template.slice(cursor) });
  return segments;
}

export function templateKeys(template: string): string[] {
  return [...new Set([...template.matchAll(TAG)].map((match) => match[1]))];
}

/** Replaces known tags; unknown or empty values stay as visible `{tag}`. */
export function fillTemplate(template: string, values: FieldValues): string {
  return template.replace(TAG, (tag, key: string) => {
    const value = values[key]?.trim();
    return value ? value : tag;
  });
}

export type FieldErrors = Partial<Record<string, string>>;

/** Server/client-neutral validation for a future form built from FieldSpec. */
export function validateValues(
  fields: readonly FieldSpec[],
  values: FieldValues,
): FieldErrors {
  const errors: FieldErrors = {};
  for (const spec of fields) {
    if (spec.manual) continue;
    const value = values[spec.key]?.trim() ?? "";
    if (!value) {
      if (spec.required) errors[spec.key] = "Заполните поле";
      continue;
    }
    if (spec.maxLength && value.length > spec.maxLength)
      errors[spec.key] = `Не длиннее ${spec.maxLength} символов`;
    else if (spec.options && !spec.options.includes(value))
      errors[spec.key] = "Выберите значение из списка";
  }
  return errors;
}
