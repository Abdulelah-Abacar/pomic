import React from "react";

function Mute({
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
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M18 16.75C17.84 16.75 17.69 16.7 17.55 16.6C17.22 16.35 17.15 15.88 17.4 15.55C18.66 13.87 18.93 11.64 18.12 9.71001C17.96 9.33001 18.14 8.89001 18.52 8.73001C18.9 8.57001 19.34 8.75001 19.5 9.13001C20.52 11.55 20.17 14.36 18.6 16.46C18.45 16.65 18.23 16.75 18 16.75Z"
        fill={color}
      />
      <path
        d="M19.83 19.25C19.67 19.25 19.52 19.2 19.38 19.1C19.05 18.85 18.98 18.38 19.23 18.05C21.37 15.2 21.84 11.38 20.46 8.09002C20.3 7.71002 20.48 7.27002 20.86 7.11002C21.24 6.95002 21.68 7.13002 21.84 7.51002C23.43 11.29 22.89 15.67 20.43 18.95C20.29 19.15 20.06 19.25 19.83 19.25Z"
        fill={color}
      />
      <path
        opacity="0.4"
        d="M14.04 12.96C14.67 12.33 15.75 12.78 15.75 13.67V16.6C15.75 18.32 15.13 19.61 14.02 20.23C13.57 20.48 13.07 20.6 12.55 20.6C11.75 20.6 10.89 20.33 10.01 19.78L9.36998 19.38C8.82998 19.04 8.73998 18.28 9.18998 17.83L14.04 12.96Z"
        fill={color}
      />
      <path
        opacity="0.4"
        d="M14.02 3.78003C12.9 3.16003 11.47 3.32003 10.01 4.23003L7.09 6.06003C6.89 6.18003 6.66 6.25003 6.43 6.25003H5.5H5C2.58 6.25003 1.25 7.58003 1.25 10V14C1.25 16.42 2.58 17.75 5 17.75H5.5H6.25L15.75 8.25003V7.41003C15.75 5.69003 15.13 4.40003 14.02 3.78003Z"
        fill={color}
      />
      <path
        d="M21.77 2.23C21.47 1.93 20.98 1.93 20.68 2.23L2.23 20.69C1.93 20.99 1.93 21.48 2.23 21.78C2.38 21.92 2.57 22 2.77 22C2.97 22 3.16 21.92 3.31 21.77L21.77 3.31C22.08 3.01 22.08 2.53 21.77 2.23Z"
        fill={color}
      />
    </svg>
  );
}

export default Mute;
