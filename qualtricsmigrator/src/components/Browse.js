import {
  Text,
  Select,
  Flex,
  FormInput,
  Button,
  Alert,
  FormLabel,
  Tooltip,
  Box,
} from "@sparrowengg/twigs-react";
import React from "react";
import {
  surveySurveyTypeLabelMapping,
  surveyTypes,
} from "../constants/qualtricsConstants";
import StatusTable from "./StatusTable";
import { FilledInfoSVG } from "./icons";

const Browse = (props) => {
  const {
    folders,
    setChosenFolder,
    setSurveyName,
    setSurveyType,
    surveyName,
    unsupportedQuestionsList,
    fileName,
    proceedHandler,
    loader,
    trimFailedList,
    hasUploaded,
    chosenFolder,
    surveyType,
    sectionsCount,
    npsQuestion,
  } = props;
  const conversationalSurveys = [
    surveyTypes.npsChat,
    surveyTypes.conversational,
    surveyTypes.cesChat,
    surveyTypes.csatChat,
  ];
  const CXSurveys = [
    surveyTypes.npsChat,
    surveyTypes.cesChat,
    surveyTypes.csatChat,
    surveyTypes.ces,
    surveyTypes.nps,
    surveyTypes.csat,
  ];
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      css={{ width: "100%", minHeight: "80vh", paddingTop: "$28" }}
    >
      <Flex flexDirection="column" gap="$20" css={{ width: "568px" }}>
        <Flex flexDirection="column" gap="$12">
          <Flex flexDirection="column" gap="$4">
            <Text
              weight="bold"
              css={{ color: "$neutral900", fontSize: "23px" }}
            >
              Survey Details
            </Text>
            <Flex alignItems="center" gap="$4">
              <Text css={{ color: "$neutral900" }}>Uploaded File :</Text>
              <Text weight="medium" css={{ color: "$neutral900" }}>
                {fileName}
              </Text>
            </Flex>
          </Flex>
          <Box css={{ position: "relative" }}>
            <Box css={{ position: "absolute", top: "4%", left: "15%" }}>
              <Tooltip
                content="Enter name of the survey with minimum of 3 characters."
                side="right"
              >
                <Flex>
                  <FilledInfoSVG size="16" />
                </Flex>
              </Tooltip>
            </Box>
            <FormInput
              label="Survey Name"
              value={surveyName}
              size="xl"
              placeholder="Enter survey name"
              onChange={(e) => setSurveyName(e.target.value)}
              showCount={true}
              maxLength={60}
              css={{ borderRadius: "$xl" }}
            />
          </Box>
          <Flex flexDirection="column">
            <FormLabel css={{ marginBottom: "$2" }}>
              <Flex alignItems="center" gap="$2">
                Choose survey type
                <Tooltip
                  side="right"
                  content="Please select a survey type from the list for creating your survey."
                >
                  <Flex css={{ paddingTop: "2px" }}>
                    <FilledInfoSVG size="16" />
                  </Flex>
                </Tooltip>
              </Flex>
            </FormLabel>
            <Select
              defaultValue={{
                label: "Classic Survey",
                value: "ClassicForm",
              }}
              size="xl"
              options={Object.entries(surveySurveyTypeLabelMapping).map(
                ([key, value]) => {
                  return {
                    label: value,
                    value: key,
                  };
                }
              )}
              onChange={(e) => {
                trimFailedList(
                  conversationalSurveys.includes(e.value),
                  e.value === surveyTypes.classicForm
                );
                setSurveyType(e.value);
              }}
              css={{ ".twigs-select__control": { borderRadius: "$xl" } }}
            />
            {conversationalSurveys.includes(surveyType) &&
              sectionsCount > 1 && ( //base section is individualQuestions section. so count atleast 1 is needed to validate whether the file has sections or not.
                <Alert
                  status="warning"
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
                      color: "$neutral800",
                    }}
                  >
                    Selected survey type does not support sections.
                  </Text>
                </Alert>
              )}
          </Flex>
          <Box>
            <FormLabel css={{ marginBottom: "$2" }}>
              <Flex alignItems="center" gap="$2">
                Choose a folder
                <Tooltip
                  content="Select a folder where you want your survey to be created."
                  side="right"
                >
                  <Flex css={{ paddingTop: "2px" }}>
                    <FilledInfoSVG size="16" />
                  </Flex>
                </Tooltip>
              </Flex>
            </FormLabel>
            <Select
              size="xl"
              options={folders}
              defaultValue={chosenFolder}
              onChange={(e) => setChosenFolder(e)}
              css={{ ".twigs-select__control": { borderRadius: "$xl" } }}
            />
          </Box>
        </Flex>
        <Flex flexDirection="column" gap="$3" >
        {(CXSurveys.includes(surveyType) && !npsQuestion) && <Alert
          status="error"
          size="sm"
          css={{
            backgroundColor: "$white900",
            borderColor: "$white900",
            padding: "0",
          }}
        >
          <Text
            size="sm"
            weight="medium"
            css={{
              color: "$neutral800",
            }}
          >
           No NPS question found in the uploaded file.
          </Text>
        </Alert>}
        <Button
          size="xl"
          disabled={
            !surveyName ||
            surveyName.length < 3 ||
            !fileName ||
            !hasUploaded ||
            loader ||
            (CXSurveys.includes(surveyType) && !npsQuestion)
          }
          loading={loader}
          onClick={() => {
            proceedHandler();
          }}
        >
          Migrate & Jump to Survey Builder
        </Button>
        </Flex>
        {unsupportedQuestionsList.length > 0 && (
          <>
            <Box css={{ height: "1px", backgroundColor: "$neutral200" }} />
            <Flex
              flexDirection="column"
              gap="$12"
              css={{ marginBottom: "$10" }}
            >
              <Flex flexDirection="column" gap="$4">
                <Text
                  weight="bold"
                  css={{ color: "$neutral900", fontSize: "23px" }}
                >
                  Unsupported Question Types
                </Text>
                <Text css={{ color: "$neutral900" }}>
                  The list below shows questions that are not supported by
                  SurveySparrow's question types.
                </Text>
              </Flex>
              <StatusTable Questiondata={unsupportedQuestionsList} />
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default Browse;
