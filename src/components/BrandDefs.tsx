/**
 * Shared SVG definitions referenced by id from every inline SVG on the page:
 * the brandbook's paper-cut shadows. Rendered once; kept out of layout but not
 * `display: none`, which would break the references in some browsers.
 */
export function BrandDefs() {
  return (
    <svg className="brand-defs" aria-hidden="true" focusable="false">
      <defs>
        <filter
          id="cut-shadow-blue"
          x="-30%"
          y="-30%"
          width="160%"
          height="170%"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow
            dx="0"
            dy="10"
            stdDeviation="9"
            floodColor="#07146e"
            floodOpacity="0.34"
          />
        </filter>
        <filter
          id="cut-shadow-dark"
          x="-30%"
          y="-30%"
          width="160%"
          height="170%"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow
            dx="0"
            dy="12"
            stdDeviation="12"
            floodColor="#000"
            floodOpacity="0.6"
          />
        </filter>
        <filter
          id="cut-shadow-soft"
          x="-30%"
          y="-30%"
          width="160%"
          height="170%"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow
            dx="0"
            dy="8"
            stdDeviation="8"
            floodColor="#101010"
            floodOpacity="0.2"
          />
        </filter>
      </defs>
    </svg>
  );
}
