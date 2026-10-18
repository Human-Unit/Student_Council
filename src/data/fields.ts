/**
 * One registry of the data a student enters into documents. Documents and the
 * practice diary reference fields by key, so a future generator can build its
 * form, validation and DOCX tags ({fullName}, {course}, …) from this file alone.
 *
 * `hint` only where it adds something the label does not say. `example` is an
 * illustration, never a real person or an official requirement.
 */

export type FieldType =
  "text" | "textarea" | "number" | "date" | "tel" | "select" | "signature";

export type FieldSpec = {
  key: string;
  label: string;
  type: FieldType;
  /** Mandatory when the document is generated. */
  required: boolean;
  hint?: string;
  example?: string;
  /** Values as they are inserted into the document text. */
  options?: readonly string[];
  maxLength?: number;
  /** Filled by hand on paper (signatures); a generator leaves room for it. */
  manual?: boolean;
};

const field = <K extends string>(
  key: K,
  spec: Omit<FieldSpec, "key" | "required"> & { required?: boolean },
): FieldSpec & { key: K } => ({ key, required: true, ...spec });

export const studentFields = {
  fullName: field("fullName", {
    label: "Фамилия, имя и отчество",
    type: "text",
    hint: "Полностью, без сокращений.",
    maxLength: 120,
  }),
  course: field("course", {
    label: "Курс",
    type: "select",
    hint: "Цифрой: 1, 2, 3…",
    options: ["1", "2", "3", "4", "5", "6"],
  }),
  direction: field("direction", {
    label: "Направление подготовки",
    type: "text",
    example: "Прикладная математика и информатика",
    maxLength: 160,
  }),
  group: field("group", {
    label: "Группа",
    type: "text",
    maxLength: 32,
  }),
  department: field("department", {
    label: "Кафедра",
    type: "text",
    hint: "Та, что проводит практику.",
    maxLength: 160,
  }),
  date: field("date", {
    label: "Дата заполнения",
    type: "date",
  }),
  signature: field("signature", {
    label: "Подпись",
    type: "signature",
    hint: "От руки, на распечатанном бланке.",
    manual: true,
  }),
  phone: field("phone", {
    label: "Телефон",
    type: "tel",
    example: "+992 XX XXX XX XX",
    maxLength: 24,
  }),
  absenceDate: field("absenceDate", {
    label: "Дата пропуска",
    type: "date",
  }),
  periodStart: field("periodStart", {
    label: "Дата начала периода",
    type: "date",
  }),
  periodEnd: field("periodEnd", {
    label: "Дата окончания периода",
    type: "date",
  }),
  absenceReason: field("absenceReason", {
    label: "Причина отсутствия",
    type: "textarea",
    hint: "Как указано в справке.",
    maxLength: 400,
  }),
  releaseReason: field("releaseReason", {
    label: "Причина освобождения",
    type: "textarea",
    maxLength: 400,
  }),
  paymentPart: field("paymentPart", {
    label: "Первая или вторая половина оплаты",
    type: "select",
    options: ["первой", "второй"],
  }),
  deferUntil: field("deferUntil", {
    label: "Дата, до которой нужна отсрочка",
    type: "date",
  }),
  deferReason: field("deferReason", {
    label: "Причина отсрочки",
    type: "textarea",
    maxLength: 400,
  }),
  graduationYear: field("graduationYear", {
    label: "Год выпуска",
    type: "number",
  }),
  masterProgram: field("masterProgram", {
    label: "Магистратура, в которую вы поступаете",
    type: "text",
    maxLength: 200,
  }),
  recipient: field("recipient", {
    label: "Место, куда нужна справка",
    type: "text",
    maxLength: 200,
  }),
  practiceType: field("practiceType", {
    label: "Вид практики",
    type: "select",
    hint: "Как в приказе о практике.",
    options: ["учебной", "производственной", "преддипломной"],
  }),
  practicePlace: field("practicePlace", {
    label: "Место прохождения",
    type: "text",
    hint: "Полное название организации или подразделения.",
    maxLength: 200,
  }),
  supervisorUniversity: field("supervisorUniversity", {
    label: "Руководитель от кафедры",
    type: "text",
    hint: "Должность и ФИО.",
    maxLength: 160,
  }),
  supervisorOrganization: field("supervisorOrganization", {
    label: "Руководитель от организации",
    type: "text",
    hint: "Должность и ФИО.",
    maxLength: 160,
    required: false,
  }),
  year: field("year", {
    label: "Год",
    type: "number",
  }),
} satisfies Record<string, FieldSpec>;

export type FieldKey = keyof typeof studentFields;

export function fieldsFor(keys: readonly FieldKey[]): FieldSpec[] {
  return keys.map((key) => studentFields[key]);
}
