import { questionTypes } from "../constants/questionTypes";


const validateQuestion = (question, header, sample) => {
  if (sample[header]?.data) {
    if (questionTypes.ContactFormRegex.name.test(question.question_type)) {
      switch (question.question_data_type) {
        case questionTypes.ContactEmail.name:
          var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          for (let i = 0; i < sample[header].data.length; i++) {
            if (sample[header].data[i].trim() == "" || emailRegex.test(sample[header].data[i].trim())) {
              continue
            }
            return false;
          }
          return true;
        case questionTypes.ContactNumber.name:
          for (let i = 0; i < sample[header].data.length; i++) {
            if (Number.isNaN(Number(sample[header].data[i].trim()))) {
              return false;
            }
          }
          return true;
        case questionTypes.ContactPhoneNumber.name:
          var phoneRegex = /^\+/;
          for (let i = 0; i < sample[header].data.length; i++) {
            if (sample[header].data[i].trim() == "" || phoneRegex.test(sample[header].data[i].trim())) {
              continue
            }
            return false;
          }
          return true;
        default:
          return true;
      }
    }
    else {
      switch (question.question_type) {
        case questionTypes.NPSScore.name:
        case questionTypes.OpinionScale.name:
        case questionTypes.Rating.name:
        case questionTypes.NumberInput.name:
        case questionTypes.Slider.name:
        case questionTypes.ConstantSum_Statement.name:
          for (let i = 0; i < sample[header].data.length; i++) {
            if (Number.isNaN(Number(sample[header].data[i].trim()))) {
              return false;
            }
          }
          return true;
        case questionTypes.EmailInput.name:
          var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          for (let i = 0; i < sample[header].data.length; i++) {
            if (sample[header].data[i].trim() == "" || emailRegex.test(sample[header].data[i].trim())) {
              continue
            }
            return false;
          }
          return true;
        case questionTypes.PhoneNumber.name:
          var phoneRegex = /^\+/;
          for (let i = 0; i < sample[header].data.length; i++) {
            if (sample[header].data[i].trim() == "" || phoneRegex.test(sample[header].data[i].trim())) {
              continue
            }
            return false;
          }
          return true;
        case questionTypes.Consent.name:
          for (let i = 0; i < sample[header].data.length; i++) {
            if (sample[header].data[i].trim().toUpperCase() == "TRUE" || sample[header].data[i].trim().toUpperCase() == "FALSE" || sample[header].data[i].trim().toUpperCase() == "YES" || sample[header].data[i].trim().toUpperCase() == "NO" || sample[header].data[i].trim().toUpperCase() == "AGREE" || sample[header].data[i].trim().toUpperCase() == "DISAGREE" || sample[header].data[i].trim() == "") {
              continue;
            }
            return false;
          }
          return true;
        case questionTypes.YesNo.name:
          for (let i = 0; i < sample[header].data.length; i++) {
            if (sample[header].data[i].trim() == "Yes" || sample[header].data[i].trim() == "No" || sample[header].data[i].trim() == "") {
              continue;
            }
            return false;
          }
          return true;
        default:
          return true;
      }
    }
  }
  return true;
}

export default validateQuestion;