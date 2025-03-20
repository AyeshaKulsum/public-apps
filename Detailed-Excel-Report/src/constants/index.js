const API_BASE_URL = "https://api.surveysparrow.com";

const header = {
  options: {
    headers: {
      Authorization: "Bearer <%= iparams.surveysparrow_api_key %>",
    },
  },
};

const EXCEL_SHEET_ROWS_LIMIT = 1000000;

const surveyTypes = {
  "ClassicForm": {
    "name": "ClassicForm"
  },
  "Conversational": {
    "name": "Conversational"
  },
  "NPS": {
    "name": "NPS"
  },
  "NPSChat": {
    "name": "NPSChat"
  },
  "CES": {
    "name": "CES"
  },
  "CESChat": {
    "name": "CESChat"
  },
  "CSAT": {
    "name": "CSAT"
  },
  "CSATChat": {
    "name": "CSATChat"
  },
};

const visibilityTypes = {
  PUBLIC: {
    "name": "Public"
  },
  MINE: {
    "name": "Mine"
  },
};

const basicFolders = {
  GENERAL: {
    "name": "General"
  },
  MY_SURVEYS: {
    "name": "My Surveys"
  },
}; 

const displayMessages={
  INVALID_RESPONSE_FROM_SERVER:"Invalid response from the server.",
  SOMETHING_WENT_WRONG:"Something went wrong. Please try again.",
  SUCCESSFULLY_DOWNLOADED:"Report Downloaded Successfully.",
  ERROR_MESSAGE:"Error",
  SUCCESS_MESSAGE:"Success"
}

const resultTypes={
  SUCCESS:"success",
  ERROR:"error",
  DEFAULT:"default"
}

module.exports = {
  API_BASE_URL,
  header,
  EXCEL_SHEET_ROWS_LIMIT,
  surveyTypes,
  visibilityTypes,
  basicFolders,
  displayMessages,
  resultTypes
};
