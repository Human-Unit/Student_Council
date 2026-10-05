/*
 * Student Council identity, as defined in the Student Council Brandbook
 * (April 2025): logo geometry, palette and supporting shapes. The vector
 * paths match the 320×420 logo grid of the brandbook.
 */

export const brandColors = {
  blue: "#3A53D1",
  blueDeep: "#132FC1",
  red: "#C11316",
  redSoft: "#D13A3D",
  ink: "#101010",
  graphite: "#2A2A2A",
  paper: "#EEEEEE",
  ash: "#A6A4A4",
  white: "#FFFFFF",
} as const;

export const LOGO_VIEWBOX = "10 1.4 320 420";

export type LogoPieceId = "base" | "band" | "left" | "right" | "tower";

/** Back pieces first; the tower is the front layer of the mark. */
export const logoPieces: { id: LogoPieceId; front: boolean; d: string }[] = [
  {
    id: "base",
    front: false,
    d: "M272 267.6L330 294.418L330 421.4H10L10 380.021H290.5L290.5 325.707L272 317.264V267.6Z",
  },
  {
    id: "band",
    front: false,
    d: "M10 180.191L170 105.695L330 180.191V219.922L170 145.426L48.5 202.043V276.539L170 219.922L208.5 237.891V287.555L170 269.586L10 344.082V180.191Z",
  },
  {
    id: "left",
    front: false,
    d: "M40.2609 153.397L10 167.952V90.4991L68 63.4688V93.0982L40.2609 106.094V153.397Z",
  },
  {
    id: "right",
    front: false,
    d: "M299.739 153.397L330 167.952V90.4991L272 63.4688V93.0982L299.739 106.094V153.397Z",
  },
  {
    id: "tower",
    front: true,
    d: "M260 43.4967L170 1.3999L80 43.4967V358.981H260V261.992L220.535 243.543V313.981H119.465V63.8193L170 40.1096L220.535 63.8193V116.62L260 135.008V43.4967Z",
  },
];

/** Approved colourways from the brandbook: [back pieces, front tower]. */
export const logoTones = {
  blue: [brandColors.blueDeep, brandColors.blue],
  light: ["#E7EAF6", brandColors.white],
  red: [brandColors.red, brandColors.redSoft],
  ink: [brandColors.ink, brandColors.graphite],
  ash: [brandColors.ash, brandColors.paper],
} as const;

export type LogoTone = keyof typeof logoTones;

export const STAR_VIEWBOX = "0 0 87 87";
export const STAR_PATH =
  "M42.3391 1.03122C42.5024 -0.343739 44.4976 -0.343739 44.6609 1.03122L46.0295 12.5659C47.7968 27.4602 59.5398 39.2032 74.434 40.9705L85.9687 42.3391C87.3438 42.5024 87.3438 44.4976 85.9687 44.6609L74.434 46.0295C59.5398 47.7968 47.7968 59.5398 46.0295 74.434L44.6609 85.9687C44.4976 87.3438 42.5024 87.3438 42.3391 85.9687L40.9705 74.434C39.2032 59.5398 27.4602 47.7968 12.5659 46.0295L1.03122 44.6609C-0.343739 44.4976 -0.343739 42.5024 1.03122 42.3391L12.5659 40.9705C27.4602 39.2032 39.2032 27.4602 40.9705 12.5659L42.3391 1.03122Z";

/** The page tab — the pentagon that carries page numbers in the brandbook. */
export const TAB_VIEWBOX = "0 0 50 80";
export const TAB_PATH = "M0 11.66 25 0l25 11.66V80H0z";

/** Roof chevron used as a bullet across Student Council materials. */
export const CHEVRON_VIEWBOX = "0 0 30 15";
export const CHEVRON_PATH = "M1 14 15 2l14 12";

/**
 * Standalone SVG markup of the logo for image routes (icons, OG image).
 * `shadow` adds the brandbook's paper-cut drop shadow in the given colour.
 */
export function logoSvg(tone: LogoTone, shadow?: string): string {
  const [back, front] = logoTones[tone];
  const defs = shadow
    ? `<defs><filter id="cut" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="10" stdDeviation="9" flood-color="${shadow}" flood-opacity="0.34"/></filter></defs>`
    : "";
  const filter = shadow ? ` filter="url(#cut)"` : "";
  const paths = logoPieces
    .map(
      ({ front: isFront, d }) =>
        `<path d="${d}" fill="${isFront ? front : back}"${filter}/>`,
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGO_VIEWBOX}">${defs}${paths}</svg>`;
}
