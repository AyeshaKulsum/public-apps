import React from "react";
import { DocumentClipSVG, GradientSVG } from "../../../icons";
import { Box, Button, Flex, Text } from "@sparrowengg/twigs-react";

const NoShareState = ({ setRouter }) => {
  return (
    <Flex
      css={{ width: "100%", height: "100vh", background: "$white900" }}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Flex flexDirection="column" css={{ width: "480px" }}>
        <Flex
          flexDirection="column"
          alignItems="center"
          css={{ position: "relative" }}
        >
          <Flex
            alignItems="center"
            justifyContent="center"
            css={{
              width: "$20",
              height: "$19",
              borderRadius: "$2xl $2xl 0 0",
              borderBottom: "0 !important",
              borderWidth: "$borderWidths$xs",
              borderStyle: "solid",
              borderColorOpacity: ["$accent500", 0.06],
              zIndex: "2",
              backgroundColor: "$white900",
            }}
          >
            <DocumentClipSVG />
          </Flex>
          <Box
            css={{
              width: "480px",
              borderBottomWidth: "$borderWidths$xs",
              borderBottomStyle: "solid",
              borderImageSource:
                "linear-gradient(90deg, rgba(100, 116, 139, 0) 15.02%, rgba(100, 116, 139, 0.15) 50.54%, rgba(100, 116, 139, 0) 85.77%)",
              borderImageSlice: 1,
              position: "absolute",
              zIndex: "3",
              bottom: "-1px",
            }}
          />
          <Box css={{ position: "absolute", top: "0" }}>
            <GradientSVG />
          </Box>
        </Flex>
        <Flex
          flexDirection="column"
          alignItems="center"
          gap="$8"
          css={{
            width: "100%",
            backgroundColor: "$white900",
            padding: "$16 0",
            zIndex: "2",
          }}
        >
          <Text
            weight="bold"
            css={{ color: "$neutral900", fontSize: "$xl", textAlign: "center" }}
          >
            No Shares created yet
          </Text>
          <Text size="md" css={{ color: "$neutral800", textAlign: "center" }}>
            Create and manage survey distributions with customizable preferences
            for each contact.
          </Text>
          <Button
            size="lg"
            css={{ marginTop: "$8" }}
            onClick={() => setRouter("ChooseContactList")}
          >
            Configure Shares
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default NoShareState;
