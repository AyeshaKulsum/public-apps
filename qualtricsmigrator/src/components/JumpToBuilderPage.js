import React from "react";
import { ForwardArrowIcon } from "@sparrowengg/twigs-react-icons";
import { Button, Flex, Text , Alert } from "@sparrowengg/twigs-react";

const JumpToSurveyBuilder = ({ SurveyId, isAllQuestionsFailed }) => {
  return (
    <Flex flexDirection="column" gap="$3">
      {isAllQuestionsFailed && <Alert
        status="error"
        size="sm"
        css={{
          marginTop: "$2",
          backgroundColor: "$white900",
          borderColor: "$white900",
          padding: "0",
        }}
      >
        <Text
          size="sm"
          weight="medium"
          css={{
            color: "$negative600",
          }}
        >
          All the questions migration got failed due to some reason.
        </Text>
      </Alert>}
      <Button
        rightIcon={<ForwardArrowIcon />}
        color="default"
        size="lg"
        onClick={() => {
          window.top.location.href =
            document.referrer + `builder/edit/${SurveyId}`;
        }}
      >
        Jump to Survey Builder
      </Button>
    </Flex>
  );
};
export default JumpToSurveyBuilder;
