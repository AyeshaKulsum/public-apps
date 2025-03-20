import { questionTypes } from "../constants/questionTypes";


const formatQuestion = (question, questions) => {
  let parentQuestion;
  if (questionTypes.ContactFormRegex.name.test(question.type)) {
    if(question.properties.data.type == questionTypes.ContactDate.name){
      return;
    }
    if (question.properties.data.type == questionTypes.ContactDropDown.name) {
      parentQuestion = questions.filter((ques) => ques.id == question.parent_question_id)[0];
      if (!parentQuestion) {
        return;
      }
      return (
        {
          question_id: question.id,
          parent_question_id: question.parent_question_id,
          question_text: parentQuestion.rtxt + '- ' + question.rtxt,
          question_type: question.type,
          question_data_type: question.properties.data.type,
          hasChoices: true,
          choices: [question.choices.map((choice) => {
            return ({
              id: choice.id,
              choice_text: choice.txt
            })
          })]
        }
      )
    }
    else {
      parentQuestion = questions.filter((ques) => ques.id == question.parent_question_id)[0];
      if (!parentQuestion) {
        return;
      }
      return (
        {
          question_id: question.id,
          parent_question_id: question.parent_question_id,
          question_text: parentQuestion.rtxt + '- ' + question.rtxt,
          hasChoices: false,
          question_type: question.type,
          question_data_type: question.properties.data.type,
          choices: []
        }
      )
    }
  }
  else {
    switch (question.type) {
      case questionTypes.OpinionScale.name:
      case questionTypes.Rating.name:
      case questionTypes.TextInput.name:
      case questionTypes.EmailInput.name:
      case questionTypes.PhoneNumber.name:
      case questionTypes.YesNo.name:
      case questionTypes.NumberInput.name:
      case questionTypes.Slider.name:
      case questionTypes.Consent.name:
      case questionTypes.URLInput.name:
      case questionTypes.NPSScore.name:
      case questionTypes.CESScore.name:
      case questionTypes.CSATScore.name:
        return ({
          question_id: question.id,
          parent_question_id: null,
          question_text: question.rtxt,
          question_type: question.type,
          hasChoices: false,
          choices: []
        })
      case questionTypes.GroupRating_Statement.name:
        parentQuestion = questions.filter((ques) => ques.id == question.parent_question_id)[0];
        if (!parentQuestion) {
          return;
        }
        return({
            question_id: question.id,
            parent_question_id: question.parent_question_id,
            question_text: parentQuestion.rtxt + '- ' + question.rtxt,
            hasChoices: false,
            question_type: question.type,
            choices: []
          })
      case questionTypes.DateTime.name:
        if(question.properties.data.type == questionTypes.DateTime.properties.type.DATE_ONLY) {
          return ({
            question_id: question.id,
            parent_question_id: null,
            question_text: question.rtxt,
            question_type: question.type,
            hasChoices: false,
            choices: []
          })
        }
        break;
      case questionTypes.MultiChoice.name:
      case questionTypes.MultiChoicePicture.name:
      case questionTypes.Dropdown.name:
      case questionTypes.RankOrder.name:
        return ({
          question_id: question.id,
          parent_question_id: null,
          question_text: question.rtxt,
          question_type: question.type,
          hasChoices: true,
          choices: [question.choices.map((choice) => {
            return ({
              id: choice.id,
              choice_text: choice.txt,
              other: choice.other
            })
          })]
        })
      case questionTypes.Matrix_Statement.name:
        parentQuestion = questions.filter((ques) => ques.id == question.parent_question_id)[0];
        if (!parentQuestion) {
          return;
        }
        if (parentQuestion.properties.data.matrix.answer_type == questionTypes.Matrix_Statement.answerType.RATING || parentQuestion.properties.data.matrix.answer_type == questionTypes.Matrix_Statement.answerType.TEXT_INPUT || parentQuestion.properties.data.matrix.answer_type == questionTypes.Matrix_Statement.answerType.DROP_DOWN) {
          const result = [];
          for (let i = 0; i < parentQuestion.scale_points.length; i++) {
            result.push({
              question_id: question.id,
              parent_question_id: question.parent_question_id,
              question_text: parentQuestion.rtxt + '- ' + question.rtxt + '- ' + parentQuestion.scale_points[i].name,
              hasChoices: true,
              question_type: question.type,
              question_data_type: parentQuestion.properties.data.matrix.answer_type,
              choices: [parentQuestion.choices.filter( choice => choice.scale_point_id == parentQuestion.scale_points[i].id).map((choice) => {
                return ({
                  id: choice.id,
                  choice_text: choice.txt
                })
              })]
            });
          }
          return result;
        }
        else
          return (
          {
            question_id: question.id,
            parent_question_id: question.parent_question_id,
            question_text: parentQuestion.rtxt + '- ' + question.rtxt,
            hasChoices: true,
            question_type: question.type,
            choices: [parentQuestion.choices.map((choice) => {
              return ({
                id: choice.id,
                choice_text: parentQuestion.scale_points.filter((scale) => {
                  return (scale.id == choice.scale_point_id)
                })[0]["name"]
              })
            })]
          }
        )
      case questionTypes.ConstantSum_Statement.name:
        parentQuestion = questions.filter((ques) => ques.id == question.parent_question_id)[0];
        if (!parentQuestion) {
          return;
        }
        return (
          {
            question_id: question.id,
            parent_question_id: question.parent_question_id,
            question_text: parentQuestion.rtxt + '- ' + question.rtxt,
            hasChoices: false,
            question_type: question.type,
            choices: []
          }
        )

      case questionTypes.NPSFeedback.name:
      case questionTypes.CESFeedback.name:
      case questionTypes.CSATFeedback.name:
        parentQuestion = questions.filter((ques) => ques.id == question.parent_question_id)[0];
        let questionText ;
        if(parentQuestion) {
          questionText = parentQuestion.rtxt + '- ' + question.rtxt;
        }else {
          questionText = question.rtxt;
        }
        return (
          {
            question_id: question.id,
            parent_question_id: question.parent_question_id,
            question_text: questionText,
            hasChoices: false,
            question_type: question.type,
            choices: []
          }
        )

    }
  }
}


export default formatQuestion;