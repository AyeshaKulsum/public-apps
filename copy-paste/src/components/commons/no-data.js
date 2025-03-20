import React, { ReactNode } from "react";
import { Flex, Text, Heading, Box } from "@sparrowengg/twigs-react";
import { PageIcon } from "@sparrowengg/twigs-react-icons";

const Gradient = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="129"
      height="124"
      viewBox="0 0 129 124"
      fill="none"
    >
      <g opacity="0.5" filter="url(#filter0_f_333_1087)">
        <ellipse
          cx="64.5403"
          cy="61.885"
          rx="31.7403"
          ry="29.7143"
          fill="#A3AEBD"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_333_1087"
          x="0.800049"
          y="0.170776"
          width="127.48"
          height="123.429"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="16"
            result="effect1_foregroundBlur_333_1087"
          />
        </filter>
      </defs>
    </svg>
  );
};

const BorderLine = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="327"
      height="2"
      viewBox="0 0 327 2"
      fill="none"
    >
      <path
        d="M0 1H327"
        stroke="url(#paint0_linear_527_241)"
        stroke-opacity="0.15"
      />
      <defs>
        <linearGradient
          id="paint0_linear_527_241"
          x1="49.1275"
          y1="2"
          x2="280.455"
          y2="1.99631"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#8389AD" stop-opacity="0" />
          <stop offset="0.501997" stop-color="#8389AD" />
          <stop offset="1" stop-color="#8389AD" stop-opacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const NoData = ({ title, icon }) => {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      css={{ position: "relative" }}
    >
      <Box css={{ zIndex: 2 }}>
      <Gradient />
      </Box>
      <Box
        css={{
          background: "$white900",
          paddingBlock: "13px 7px",
          paddingInline: "9px",
          borderRadius: "10px 10px 0 0",
          border: "$borderWidths$xs solid $secondary100",
          borderBottom: "none",
          position: "absolute",
          left: "44%",
          top: "13%", 
          zIndex: 3
        }}
      >
        <PageIcon size={32} style={{ color: "#444B5A" }}  />
      </Box>
      <Flex
      flexDirection="column"
      alignItems="center"
        css={{
          background: "#F2F5F8",
          position: "absolute",
          bottom: "10%", 
          borderTop: "$borderWidths$xs solid $rgba(131, 137, 173, 0.5)",
          zIndex: 5
        }}
      >
        <BorderLine />
        <Text
          size="md"
          css={{
            paddingTop: "$8",
            color: "$neutral800",
            zIndex: 2
          }}
        >
          No Question Added
        </Text>
      </Flex>
    </Flex>
  );
};

export default NoData;
