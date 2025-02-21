function forward({
  color,
  className,
  onClick,
}: {
  color?: string;
  className?: string;
  onClick: () => void;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <path
        opacity="0.4"
        d="M2 8.33995V15.66C2 17.16 3.62999 18.1 4.92999 17.35L8.10001 15.5199L11.27 13.69L11.76 13.41V10.59L11.27 10.31L8.10001 8.47997L4.92999 6.64995C3.62999 5.89995 2 6.83995 2 8.33995Z"
        fill={color}
      />
      <path
        d="M11.7598 8.33995V15.66C11.7598 17.16 13.3897 18.1 14.6797 17.35L17.8597 15.5199L21.0298 13.69C22.3198 12.94 22.3198 11.06 21.0298 10.31L17.8597 8.47997L14.6797 6.64995C13.3897 5.89995 11.7598 6.83995 11.7598 8.33995Z"
        fill={color}
      />
    </svg>
  );
}

export default forward;
