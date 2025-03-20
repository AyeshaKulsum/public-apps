const surveyOptions = [
  { id: 1, label: "Survey 1", value: "SURVEY_1" },
  { id: 2, label: "Survey 2", value: "SURVEY_2" },
  { id: 3, label: "Survey 3", value: "SURVEY_3" },
  { id: 4, label: "Survey 4", value: "SURVEY_4" },
  { id: 5, label: "Survey 5", value: "SURVEY_5" },
];

const shareTypeOptions = [
  { id: 1, label: "Email", value: "EMAIL" },
  { id: 2, label: "SMS", value: "SMS" },
  { id: 3, label: "WhatsApp", value: "WHATSAPP" },
];

const routerConstants = {
  CONFIGURATION: "CONFIGURATION",
  TRIGGERS: "TRIGGERS",
};

const topLevelCondition = [
  {
    label: "all",
    value: "AND",
  },
  {
    label: "any",
    value: "OR",
  },
];

const operatorOptions = [
  {
    id: 1,
    label: "is equals to",
    value: "IS",
  },
  {
    id: 2,
    label: "is not equals to",
    value: "IS_NOT",
  },
  {
    id: 3,
    label: "contains",
    value: "CONTAINS",
  },
  {
    id: 4,
    label: "not contains",
    value: "CONTAINS_NOT",
  },
  {
    id: 5,
    label: "has no value",
    value: "NO_VALUE",
  },
];

const dateOptions = [
  { id: 1, label: "at", value: "AT" },
  { id: 2, label: "after", value: "AFTER" },
  { id: 3, label: "before", value: "BEFORE" },
  { id: 4, label: "from", value: "FROM" },
];

const subMenuOptions = [
  {
    id: 1,
    label: "String",
    subLabel: "Textual Data. (Eg: Hello World, 1234)",
    value: "STRING",
    nestedOptions: operatorOptions,
  },
  {
    id: 2,
    label: "Number",
    subLabel: "Numeric Value. (Eg: 123, -45, 0)",
    value: "NUMBER",
    nestedOptions: operatorOptions,
  },
  {
    id: 3,
    label: "Boolean",
    subLabel: "True or False",
    value: "BOOLEAN",
    nestedOptions: null,
  },
  {
    id: 4,
    label: "Date/Time",
    subLabel: "Timestamp or Calendar Information",
    value: "DATE_TIME",
    nestedOptions: dateOptions,
  },
];

const booleanOptions = [
  {
    id: 1,
    label: "True",
    value: "TRUE",
  },
  {
    id: 2,
    label: "False",
    value: "FALSE",
  },
];

const noPreferenceOptions = {
  id: 1,
  label: "No Preference",
  value: "NO_PREFERENCE",
};

const surveyVariables = {
  name: 'SURVEY_VARIABLES',
};

export {
  surveyOptions,
  shareTypeOptions,
  topLevelCondition,
  subMenuOptions,
  operatorOptions,
  booleanOptions,
  noPreferenceOptions,
  routerConstants,
  surveyVariables,
};
