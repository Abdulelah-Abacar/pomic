function Played({ color, className }: { color?: string; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_26_700)">
        <path d="M5.0625 0.375H1.78125V11.625H5.0625V0.375Z" fill={color} />
        <path d="M10.2188 0.375H6.9375V11.625H10.2188V0.375Z" fill={color} />
      </g>
      <defs>
        <clipPath id="clip0_26_700">
          <rect
            width="11.25"
            height="11.25"
            fill={color}
            transform="translate(0.375 0.375)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

export default Played;
