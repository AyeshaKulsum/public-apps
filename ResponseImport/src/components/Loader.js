import React from "react";
import { Flex, Box, keyframes } from "@sparrowengg/twigs-react";

const fade = keyframes({
  "from": {
    opacity: 1
  },
  "to": {
    opacity: 0
  }
});

const Loader = () => {
  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="center"
        css={{
          marginTop: "$10",
          height: "80vh"
        }}
      >
        <Flex
          alignItems="center"
          justifyContent="space-between"
          css={{
            flexFlow: "row nowrap",
            width: "3.5em",
            "& div": {
              width: "0.8em",
              height: "0.8em",
              borderRadius: "$pill",
              backgroundColor: "$black900",
              animation: `${fade} 0.8s ease-in-out alternate infinite`,
              "&:nth-of-type(1)": {
                animationDelay: "-0.4s"
              },
              "&:nth-of-type(2)": {
                animationDelay: "-0.2s"
              }
            }
          }}
        >
          <Box></Box>
          <Box></Box>
          <Box></Box>
        </Flex>
      </Flex>
    </>
  );
};
export default Loader;