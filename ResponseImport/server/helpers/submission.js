const googlePhoneLib = require('google-libphonenumber');
const phoneUtil = googlePhoneLib.PhoneNumberUtil.getInstance();

const { answerFormatTypes } = require("../constants/answerType");
const { mappingConstants } = require("../constants/mappings");
const { questionProperties } = require("../constants/question");
const { dataTypeConstants } = require("../constants/dataType");

const isAnswerTypeString = (answer) => { return (typeof answer === answerFormatTypes.string.name || answer instanceof String) };


const getNPSScoreAnswerPayload = ({ answer, mapping }) => {
  let finalAnswer = answer;
  if (isAnswerTypeString(answer)) {
    finalAnswer = parseInt(answer);
  }
  const payload = {
    question_id: mapping[mappingConstants.surveySparrowQuestionID.name],
    answer: finalAnswer,
  };
  return payload;
};

const getTextAnswerPayload = ({ answer, mapping, questionType }) => {
  let finalAnswer = answer;
  if(questionType === questionProperties.EmailInput.name || questionType === dataTypeConstants.email){
    finalAnswer = finalAnswer.toLowerCase();
  }
  if (!isAnswerTypeString(answer)) {
    finalAnswer = answer.toString();
  }
  const payload = {
    question_id: mapping[mappingConstants.surveySparrowQuestionID.name],
    answer: finalAnswer,
  };
  return payload;
};


const getContactFormTextAnswerPayload = ({ answer, mapping, dataType }) => {
  let finalAnswer = answer;
  if(dataType === dataTypeConstants.email){
    finalAnswer = finalAnswer.toLowerCase();
  }
  if (!isAnswerTypeString(answer)) {
    finalAnswer = answer.toString();
  }
  const payload = {
    question_id: mapping[mappingConstants.surveySparrowQuestionID.name],
    parent_question_id: mapping[mappingConstants.surveySparrowParentQuestionID.name],
    answer: finalAnswer,
  };
  return payload;
};

const getContactFormNumberAnswerPayload = ({ answer, mapping }) => {
  let finalAnswer = answer;
  if (isAnswerTypeString(answer)) {
    finalAnswer = parseInt(answer);
  }
  const payload = {
    question_id: mapping[mappingConstants.surveySparrowQuestionID.name],
    parent_question_id: mapping[mappingConstants.surveySparrowParentQuestionID.name],
    answer: finalAnswer,
  };
  return payload;
};

const getYesOrNoAnswerPayload = ({ answer, mapping }) => {
  let finalAnswer = answer;
  if (!isAnswerTypeString(answer)) {
    finalAnswer = answer.toString();
  }
  const payload = {
    question_id: mapping[mappingConstants.surveySparrowQuestionID.name],
    answer: finalAnswer,
  };
  return payload;
};

const splitMultipleAnswers = (mapping, finalAnswer) => {
  const splitMultipleAnswer = finalAnswer.split(',');
  const ssMappedAnswersId = [];
  const leftOverAnswers = [];
  let other_txt = null;
  splitMultipleAnswer.forEach(choice => {
    const value = mapping[mappingConstants.answerMapping.name][choice.trim()];
    if(mapping['otherChoiceId'] && value === mapping['otherChoiceId']){
      ssMappedAnswersId.push(mapping['otherChoiceId']);
      other_txt = choice;
    }
    else if (value) {
      ssMappedAnswersId.push(value);
    }
    else{
      leftOverAnswers.push(choice.trim());
    }
  });
  if(mapping['otherChoiceId'] && leftOverAnswers.length > 0 && !other_txt){
    ssMappedAnswersId.push(mapping['otherChoiceId']);
    other_txt = leftOverAnswers[0];
  }
  return { ssMappedAnswersId, other_txt };
};

const splitMultipleAnswersContactAndMatrix = (mapping, finalAnswer) => {
  const splitMultipleAnswer = finalAnswer.split(',');
  const ssMappedAnswersId = [];
  splitMultipleAnswer.forEach(choice => {
    const value = mapping[mappingConstants.answerMapping.name][choice.trim()];
    if (value) {
      ssMappedAnswersId.push(value);
    }
  });
  return ssMappedAnswersId;
}

const getMultipleChoiceAnswer = ({ answer, mapping }) => {
  let finalAnswer = answer;
  if (!isAnswerTypeString(answer)) {
    finalAnswer = answer.toString();
  }
  const answers = splitMultipleAnswers(mapping, finalAnswer);
  const payload = {
    question_id: mapping[mappingConstants.surveySparrowQuestionID.name],
    answer: answers.ssMappedAnswersId,
  };
  if(answers.other_txt){
    payload.other_txt = answers.other_txt;
  }
  return payload;
};

const getMultipleChoiceContactAnswer = ({ answer, mapping }) => {
  let finalAnswer = answer;
  if (!isAnswerTypeString(answer)) {
    finalAnswer = answer.toString();
  }
  const payload = {
    question_id: mapping[mappingConstants.surveySparrowQuestionID.name],
    answer: splitMultipleAnswersContactAndMatrix(mapping, finalAnswer),
  };
  return payload;
}

