import React from "react";

function DocumentClipSVG({ size = "48", color = "#7158F5", extraClass }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 48 48"
      className={extraClass}
    >
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M40 20V10a4 4 0 00-4-4H10a4 4 0 00-4 4v28a4 4 0 004 4h14M14 16h18m-18 8h8m-8 8h6"
      ></path>
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M30 29.55a5.24 5.24 0 011.89-2.978 5.061 5.061 0 013.318-1.064 4.964 4.964 0 013.616 1.286 5.162 5.162 0 011.676 3.51c0 3.608-5.057 4.798-5.057 7.196M35.675 41.77a.112.112 0 100 .224.112.112 0 000-.224"
      ></path>
    </svg>
  );
}

function GradientSVG({ color = "#978CF9" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="190"
      height="105"
      fill="none"
      viewBox="0 0 190 105"
    >
      <g filter="url(#filter0_f_464_5408)" opacity="0.5">
        <path
          d="M94.802 48.24c-25.851 0-46.802 25.075-46.802 56h93.604c0-30.925-20.951-56-46.802-56z"
          fill={color}
        ></path>
      </g>
      <defs>
        <filter
          id="filter0_f_464_5408"
          width="189.604"
          height="104"
          x="0"
          y="0.24"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          ></feBlend>
          <feGaussianBlur
            result="effect1_foregroundBlur_464_5408"
            stdDeviation="24"
          ></feGaussianBlur>
        </filter>
      </defs>
    </svg>
  );
}

const EmailSVG = ({ size = "32", color = "#4A9CA6", extraClass }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={extraClass}
    >
      <path
        d="M22.6667 6H9.33333C6.38781 6 4 8.38781 4 11.3333V20.6667C4 23.6122 6.38781 26 9.33333 26H22.6667C25.6122 26 28 23.6122 28 20.6667V11.3333C28 8.38781 25.6122 6 22.6667 6Z"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.33203 11.9766L14.9382 14.4209C15.2732 14.5669 15.6346 14.6426 16 14.6431C16.3654 14.6437 16.727 14.5691 17.0624 14.4241L22.6654 12.0014"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

const SMSSVG = ({ size = "32", color = "#4A9CA6", extraClass }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={extraClass}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9.60047 23.0372H7.04047C5.62607 23.0372 4.48047 21.8916 4.48047 20.4772V7.67719C4.48047 6.26279 5.62607 5.11719 7.04047 5.11719H24.9605C26.3749 5.11719 27.5205 6.26279 27.5205 7.67719V20.4772C27.5205 21.8916 26.3749 23.0372 24.9605 23.0372H17.1205L11.7317 27.8308C10.9061 28.5655 9.60047 27.9793 9.60047 26.8746V23.0372Z"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.60156 10.8744H22.4016"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.60156 16.6322H18.5616"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

const WhatsAppSVG = ({ size = "32", color = "#4A9CA6", extraClass }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={extraClass}
    >
      <g clip-path="url(#clip0_107_6022)">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M24.2709 7.68144C22.0762 5.48544 19.1576 4.27477 16.0482 4.27344C9.63889 4.27344 4.42422 9.48544 4.42289 15.8921C4.42022 17.9308 4.95489 19.9348 5.97355 21.7014L4.32422 27.7228L10.4869 26.1068C12.1922 27.0348 14.1016 27.5214 16.0429 27.5214H16.0482C22.4549 27.5214 27.6696 22.3081 27.6722 15.9014C27.6736 12.7974 26.4656 9.87877 24.2709 7.68144Z"
          stroke={color}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M17.4609 18.0799L18.0023 17.5425C18.4996 17.0492 19.2863 16.9865 19.8596 17.3892C20.4143 17.7785 20.9156 18.1279 21.3823 18.4532C22.1236 18.9679 22.2129 20.0239 21.5743 20.6612L21.0956 21.1399"
          stroke={color}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M10.8594 10.9045L11.338 10.4259C11.9754 9.78854 13.0314 9.87788 13.546 10.6179C13.87 11.0845 14.2194 11.5859 14.61 12.1405C15.0127 12.7139 14.9514 13.5005 14.4567 13.9979L13.9194 14.5392"
          stroke={color}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M21.093 21.1378C19.1184 23.1032 15.7997 21.4338 13.1797 18.8125"
          stroke={color}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M13.1841 18.8196C10.5641 16.1982 8.89476 12.8809 10.8601 10.9062"
          stroke={color}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M13.9219 14.5391C14.3472 15.2097 14.8925 15.8737 15.5085 16.4897L15.5112 16.4924C16.1272 17.1084 16.7912 17.6537 17.4619 18.0791"
          stroke={color}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_107_6022">
          <rect width="32" height="32" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

function TriggerSVG({ size = "32", color = "#56B0BB", extraClass }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={extraClass}
    >
      <path
        d="M6.66406 11.9974C6.66406 6.84273 10.8427 2.66406 15.9974 2.66406C21.1521 2.66406 25.3307 6.84273 25.3307 11.9974M10.6641 11.9974C10.6641 9.05206 13.0521 6.66406 15.9974 6.66406C18.9427 6.66406 21.3307 9.05206 21.3307 11.9974M18.0692 17.3307V12.6641C18.0692 11.5601 17.1732 10.6641 16.0692 10.6641C14.9652 10.6641 14.0692 11.5601 14.0692 12.6641V21.3307L12.8678 20.1294C12.0585 19.3201 10.7465 19.3201 9.93715 20.1294C9.23848 20.8281 9.13048 21.9227 9.67848 22.7441L13.2772 28.1427C13.7718 28.8854 14.6052 29.3307 15.4972 29.3307H22.5478C23.8932 29.3307 25.0265 28.3294 25.1945 26.9947L25.9172 21.2121C26.0945 19.7894 25.1158 18.4801 23.7012 18.2494L18.0692 17.3307Z"
        stroke={color}
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

function AddFilterSVG({ size = "20", color = "#6A6A6A", extraClass }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={extraClass}
    >
      <path
        d="M2.56689 3.75H16.5627"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M2.56689 8.125H16.5627"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M2.56689 12.5H8.43773"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M13.75 17.9166V12.0833"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16.6668 15H10.8335"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export {
  DocumentClipSVG,
  GradientSVG,
  EmailSVG,
  SMSSVG,
  WhatsAppSVG,
  TriggerSVG,
  AddFilterSVG,
};
