function Paused({ color, className }: { color?: string; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 11 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.59313 6.41503L0.375 0.530029V15.4932L9.58938 9.58753C9.8576 9.41892 10.0787 9.1851 10.2321 8.9079C10.3855 8.63069 10.4662 8.31913 10.4665 8.00231C10.4669 7.6855 10.387 7.37375 10.2343 7.09618C10.0815 6.81861 9.86095 6.58427 9.59313 6.41503Z"
        fill={color}
      />
    </svg>
  );
}

export default Paused;
