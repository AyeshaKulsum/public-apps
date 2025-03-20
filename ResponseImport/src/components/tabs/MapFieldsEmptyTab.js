import React from "react";
import { Flex, Text } from "@sparrowengg/twigs-react";
import { commonConstants } from "../../constants/commonConstants";

export const MapFieldsEmptyTab = () => {
  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
      css={{
        height: "60vh",
        width: "100vw"
      }}
    >
      <Text size="lg" weight="bold">
        {commonConstants.noData}
      </Text>
      <Text
        css={{
          marginTop: "$5",
          textAlign: "center",
          color:"$neutral300",
          width: "40%"
        }}
      >
        {commonConstants.noDataInCSV}
      </Text>
    </Flex>
  );
};
