type SectionHeadingProps = {
  index: string;
  eyebrow: string;
  title: string;
  titleId: string;
  inverted?: boolean;
};

export function SectionHeading({
  index,
  eyebrow,
  title,
  titleId,
  inverted,
}: SectionHeadingProps) {
  return (
    <header
      className={`section-heading${inverted ? " section-heading--inverted" : ""}`}
    >
      <p className="section-index">{index}</p>
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 id={titleId}>{title}</h2>
    </header>
  );
}
