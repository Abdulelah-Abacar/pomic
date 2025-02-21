interface props {
  color?: string;
  className?: string;
}

function arrow({ color, className }: props) {
  return (
    <svg
      className={className}
      viewBox="0 0 9 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.609863 0.800019C0.501511 0.900473 0.414009 1.02129 0.352352 1.15556C0.290696 1.28984 0.256095 1.43494 0.250523 1.58259C0.244951 1.73024 0.268518 1.87754 0.319879 2.01608C0.371241 2.15462 0.449389 2.28169 0.549863 2.39002L5.84036 8.00002L0.549862 13.61C0.449401 13.7184 0.371263 13.8454 0.319909 13.984C0.268555 14.1225 0.244991 14.2698 0.250562 14.4174C0.256133 14.5651 0.290732 14.7102 0.35238 14.8445C0.414029 14.9787 0.501522 15.0996 0.609863 15.2C0.718203 15.3005 0.84527 15.3786 0.983808 15.43C1.12235 15.4813 1.26964 15.5049 1.41729 15.4993C1.56493 15.4937 1.71004 15.4592 1.84431 15.3975C1.97859 15.3359 2.0994 15.2484 2.19986 15.14L8.19986 8.76502C8.3928 8.55699 8.5 8.28374 8.5 8.00002C8.5 7.7163 8.3928 7.44305 8.19986 7.23502L2.19986 0.860019C2.09941 0.751667 1.97859 0.664164 1.84432 0.602508C1.71005 0.540851 1.56494 0.506249 1.41729 0.500678C1.26964 0.495106 1.12234 0.518674 0.983803 0.570035C0.845263 0.621397 0.718197 0.699546 0.609863 0.800019Z"
        fill={color}
      />
    </svg>
  );
}

export default arrow;
