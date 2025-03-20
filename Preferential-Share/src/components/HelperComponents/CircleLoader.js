import React from "react";
import { keyframes, Box, styled } from "@sparrowengg/twigs-react";
const spin = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});
const StyledBox = styled(Box, {
  width: "$7",
  height: "$7",
  borderRadius: "$round",
  borderStyle: "solid",
  borderWidth: "$md",
  borderBottomColor: `$primary300`,
  borderRightColor: "$primary300",
  borderTopColor: "$primary900",
  borderLeftColor: "$primary900",
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
  },
  defaultVariants: {
    size: "md",
  },
});
const CircleLoader = ({ size }) => {
  return <StyledBox size={size} />;
};
export default CircleLoader;