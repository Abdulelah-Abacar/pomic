function backward({
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
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <path
        opacity="0.4"
        d="M22.0002 8.33995V15.66C22.0002 17.16 20.3703 18.1 19.0703 17.35L15.9002 15.5199L12.7303 13.69L12.2402 13.41V10.59L12.7303 10.31L15.9002 8.47997L19.0703 6.64995C20.3703 5.89995 22.0002 6.83995 22.0002 8.33995Z"
        fill={color}
      />
      <path
        d="M12.2399 8.33995V15.66C12.2399 17.16 10.6099 18.1 9.31995 17.35L6.13995 15.5199L2.96994 13.69C1.67994 12.94 1.67994 11.06 2.96994 10.31L6.13995 8.47997L9.31995 6.64995C10.6099 5.89995 12.2399 6.83995 12.2399 8.33995Z"
        fill={color}
      />
    </svg>
  );
}

export default backward;
