import React from "react";
import { ForwardArrowIcon } from "@sparrowengg/twigs-react-icons";
import { Button, Flex } from "@sparrowengg/twigs-react";
const JumpToSurveyBuilder = ({ SurveyId }) => {
  return (
    <Flex justifyContent="center" css={{ marginTop: "$5"}}>
    <Button
      iconRight={<ForwardArrowIcon />}
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