import { header, API_BASE_URL } from '../constants/commonConstants';
export async function postSurvey(survey) {

  try {
    let client = window.app.initialized();
    const response = await client.request.post(`${API_BASE_URL}surveys`, header, {
      name: survey.name,
      survey_type: survey.type,
    });
    return JSON.parse(response).body.data.id;
  } catch (err) {
    console.log(err);
  }
 
}