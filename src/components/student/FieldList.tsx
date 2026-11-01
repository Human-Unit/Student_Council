import type { FieldSpec } from "@/data/fields";
import { studentCopy } from "@/data/student";
import { tie } from "@/lib/typography";

/** What to enter: the same field specs a future generator will use. */
export function FieldList({ fields }: { fields: readonly FieldSpec[] }) {
  return (
    <dl className="student-fields">
      {fields.map((field) => (
        <div className="student-field" key={field.key}>
          <dt>
            {field.label}
            {field.manual ? (
              <span className="student-field-tag">от руки</span>
            ) : !field.required ? (
              <span className="student-field-tag">если есть</span>
            ) : null}
          </dt>
          {field.hint && !field.manual ? <dd>{tie(field.hint)}</dd> : null}
          {field.example ? (
            <dd className="student-field-example">
              <span>{studentCopy.exampleLabel}:</span> {field.example}
            </dd>
          ) : null}
        </div>
      ))}
    </dl>
  );
}
