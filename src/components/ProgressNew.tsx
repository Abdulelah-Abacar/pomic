import React, { useEffect, useRef } from "react";

const Progress = ({ value = 0, className = "", ...props }) => {
  const progressRef = useRef(null);
  const indicatorRef = useRef(null);

  useEffect(() => {
    if (indicatorRef.current && progressRef.current) {
      const indicator = indicatorRef.current;
      indicator.style.transform = `translateX(-${100 - value}%)`;
    }
  }, [value]);

  return (
    <div
      ref={progressRef}
      className={`relative h-1 w-full overflow-hidden rounded-full bg-[#27272a] ${className}`}
      {...props}
    >
      <div
        ref={indicatorRef}
        className="size-full flex-1 bg-[#f4f4f5] transition-all"
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </div>
  );
};

export { Progress };
