const API_BASE_URL = "https://api.surveysparrow.com/v3/";
const header = {
  options: {
    headers: {
      Authorization: "Bearer <%= iparams.surveysparrow_api_key %>"
    }
  }
};

const message = {
  success: "success",
  error: "failure"
};

const placeholderText = `What is your favourite color?
Green
Blue
Red
Voilet

Please fill your email address.

Which season do you prefer?
Spring
Summer
Fall
Winter`;

const surveyTypes = {
  CLASSIC_FORM: "ClassicForm",
  CHAT_SURVEY: "Conversational",
  NPS_SURVEY: "NPS",
  CSAT_SURVEY: "CSAT",
  CES_SURVEY: "CES",
  CES_CHAT_SURVEY: "CESChat",
  CSAT_CHAT_SURVEY: "CSATChat",
  NPS_CHAT_SURVEY: "NPSChat",
  OFFLINE_APP: "OfflineApp"
};

const commonQuestionTypes = [
  { value: "TextInput", label: "Text" },
  { value: "EmailInput", label: "Email" },
  { value: "PhoneNumber", label: "Phone Number" },
  { value: "Message", label: "Message" },
  { value: "DateTime", label: "Date" },
  { value: "NumberInput", label: "Number" },
  { value: "Slider", label: "Slider" },
  { value: "Rating", label: "Rating" },
  { value: "URLInput", label: "Website" },
  { value: "OpinionScale", label: "Opinion scale" },
  { value: "YesNo", label: "Yes or No" },
  { value: "Signature", label: "Signature" },
  { value: "CameraInput", label: "Photo Capture" },
  { value: "FileInput", label: "Upload" }
];

const multipleQuestionTypes = [
  { value: "MultiChoice", label: "Multiple Choice" },
  { value: "Dropdown", label: "Dropdown" },
  { value: "RankOrder", label: "Rank Order" }
];

const questionType = {
  multiChoice: "MultiChoice",
  rankOrder: "RankOrder",
  slider: "Slider",
  dropDown: "Dropdown",
  opinionScale: "OpinionScale",
  signature: "Signature",
  textInput: "TextInput",
  fileInput: "FileInput",
  cameraInput: "CameraInput",
  consent: "Consent",
  urlInput: "URLInput",
  yesNo: "YesNo",
  rating: "Rating",
  contactForm: "ContactForm",
  msg: "Message",
  numberInput: "NumberInput",
  emailInput: "EmailInput",
  phoneNumber: "PhoneNumber",
  bipolarMatrix: "BipolarMatrix",
  matrix: "Matrix",
  dateTime: "DateTime"
};

const defaultSurveyTypes = {
  conversational: "Conversational"
};

const iconStarsCount = new Array(4).fill("");
const opinionScaleCount = new Array(10).fill("");

const question = {
  STRING: "string",
  QUESTION_QUOTA: "questionQuota",
  API_QUOTA: "apiQuota",
  QUOTA_EXCEEDED: "Quota Exceeded",
  WRONG_PAYLOAD: "WRONG_PAYLOAD",
  YES_NO_QUESTION_ICON: "YES_NO_ICON_THUMBS"
};

export const commonConstants = {
  API_BASE_URL,
  header,
  message,
  placeholderText,
  surveyTypes,
  commonQuestionTypes,
  multipleQuestionTypes,
  questionType,
  defaultSurveyTypes,
  iconStarsCount,
  opinionScaleCount,
  question
};
