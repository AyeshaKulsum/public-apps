import React from "react";
import { keyframes, Box, styled } from "@sparrowengg/twigs-react";

const spin = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

const StyledBox = styled(Box, {
  borderRradius: "50%",
  width: "$7",
  height: "$7",
  borderRadius: "$round",
  borderStyle: "solid",
  borderWidth: "$md",
  borderBottomColor: "$neutral300",
  borderRightColor: "$neutral300",
  borderTopColor: "$neutral900",
  borderLeftColor: "$neutral900",
  animationDuration: "600ms",
  animationTimingFunction: "linear",
  animationIterationCount: "infinite",
  willChange: "transform",
  animationName: `${spin}`,
  variants: {
    size: {
      sm: {
        width: "$5",
        height: "$5",
      }, 
      md: {
        width: "$7",
        height: "$7",
      },
    },
    primary: {
      neutral900: {
        borderTopColor: "$neutral900",
        borderLeftColor: "$neutral900",
      },
      accent500: {
        borderTopColor: "$accent500",
        borderLeftColor: "$accent500",
      },
    },
    secondary: {
      neutral300: {
        borderBottomColor: "$neutral300",
        borderRightColor: "$neutral300",
      },
      accent200: {
        borderBottomColor: "$accent200",
        borderRightColor: "$accent200",
      },
    },
  },
  defaultVariants: {
    size: "md",
    primary: "neutral900",
    secondary: "neutral300", 
  },
});

export const Spinner = ({ size, primary, secondary }) => {
  return <StyledBox size={size} primary={primary} secondary={secondary} />;
};