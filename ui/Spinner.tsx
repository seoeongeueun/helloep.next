interface SpinnerProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function Spinner({
  size = 40,
  color = "currentColor",
  strokeWidth = 4,
}: SpinnerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      className="animate-spin"
      aria-label="로딩 중"
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray="80, 200"
        strokeDashoffset="0"
      />
    </svg>
  );
}