const getMatrixAnswerPayload = ({ answer, mapping }) => {
  let finalAnswer = answer;
  if (!isAnswerTypeString(answer)) {
    finalAnswer = answer.toString();
  }
  const payload = {
    question_id: mapping[mappingConstants.surveySparrowQuestionID.name],
    parent_question_id: mapping[mappingConstants.surveySparrowParentQuestionID.name],
    answer: splitMultipleAnswersContactAndMatrix(mapping, finalAnswer),
  };
  return payload;
};

const getMatrixRatingAnswerPayload = ({ answer, mapping }) => {
  let finalAnswer = answer;
  if (isAnswerTypeString(answer)) {
    finalAnswer = parseInt(answer);
  }
  const payload = {
    question_id: mapping[mappingConstants.surveySparrowQuestionID.name],
    parent_question_id: mapping[mappingConstants.surveySparrowParentQuestionID.name],
    answer: [mapping[mappingConstants.answerMapping.name][""]],
    matrix_int: [finalAnswer]
  };
  return payload;
}

const getMatrixTextInputAnswerPayload = ({ answer, mapping }) => {
  let finalAnswer = answer;
  if (!isAnswerTypeString(answer)) {
    finalAnswer = answer.toString();
  }
  const payload = {
    question_id: mapping[mappingConstants.surveySparrowQuestionID.name],
    parent_question_id: mapping[mappingConstants.surveySparrowParentQuestionID.name],
    answer: [mapping[mappingConstants.answerMapping.name][""]],
    matrix_txt: [finalAnswer]
  };
  return payload;
}



const getDateTimeAnswerPayload = ({ answer, mapping, timeZone }) => {
  let finalAnswer = answer;
  if (!isAnswerTypeString(answer)) {
    finalAnswer = answer.toString();
  }
  
  const payload = {
    question_id: mapping[mappingConstants.surveySparrowQuestionID.name],
    answer: finalAnswer,
    time_zone: timeZone
  }
  return payload;
}

const getCountryCodeFromNumber = (phone) => {
  try {
    const number = phoneUtil.parseAndKeepRawInput(phone);
    return number.getCountryCode();
  } catch (err) {
    return null;
  }
};

const getNationalNumberFromNumber = (phone) => {
  try {
    const number = phoneUtil.parseAndKeepRawInput(phone);
    return number.getNationalNumber();
  } catch (err) {
    return null;
  }
};

const getCountryFlagFromNumber = (phone) => {
  try {
    const number = phoneUtil.parseAndKeepRawInput(phone);
    return phoneUtil.getRegionCodeForNumber(number);
  } catch (err) {
    return null;
  }
};

const getPhoneNumberAnswer = ({ answer, mapping, isSubQuestion }) => {
  let finalAnswer = answer;
  if (!isAnswerTypeString(answer)) {
    finalAnswer = answer.toString();
  }
  const code = getCountryCodeFromNumber(finalAnswer);
  const phoneNumber = getNationalNumberFromNumber(finalAnswer);
  const regionCode = getCountryFlagFromNumber(finalAnswer);
  if (code && phoneNumber && regionCode,regionCode) {
    const payload = {
      question_id: mapping[mappingConstants.surveySparrowQuestionID.name],
      answer: `+${code}${phoneNumber}`,
      region_code: regionCode
    };
    if (isSubQuestion) {
      payload.parent_question_id = mapping[mappingConstants.surveySparrowParentQuestionID.name];
    }
    return payload;
  } else {
    return null;
  }
};



