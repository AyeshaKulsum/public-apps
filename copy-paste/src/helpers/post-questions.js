import { commonConstants } from "../constants/common-constants";

export async function postQuestion(surveyId, obj) {
  const { message, questionType, question } = commonConstants;
  let res;
  switch (obj.type) {
    case questionType.multiChoice:
    case questionType.rankOrder:
      let body = {
          type: obj.type,
          text: obj.question,
          choices: obj.options
        },
        res = await _apiHandler(surveyId, body);
      return typeof res !== question.STRING && JSON.parse(res)?.body?.data
        ? message.success
        : res; 

    case questionType.slider:
      body = {
        type: obj.type,
        text: obj.question,
        properties: {
          data: {
            slider_type: obj.slider_type
          }
        }
      };
      res = await _apiHandler(surveyId, body);
      return typeof res !== question.STRING && JSON.parse(res)?.body?.data
        ? message.success
        : res;

    case questionType.dropDown:
      body = {
        type: obj.type,
        text: obj.question,
        choices: obj.options
      };
      res = await _apiHandler(surveyId, body);
      return typeof res !== question.STRING && JSON.parse(res)?.body?.data
        ? message.success
        : res;

    case questionType.opinionScale:
      body = {
        type: obj.type,
        text: obj.question,
        properties: {
          data: {
            step: obj.step
          }
        }
      };
      res = await _apiHandler(surveyId, body);
      return typeof res !== question.STRING && JSON.parse(res)?.body?.data
        ? message.success
        : res;

    case questionType.signature:
      body = {
        type: obj.type,
        text: obj.question,
        properties: {
          data: {
            draw_signature: obj.draw_signature,
            type_signature: obj.type_signature,
            upload_signature: obj.upload_signature
          }
        }
      };
      res = await _apiHandler(surveyId, body);
      return typeof res !== question.STRING && JSON.parse(res)?.body?.data
        ? message.success
        : res;

    case questionType.textInput:
    case questionType.fileInput:
    case questionType.cameraInput:
    case questionType.consent:
    case questionType.urlInput:
    case questionType.rating:
    case questionType.contactForm:
    case questionType.msg:
    case questionType.numberInput:
    case questionType.emailInput:
    case questionType.phoneNumber:
    case questionType.dateTime:
      body = {
        type: obj.type,
        text: obj.question
      };
      res = await _apiHandler(surveyId, body);
      return typeof res !== question.STRING && JSON.parse(res)?.body?.data
        ? message.success
        : res;
    case questionType.yesNo:
      body = {
        type: obj.type,
        text: obj.question,
        properties: {
          data: {
            icon_shape: commonConstants.question.YES_NO_QUESTION_ICON
          }
        }
      };
      res = await _apiHandler(surveyId, body);
      return typeof res !== question.STRING && JSON.parse(res)?.body?.data
        ? message.success
        : res;

    case questionType.bipolarMatrix:
      body = {
        type: obj.type,
        text: obj.question,
        column: obj.column,
        row: obj.row
      };
      res = await _apiHandler(surveyId, body);
      return typeof res !== question.STRING && JSON.parse(res)?.body?.data
        ? message.success
        : res;

    case questionType.matrix:
      body = {
        type: obj.type,
        text: obj.question,
        column: obj.column
      };
      res = await _apiHandler(surveyId, body);
      return typeof res !== question.STRING && JSON.parse(res)?.body?.data
        ? message.success
        : res;
  }
}

async function _apiHandler(surveyId, body) {
  const { header, API_BASE_URL } = commonConstants;
  let result;
  try {
    let client = await window.app.initialized();
    if (body?.text) {
      result = await client.request.post(`${API_BASE_URL}questions`, header, {
        survey_id: surveyId,
        question: body
      });
    }
    return result;
  } catch (err) {
    console.log(err);
    if (err?.status === 402) {
      result = commonConstants.question.QUESTION_QUOTA;
      return result;
    }
    if (err?.status === 422) {
      result = commonConstants.question.WRONG_PAYLOAD;
      return result;
    }
    if (
      (err?.status === 500 && err?.response?.includes("Quota Exceeded")) ||
      err?.status === 429
    ) {
      result = commonConstants.question.API_QUOTA;
      return result;
    }
  }
}
