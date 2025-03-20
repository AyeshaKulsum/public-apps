import { domain } from '../constants/filteringAppConstants';

const config = {
  options: {
    headers: {
      Authorization: 'Bearer <%= iparams.surveysparrow_api_key %>',
    },
    isOAuth: false,
    maxAttempts: 5,
  },
};

const surveyOptionsFetch = async (props) => {
  try {
    const survey = JSON.parse(
      await props.client.request.get(`${domain}/v3/surveys`, config)
    );

    const surveyOptions = [];
    survey["body"]["data"].forEach((element) => {
      surveyOptions.push({
        id: element.id,
        label: element.name,
        value: element.id,
      });
    });

    return surveyOptions;
  } catch (e) {
    console.log(e);
    return [];
  }
};

const channelOptionsFetch = async (props, survey_id, share_type) => {
  try {
    const survey = JSON.parse(
      await props.client.request.get(
        `${domain}/v3/channels?survey_id=${survey_id}&type=${share_type}`,
        config
      )
    );

    const surveyOptions = [];
    survey["body"]["data"].forEach((element) => {
      surveyOptions.push({
        id: element.id,
        label: element.name,
        value: element.id,
      });
    });

    return surveyOptions;
  } catch (e) {
    console.log(e);
    return [];
  }
};

const getSurveyVariables = async (props, surveyId) => {
  try {
    let variables = [];
    let page = 1;
    let has_next_page = true;

    while (has_next_page) {
      const result = await props.client.request.get(
        `${domain}/v3/variables?survey_id=${surveyId}&page=${page}`,
        config
      );
      const parsedResult = JSON.parse(result).body;
      has_next_page = parsedResult?.has_next_page;
      page++;
      variables = [...variables, ...parsedResult.data];
    }

    return variables;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export { surveyOptionsFetch, channelOptionsFetch, getSurveyVariables };