const getSubmissionObject = ({ answers, mappings, timeZone }) => {
  const answerPayload = [];
  Object.keys(answers).forEach((answerKey) => {
    if (!mappings[answerKey]) {

      throw new Error(
        "MAPPING NOT FOUND FOR ANSWER",
        answers[answerKey],
        "KEY ->",
        answerKey
      );
    }
    const curMapping = mappings[answerKey];
    const curAnswer = answers[answerKey];
    const questionType =
      curMapping[mappingConstants.surveySparrowQuestionType.name];

    let answer;
    if (curAnswer.trim()) {
      if(questionProperties.ContactFormRegex.name.test(questionType)) {
        if(curMapping[mappingConstants.surveySparrowQuestionDataType.name] === dataTypeConstants.dropdown){
          answer = getMultipleChoiceContactAnswer({
            answer: curAnswer,
            mapping: curMapping,
          });
          answer.parent_question_id = curMapping[mappingConstants.surveySparrowParentQuestionID.name];
          if(answer.answer.length)
            answerPayload.push(answer);
        }
        else if (curMapping[mappingConstants.surveySparrowQuestionDataType.name] === dataTypeConstants.number || questionType === questionProperties.ContactForm_Zip.name) {
          answer = getContactFormNumberAnswerPayload({
            answer: curAnswer,
            mapping: curMapping,
          });
          answerPayload.push(answer);
        }
        else{
          answer = getContactFormTextAnswerPayload({
            answer: curAnswer,
            mapping: curMapping,
            dataType: curMapping[mappingConstants.surveySparrowQuestionDataType.name]
          });
          answerPayload.push(answer);
        }
        return;
      }
      switch (questionType) {
        case questionProperties.OpinionScale.name:
        case questionProperties.Rating.name:
        case questionProperties.GroupRating_Statement.name:
        case questionProperties.NPSScore.name:
        case questionProperties.CESScore.name:
        case questionProperties.CSATScore.name:
        case questionProperties.NumberInput.name:
        case questionProperties.Slider.name:
          answer = getNPSScoreAnswerPayload({
            answer: curAnswer,
            mapping: curMapping,
          });
          answerPayload.push(answer);
          break;
        case questionProperties.Consent.name:
          answer = {
            question_id: curMapping[mappingConstants.surveySparrowQuestionID.name],
            answer: curAnswer ? true : false
          };
          answerPayload.push(answer);
          break;
        case questionProperties.EmailInput.name:
        case questionProperties.URLInput.name:
        case questionProperties.TextInput.name:
        case questionProperties.NPSFeedback.name:
        case questionProperties.CESFeedback.name:
        case questionProperties.CSATFeedback.name:
          answer = getTextAnswerPayload({
            answer: curAnswer,
            mapping: curMapping,
            questionType: questionType
          });
          answerPayload.push(answer);
          break;
        case questionProperties.YesNo.name:
          answer = getYesOrNoAnswerPayload({
            answer: curAnswer,
            mapping: curMapping,
          });
          answerPayload.push(answer);
          break;
        case questionProperties.Matrix.name:
        case questionProperties.Matrix_Statement.name:
          if(curMapping[mappingConstants.surveySparrowQuestionDataType.name] === dataTypeConstants.rating) {
            answer = getMatrixRatingAnswerPayload({
            answer: curAnswer,
            mapping: curMapping,
            });
            const index = answerPayload.findIndex((item) => {return item.question_id === answer.question_id && item.parent_question_id === answer.parent_question_id });
            if(index !== -1 && answer?.answer.length && answer?.matrix_int.length){
              answerPayload[index].answer.push(answer.answer[0]);
              answerPayload[index].matrix_int.push(answer.matrix_int[0]);
            }
            else {
              if(answer?.answer.length && answer?.matrix_int.length)
                answerPayload.push(answer);
            }
          }
          else if(curMapping[mappingConstants.surveySparrowQuestionDataType.name] === dataTypeConstants.text) {
            answer = getMatrixTextInputAnswerPayload({
            answer: curAnswer,
            mapping: curMapping,
            });
            const index = answerPayload.findIndex((item) => {return item.question_id === answer.question_id && item.parent_question_id === answer.parent_question_id });
            if(index !== -1 && answer?.answer.length && answer?.matrix_txt.length){
              answerPayload[index].answer.push(answer.answer[0]);
              answerPayload[index].matrix_txt.push(answer.matrix_txt[0]);
            }
            else {
              if(answer?.answer.length && answer?.matrix_txt.length)
                 answerPayload.push(answer);
            }
          }
          else if(curMapping[mappingConstants.surveySparrowQuestionDataType.name] === dataTypeConstants.DROPDOWN) {
            answer = getMatrixAnswerPayload({
            answer: curAnswer,
            mapping: curMapping,
            });
            const index = answerPayload.findIndex((item) => {return item.question_id === answer.question_id && item.parent_question_id === answer.parent_question_id });
            if(index !== -1 && answer?.answer.length){
              answerPayload[index].answer.push(answer?.answer[0]);
            }
            else {
              if(answer?.answer.length)
                  answerPayload.push(answer);
            }
          }
          else {
            answer = getMatrixAnswerPayload({
            answer: curAnswer,
            mapping: curMapping,
          });
          if(answer?.answer.length)
             answerPayload.push(answer);
          }
          break;
        case questionProperties.MultiChoicePicture.name:
        case questionProperties.Dropdown.name:
        case questionProperties.RankOrder.name:
        case questionProperties.MultiChoice.name:
          answer = getMultipleChoiceAnswer({
            answer: curAnswer,
            mapping: curMapping,
          });
          if(answer.answer.length)
            answerPayload.push(answer);
          break;

        case questionProperties.PhoneNumber.name:
          answer = getPhoneNumberAnswer({
            answer: curAnswer,
            mapping: curMapping,
            isSubQuestion: false
          });
          if (answer) {
            answerPayload.push(answer);
          }
          break;
        case questionProperties.DateTime.name:
          answer = getDateTimeAnswerPayload({
            answer: curAnswer,
            mapping: curMapping,
            timeZone: timeZone
          });
          answerPayload.push(answer);
          break;
        case questionProperties.ConstantSum.name:
        case questionProperties.ConstantSum_Statement.name:
          answer = getContactFormNumberAnswerPayload({
            answer: curAnswer,
            mapping: curMapping,
          });
          answerPayload.push(answer);
          break;
        default:
          console.log(
            "SKIPPED PAYLOAD MAPPING FOR THE ANSWER WITH TYPE",
            questionType,
            curMapping
          );
          break;
      }
    }
  });
  return answerPayload;
};


module.exports = {
  getSubmissionObject
};
