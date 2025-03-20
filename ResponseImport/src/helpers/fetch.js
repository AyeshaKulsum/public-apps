import { commonConstants } from "../constants/commonConstants";
import { domain } from "../constants/domain";
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
import { surveyTypes } from "../constants/surveyTypes";

const initilaizeClient = async () => {
  if (!window.client) {
    window.client = await window.app.initialized();
    await sleep(1000);
  }
}

const getAllSurveys = async (setSurveys) => {
  try {
    let surveys = [];
    let page = 1;
    let has_next_page = true;
    while(has_next_page) {
      const result = await window.client.request.get(`${domain}/v3/surveys?page=${page}`, {
        options: {
          headers: {
            Authorization: "Bearer <%=iparams.surveysparrow_api_key%>"
          }, isOAuth: false, maxAttempts: 5
        }
      });
      const parsedResult = JSON.parse(result).body;
      has_next_page = parsedResult.has_next_page;
      page++;
      surveys = [...surveys, ...parsedResult.data];
    }

    setSurveys(surveys.filter((survey) => survey.survey_type == surveyTypes.ClassicForm.name || survey.survey_type == surveyTypes.Conversational.name || survey.survey_type == surveyTypes.NPS.name || survey.survey_type == surveyTypes.NPSChat.name || survey.survey_type == surveyTypes.CES.name || survey.survey_type == surveyTypes.CESChat.name || survey.survey_type == surveyTypes.CSAT.name || survey.survey_type == surveyTypes.CSATChat.name).map((survey) => { return { value: survey, label: survey.name } }));
  } catch (error) {
      window.client.interface.alertMessage(commonConstants.internalErrorMessage, { type: "failure" });
    console.log(error);
  }
}

const getSurvey = async (setSurvey, id) => {
  try {
    const result = await window.client.request.get(`${domain}/v3/surveys/${id}`, {
      options: {
        headers: {
          Authorization: "Bearer <%=iparams.surveysparrow_api_key%>"
        }, isOAuth: false, maxAttempts: 5
      }
    });
    const parsedSurvey = JSON.parse(result).body.data;
    setSurvey(parsedSurvey);
  } catch (error) {
      window.client.interface.alertMessage(commonConstants.internalErrorMessage, { type: "failure" });
    console.log(error);
  }
}

const fetchQuestions = async (survey, setQuestions) => {
  try {
    let questions = [];
    let page = 1;
    let has_next_page = true;
    while(has_next_page) {
      const result = await window.client.request.get(`${domain}/v3/questions?survey_id=${survey.id}&page=${page}`, {
        options: {
          headers: {
            Authorization: "Bearer <%=iparams.surveysparrow_api_key%>"
          }, isOAuth: false, maxAttempts: 5
        }
      });
      const parsedResult = JSON.parse(result).body;
      has_next_page = parsedResult.has_next_page;
      page++;
      questions = [...questions, ...parsedResult.data];
    }
    setQuestions(questions);
  } catch (error) {
      window.client.interface.alertMessage(commonConstants.internalErrorMessage, { type: "failure" });
    console.log(error);
  }
}

const fetchVariables = async (survey, setVariable) => {
  try {
    let variables = [];
    let page = 1;
    let has_next_page = true;
    while(has_next_page) {
      const result = await window.client.request.get(`${domain}/v3/variables?survey_id=${survey.id}&page=${page}`, {
        options: {
          headers: {
            Authorization: "Bearer <%=iparams.surveysparrow_api_key%>"
          }, isOAuth: false, maxAttempts: 5
        }
      });
      const parsedResult = JSON.parse(result).body;
      has_next_page = parsedResult.has_next_page;
      page++;
      variables = [...variables, ...parsedResult.data];
    }

    setVariable(variables);
  } catch (error) {
      window.client.interface.alertMessage(commonConstants.internalErrorMessage, { type: "failure" });
    console.log(error);
  }
}

const fetchResponseProperties = async (setResponseProperties) => {
  try {
    const result = await window.client.request.get(`${domain}/v3/response_properties`, {
      options: {
        headers: {
          Authorization: "Bearer <%=iparams.surveysparrow_api_key%>"
        }, isOAuth: false, maxAttempts: 5
      }
    });
    setResponseProperties(JSON.parse(result).body.data);
  } catch (error) {
      window.client.interface.alertMessage(commonConstants.internalErrorMessage, { type: "failure" });
    console.log(error);
  }
}

const formatContactProperties = (properties) => {
  const result = properties.filter((property) => {
    if (property.name === "department_internal" || property.name === "team_internal" || property.name === "fullName" || property.name === "full_name" || property.name === "jobTitle" || property.name === "createddate") {
      return false;
    }
    return true;
  }).map((property) => { return ({ label: property.label, value: property.name }) });
  return [...result, { label: "Full Name", value: "full_name" }, { label: "Job Title", value: "job_title" }];
}
const getContactProperties = async () => {
  const result = await window.client.request.get(`${domain}/v3/contact_properties`, {
    options: {
      headers: {
        Authorization: "Bearer <%=iparams.surveysparrow_api_key%>"
      }, isOAuth: false, maxAttempts: 5
    }
  });
  const properties = formatContactProperties(JSON.parse(result).body.data);
  return properties;
}

const saveStatusToDb = async (setAccountData, setDataUpdated, status, accountData, failed) => {

  try {
    let url;
    try {
      const data = JSON.parse(await window.client.request.getDownloadUrl("csvMappingHandler", "urlToDownload"));
      if (data?.url) {
        url = data.url
      }
    } catch (error) {
      console.log(error);
    }

    if(!status.traceId) {
      status.traceId = Math.random().toString(36).substring(2,13);
    }

    const surveyId = accountData["surveyId"];
    if (surveyId && accountData[surveyId]) {
      if (!accountData[surveyId][status.traceId]) {
        accountData[surveyId][status.traceId] = {
          ...status, errors: null, importedBy: "User", date: Date.now(), errorUrl: url, failed: failed, surveyId: surveyId
        }
        accountData["uploading"] = false;
        await window.client.db.set("data", accountData);
        setAccountData(accountData);
        setDataUpdated(true);
      }
      else {
        console.log('Data with the traceId already exist');
      }
    }
    else {
      const result = {
        [status.traceId]: {
          ...status, errors: null, importedBy: "User", date: Date.now(), errorUrl: url, failed: failed, surveyId: surveyId
        }
      }
      accountData[surveyId] = result;
      accountData["uploading"] = false;
      await window.client.db.set("data", accountData);
      setAccountData(accountData);
      setDataUpdated(true);
    }
  } catch (error) {
      window.client.interface.alertMessage(commonConstants.internalErrorMessage, { type: "failure" });
    console.log(error);
  }
}

export {
  getAllSurveys,
  fetchQuestions,
  fetchVariables,
  saveStatusToDb,
  initilaizeClient,
  getSurvey,
  fetchResponseProperties,
  getContactProperties
}