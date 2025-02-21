function discover({
  color,
  className,
}: {
  color?: string;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 22C17.799 22 22.5 17.299 22.5 11.5C22.5 5.70101 17.799 1 12 1C6.20101 1 1.5 5.70101 1.5 11.5C1.5 17.299 6.20101 22 12 22Z"
        stroke={"currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.1915 8.86217L15.5 8L14.6378 12.3085C14.5476 12.7601 14.3257 13.1749 14.0002 13.5006C13.6747 13.8263 13.26 14.0485 12.8085 14.139L8.5 15L9.36217 10.6915C9.45263 10.2401 9.67458 9.8256 10.0001 9.50009C10.3256 9.17458 10.7401 8.95263 11.1915 8.86217Z"
        stroke={"currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default discover;
