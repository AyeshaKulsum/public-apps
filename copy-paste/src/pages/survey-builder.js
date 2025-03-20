import React, { useContext, useEffect, useState } from "react";
import { Box, Flex } from "@sparrowengg/twigs-react";
import Builder from "../components/builder/builder";
import Preview from "../components/builder/preview";
import Navbar from "../components/commons/navbar";
import { Spinner } from "../components/commons/spinner";
import { commonConstants } from "../constants/common-constants";
import { GlobalContext } from "../context";

const SurveyBuilder = () => {
  const [question, setQuestion] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [loader, setLoader] = useState(true);
  const [client, setClient] = useState(null);
  const [currentSelectedType, setCurrentSelectedType] = useState([]);
  const { handleSurveyType, handleSurveyId } = useContext(GlobalContext);
  const { header, API_BASE_URL } = commonConstants;

  const getSurvey = async (surveyId, client) => {
    try {
      const survey = await client.request.get(
        `${API_BASE_URL}surveys/${surveyId}`,
        header
      );
      const data = JSON.parse(survey)?.body?.data;
      handleSurveyType(data?.survey_type);
    } catch (err) {
      console.log(err);
      if(err?.status === 500 && err?.response?.includes(commonConstants.question.QUOTA_EXCEEDED)){
        client?.interface?.alertMessage(`No questions created. API quota reached.`,
        { type: "failure" }
      );
      await client?.interface?.handleModal("close");
      }
    } finally {
      setLoader(false);
    }
  };
  
  const getSurveyId = async (client) => {
    try {
      const surveyId = await client.data.get("getSurveyId");
      await getSurvey(surveyId, client);
      handleSurveyId(surveyId);
    } catch (err) {
      console.log(err);
      if(err?.status === 500 && err?.response?.includes(commonConstants.question.QUOTA_EXCEEDED)){
        client?.interface?.alertMessage(`No questions created. API quota reached.`,
        { type: "failure" }
      );
      await client?.interface?.handleModal("close")
      }
    }
  };

  useEffect(() => {
    const client = window?.app?.initialized();
    getSurveyId(client);
    setClient(client);
  }, []);

  return (
    <>
      {loader ? (
        <Flex
          css={{ width: "100%", height: "100vh" }}
          justifyContent="center"
          alignItems="center"
        >
          <Spinner />
        </Flex>
      ) : (
        <Box css={{ width: "100vw", height: "100vh" }}>
          <Navbar client={client} question={question} />
          <Flex
            css={{
              width: "100%",
              height: "calc( 658px - 73px )"
            }}
          >
            <Builder setQuestion={setQuestion} selectedType={selectedType} setSelectedType={setSelectedType} setCurrentSelectedType={setCurrentSelectedType} />
            <Preview
              question={question}
              setQuestion={setQuestion}
              setSelectedType={setSelectedType}
              selectedType={selectedType}
              setCurrentSelectedType={setCurrentSelectedType}
              currentSelectedType={currentSelectedType}
            />
          </Flex>
        </Box>
      )}
    </>
  );
};

export default SurveyBuilder;
