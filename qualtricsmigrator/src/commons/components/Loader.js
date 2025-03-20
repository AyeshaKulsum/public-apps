import React from "react";
import { Flex, Box, Text, keyframes } from "@sparrowengg/twigs-react";

const fade = keyframes({
  "from": {
    opacity: 1
  },
  "to": {
    opacity: 0
  }
});

const Loader = ({ label }) => {
  return (
    <>
      {label && 
      <Text
        size="sm"
        css={{ textAlign: "center", color: "$neutral800", marginTop: "$3" }}
      >
        {label}
      </Text>}
      <Flex
        alignItems="center"
        justifyContent="center"
        css={{
          marginTop: "$10"
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
