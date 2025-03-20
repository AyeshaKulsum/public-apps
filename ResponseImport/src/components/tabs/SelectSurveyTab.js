import React from "react";
import { Box, Flex, Text } from "@sparrowengg/twigs-react";
import Select from "react-select";
import { commonConstants } from "../../constants/commonConstants";
import Loader from "../Loader";

export const SelectSurveyTab = ({
  setSurvey,
  survey,
  surveys,
  uploadRef,
  loading
}) => {
  return loading ? (
    <Loader />
  ) : (
    <Flex
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap="$5"
    >
      <Flex alignItems="center" justifyContent="center" flexDirection="column">
        <Text size={"lg"} weight="bold">
          {commonConstants.selectSurvey}
        </Text>
        <Text
          css={{
            marginTop: "$5",
            color: "$neutral300"
          }}
        >
          {commonConstants.chooseSurveyToMigrate}
        </Text>
      </Flex>
      <Box
        style={{
          width: "448px"
        }}
      >
        <Select
          options={surveys.length ? surveys : []}
          value={
            survey
              ? surveys.filter((option) => option.value.id == survey.id)
              : null
          }
          name="color"
          onChange={(e) => {
            setSurvey(e.value);
            setTimeout(() => {
              uploadRef.current.focus();
              uploadRef.current.click();
            }, 10);
          }}
        />
      </Box>
    </Flex>
  );
};
