

const questionTypes = {
  "OpinionScale": {
    "name": "OpinionScale"
  },
  "Rating": {
    "name": "Rating"
  },
  "GroupRating":{
    "name": "GroupRating"
  },
  "GroupRating_Statement":{
    "name": "GroupRating_Statement"
  },
  "TextInput": {
    "name": "TextInput"
  },
  "EmailInput": {
    "name": "EmailInput"
  },
  "PhoneNumber": {
    "name": "PhoneNumber"
  },
  "YesNo": {
    "name": "YesNo"
  },
  "NumberInput": {
    "name": "NumberInput"
  },
  "Slider": {
    "name": "Slider"
  },
  "DateTime": {
    "name": "DateTime",
    "properties": {
      "type": {
        "DATE_ONLY": "DATE_ONLY"
      }
    }
  },
  "Consent": {
    "name": "Consent"
  },
  "URLInput": {
    "name": "URLInput"
  },
  "NPSScore": {
    "name": "NPSScore"
  },
  "CESScore": {
    "name": "CESScore"
  },
  "CSATScore": {
    "name": "CSATScore"
  },
  "NPSFeedback": {
    "name": "NPSFeedback"
  },
  "MultiChoice": {
    "name": "MultiChoice"
  },
  "MultiChoicePicture": {
    "name": "MultiChoicePicture"
  },
  "Dropdown": {
    "name": "Dropdown"
  },
  "RankOrder": {
    "name": "RankOrder"
  },
  "Matrix_Statement": {
    "name": "Matrix_Statement",
    "answerType": {
      "RATING": "RATING",
      "TEXT_INPUT": "TEXT_INPUT",
      "DROP_DOWN": "DROP_DOWN"
    }
  },
  "BipolarMatrix_Statement": {
    "name": "BipolarMatrix_Statement"
  },
  "ContactFormRegex": {
    "name": /(ContactForm_)+/
  },
  "ContactDropDown": {
    "name": "dropdown"
  },
  "ContactDate": {
    "name": "date"
  },
  "ContactNumber": {
    "name": "number"
  },
  "ContactEmail": {
    "name": "email"
  },
  "ContactPhoneNumber": {
    "name": "PhoneNumber"
  },
  "ConstantSum_Statement": {
    "name": "ConstantSum_Statement"
  },
  "CESFeedback": {
    "name": "CESFeedback",
  },
  "CSATFeedback": {
    "name": "CSATFeedback",
  }
}
module.exports = {
  questionTypes
}