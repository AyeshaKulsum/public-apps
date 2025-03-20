import React from 'react';
const FilledInfoSVG = ({ size = 20, extraClass }) => {
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

export default FilledInfoSVG;