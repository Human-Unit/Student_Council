type ArrowDirection = "right" | "up-right" | "up" | "down";

const rotation: Record<ArrowDirection, number> = {
  right: 0,
  "up-right": -45,
  up: -90,
  down: 90,
};

type ArrowIconProps = {
  direction?: ArrowDirection;
};

export function ArrowIcon({ direction = "right" }: ArrowIconProps) {
  return (
    <svg
      aria-hidden="true"
      className="arrow-icon"
      viewBox="0 0 20 20"
      fill="none"
      style={
        rotation[direction]
          ? { rotate: `${rotation[direction]}deg` }
          : undefined
      }
    >
      <path d="M3 10h13M11 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
