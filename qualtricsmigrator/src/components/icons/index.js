import React from "react";

function RedirectSVG({ size = 16, color = "#56B0BB", extraClass = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 16 16"
      className={extraClass}
    >
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
        d="M10.222 3H13v2.778M9.11 6.889L13 3M11.89 9.11v2.778A1.11 1.11 0 0110.777 13H4.111A1.11 1.11 0 013 11.89V5.22a1.11 1.11 0 011.111-1.11H6.89"
      ></path>
    </svg>
  );
}

function CsvUploadSVG({ size = 72, color = "#919191", extraClass = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 72 72"
      className={extraClass}
    >
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
        d="M63 22.477V57a6 6 0 01-6 6H15a6 6 0 01-6-6V22.477a12 12 0 01.358-2.91l1.506-6.022A6 6 0 0116.684 9h38.631a6 6 0 015.821 4.545l1.506 6.022c.238.952.358 1.93.358 2.91v0z"
      ></path>
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
        d="M43.5 40.5L36 33l-7.5 7.5M36 51V33M62.906 21H9.094"
      ></path>
    </svg>
  );
}

function NavigationSVG({ width = 27, height = 12, color = "#2B2B2B", extraClass = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 27 12"
      className={extraClass}
    >
      <path
        fill={color}
        d="M1.5 5.25a.75.75 0 000 1.5v-1.5zm24.53 1.28a.75.75 0 000-1.06L21.257.697a.75.75 0 00-1.06 1.06L24.439 6l-4.242 4.243a.75.75 0 001.06 1.06L26.03 6.53zM1.5 6.75h24v-1.5h-24v1.5z"
      ></path>
    </svg>
  );
}

function FilledInfoSVG({ size = 20, extraClass }) {
  return (
    <svg
      width={size}
      height={size}
      className={extraClass}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
        fill="black"
        fill-opacity="0.08"
      />
      <path
        d="M8.75 13.5417H11.25"
        stroke="#848484"
        stroke-width="1.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10.1325 13.4375V9.375H9.0625"
        stroke="#848484"
        stroke-width="1.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle cx="9.84375" cy="7.03125" r="0.78125" fill="#848484" />
    </svg>
  );
};

export { RedirectSVG, CsvUploadSVG, NavigationSVG, FilledInfoSVG };
