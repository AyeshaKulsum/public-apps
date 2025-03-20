const eventTabs = {
  ADD_EVENT: 'add',
  LIST_EVENT: 'list'
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
const daysNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
const getSurveyId = "getSurveyId";

const calendarDateTypes = {
  START: 'Start',
  END: 'End',
  start: 'start',
  end: 'end'
}

const BASE_URL = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

const HEADERS = {
  options: {
    headers: {
      Authorization: "Bearer <%=access_token%>"
    },
    isOAuth: true,
    maxAttempts: 5
  }
}

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const importDialog = {
  SEARCH_PLACEHOLDERS:{
  EMAIL_LIMIT: "Maximum User limit 10 has exceeded",
  INFO: "Please enter the email"
},
BUTTON_VALUES:{
  SCHEDULE: "Schedule",
  FINISH_IMPORT: "Finish Import"
}
}

export const calendarConstants = {
  eventTabs,
  daysNames,
  monthNames,
  getSurveyId,
  calendarDateTypes,
  BASE_URL,
  HEADERS
}