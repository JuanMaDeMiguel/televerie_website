export function TeleverieIcon({
  className = "w-16 h-16",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g transform="translate(60, 60)">
        {/* Pétalo Superior Derecho */}
        <path
          transform="rotate(45)"
          d="M 0,-4 C 14,-12 24,-28 16,-40 C 8,-50 -8,-50 -16,-40 C -24,-28 -14,-12 0,-4 Z"
          fill="#0066FF"
        />

        {/* Pétalo Inferior Derecho */}
        <path
          transform="rotate(135)"
          d="M 0,-4 C 14,-12 24,-28 16,-40 C 8,-50 -8,-50 -16,-40 C -24,-28 -14,-12 0,-4 Z"
          fill="#0066FF"
        />

        {/* Pétalo Inferior Izquierdo */}
        <path
          transform="rotate(225)"
          d="M 0,-4 C 14,-12 24,-28 16,-40 C 8,-50 -8,-50 -16,-40 C -24,-28 -14,-12 0,-4 Z"
          fill="#0066FF"
        />

        {/* Pétalo Superior Izquierdo */}
        <path
          transform="rotate(315)"
          d="M 0,-4 C 14,-12 24,-28 16,-40 C 8,-50 -8,-50 -16,-40 C -24,-28 -14,-12 0,-4 Z"
          fill="#0066FF"
        />
      </g>
    </svg>
  );
}