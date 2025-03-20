import validateQuestion from './validateQuestion'
import { commonConstants } from '../constants/commonConstants';
import { surveyTypes } from '../constants/surveyTypes';

const autoMapping = async (survey, headers, sample, questionList, variableList, responseProperty, contactProperty,
  setSecondList, setSelectedContactProperty, setSelectedResponseProperty, setSelectedQuestion, setSelectedVariable,
  setAnswerPayload, setVariablePayload, setResponsePropertyPayload, setContactPropertyPayload) => {
  const autoSecondList = {};
  const autoAnswerPayLoad = {};
  const autoVariablePayload = {};
  const autoResponsePropertyPayload = {};
  const autoContactPropertyPayload = {};
  const autoSelectedQuestion = [];
  const autoSelectedVariable = [];
  const autoSelectedResponseProperty = [];
  const autoSelectedContactProperty = [];
  for (let i = 0; i < questionList.length; i++) {
    const result = headers.filter((header) => {
      return header.trim().toUpperCase() == questionList[i].label.trim().toUpperCase()
    })
    if (result?.length) {
      if (autoSecondList[result[0]]) {
        continue;
      }
      if (!validateQuestion(questionList[i].value, result[0], sample)) {
        continue;
      }
      autoSecondList[result[0]] = commonConstants.question;
      autoAnswerPayLoad[result[0]] = questionList[i];
      autoSelectedQuestion.push(questionList[i]);
    }
  }
  for (let i = 0; i < variableList.length; i++) {
    const result = headers.filter((header) => {
      return header.trim().toUpperCase() == variableList[i].label.trim().toUpperCase()
    })
    if (result?.length) {
      if (autoSecondList[result[0]]) {
        continue;
      }
      autoSecondList[result[0]] = commonConstants.variable;
      autoVariablePayload[result[0]] = variableList[i];
      autoSelectedVariable.push(variableList[i]);
    }
  }
  for (let i = 0; i < responseProperty.length; i++) {
    const result = headers.filter((header) => {
      return header.trim().toUpperCase() == responseProperty[i].label.trim().toUpperCase()
    })
    if (result?.length) {
      if (autoSecondList[result[0]]) {
        continue;
      }
      autoSecondList[result[0]] = commonConstants.responseProperty.name;
      autoResponsePropertyPayload[result[0]] = responseProperty[i];
      autoSelectedResponseProperty.push(responseProperty[i]);
    }
  }
  if (survey.survey_type == surveyTypes.NPS.name) {
    for (let i = 0; i < contactProperty.length; i++) {
      const result = headers.filter((header) => {
        return header.trim().toUpperCase() == contactProperty[i].label.trim().toUpperCase()
      })
      if (result?.length) {
        if (autoSecondList[result[0]]) {
          continue;
        }
        autoSecondList[result[0]] = commonConstants.contactProperty.name;
        autoContactPropertyPayload[result[0]] = contactProperty[i];
        autoSelectedContactProperty.push(contactProperty[i]);
      }
    }
    setSelectedContactProperty(autoSelectedContactProperty);
    setContactPropertyPayload(autoContactPropertyPayload);
  }
  setSecondList(autoSecondList);
  setAnswerPayload(autoAnswerPayLoad);
  setVariablePayload(autoVariablePayload);
  setResponsePropertyPayload(autoResponsePropertyPayload);
  setSelectedQuestion(autoSelectedQuestion);
  setSelectedVariable(autoSelectedVariable);
  setSelectedResponseProperty(autoSelectedResponseProperty);
}

export default autoMapping;