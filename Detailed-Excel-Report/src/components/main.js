import React, { useEffect, useState } from "react";
import {
  API_BASE_URL,
  header,
  surveyTypes,
  basicFolders,
  visibilityTypes,
  displayMessages,
  resultTypes,
} from "../constants";
import SelectSurvey from "./SelectSurvey";
import Spinner from "./Spinner";
import StyledFlex from "./StyledFlex";
import { toast } from "@sparrowengg/twigs-react";

const Main = (props) => {
  const [groupedSurveyOptions, setGroupedSurveyOptions] = useState({});
  const [loader, setLoader] = useState(true);

  const getAllSurveys = async () => {
    try {
      const surveys = [];
      let has_next_page = true;
      let page = 1;
      while (has_next_page) {
        const response = await props.client.request.get(
          `${API_BASE_URL}/v3/surveys?page=${page}&&limit=100`,
          header
        );
        const jsonResponse = JSON.parse(response)?.body;
        if (!jsonResponse?.data) {
          toast({
            variant: resultTypes.ERROR,
            title: displayMessages.ERROR_MESSAGE,
            description: displayMessages.INVALID_RESPONSE_FROM_SERVER,
          });
          return;
        }
        has_next_page = jsonResponse.has_next_page;
        surveys.push(
          ...jsonResponse.data.filter(
            (survey) => surveyTypes[survey.survey_type]
          )
        );
        page++;
      }
      const surveyOptions = {};
      surveys.forEach((survey) => {
        let folderName = survey.survey_folder_name;
        if (
          folderName === basicFolders.GENERAL.name &&
          survey.visibility === visibilityTypes.MINE.name
        ) {
          folderName = basicFolders.MY_SURVEYS.name;
        }
        if (!surveyOptions[folderName]) {
          surveyOptions[folderName] = {
            label: folderName.toUpperCase(),
            name: folderName,
            options: [],
          };
        }
        surveyOptions[folderName].options.push({
          label: survey.name,
          value: survey.id,
        });
      });
      const groupedSurveyOptions = Object.values(surveyOptions);
      setGroupedSurveyOptions(groupedSurveyOptions);
    } catch (error) {
      console.error(`${displayMessages.ERROR_MESSAGE} : `, error);
      toast({
        variant: resultTypes.ERROR,
        title: displayMessages.ERROR_MESSAGE,
        description: displayMessages.SOMETHING_WENT_WRONG,
      });
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getAllSurveys();
  }, []);

  return (
    <StyledFlex>
      {!loader ? (
        <SelectSurvey
          groupedSurveyOptions={groupedSurveyOptions}
          props={props}
        />
      ) : (
        <StyledFlex css={{ width: "100%", height: "100vh" }}>
          <Spinner />
        </StyledFlex>
      )}
    </StyledFlex>
  );
};

export default Main;
