import { header, API_BASE_URL, message } from '../constants/commonConstants';
import { questionType } from '../constants/questionConstants';
export async function postQuestion(surveyId, obj) {
  let res;
  let body = {};
  switch (obj.type){
    case questionType.multiChoice:
    case questionType.rankOrder:
    case questionType.dropDown:
      body.type = obj.type,
      body.text = obj.question,
      body.choices = obj.options;
    case questionType.slider:
    case questionType.opinionScale:
    case questionType.signature:
    case questionType.textInput:
    case  questionType.fileInput:
    case questionType.cameraInput:
    case questionType.consent:
    case questionType.urlInput:
    case questionType.yesNo:
    case questionType.rating:
    case questionType.msg:
    case questionType.numberInput:
    case questionType.emailInput:
    case questionType.phoneNumber:
    case questionType.dateTime:
      body.type = obj.type,
      body.text = obj.question;       
    case questionType.bipolarMatrix:
    case questionType.matrix:
      body.type = obj.type,
      body.text = obj.question,
      body.column = obj.column,
      body.row = obj.row;   
  } 
  try {
    res = await APIcall(surveyId, body);
    return JSON.parse(res).body ? message.success : message.error;
  } catch (err){
    console.log(err);
  }
}
async function APIcall(surveyId, body) {

  try {
    let client = window.app.initialized();
    const result = await client.request.post(
      `${API_BASE_URL}questions`, 
      header,
      {
        survey_id: surveyId,
        question: body
      }
    );
    return result ? result : (() => {
      throw new Error('error');
    })();
  } catch (err) {
    console.log(err);
  }
}