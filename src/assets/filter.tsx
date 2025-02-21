function filter({
  color,
  className,
  onClick,
}: {
  color?: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <path
        d="M3.5 6H12.5M1.25 1.5H14.75M5.75 10.5H10.25"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default filter;
