const commonConstants = {
  saveDetails: "Save Details",
  mapFields: "Map Fields",
  upload: "Upload",
  selectSurvey: "Select Survey",
  importResponseFromFile: "Import Response From File",
  dragAndDropOrChooseYourFile: "Drag and drop or choose your file to start uploading.",
  onlyCsvSupported: "Only .csv file is supported.",
  noData: "No Data",
  noDataInCSV: "Looks like thee is no data in the file or source you imported from. Please check and try again.",
  responseProperty: {
    name: "Response Property",
    type: {
      tags: "Tags",
      deviceType: "Device Type",
      ipAdress: "IP Address",
      language: "Language",
      browser: "Browser",
      os: "OS",
      timeZone: "Time Zone",
      browserLanguage: "Browser Language",
      createdAt: "Created At"
    }
  },
  contactProperty: {
    name: "Contact Property",
    type: {
      fullName: "Full Name",
      email: "Email",
      phone: "Phone",
      mobile: "Mobile",
      jobTitle: "Job Title",
      language: "Language",
      createdDate: "Created Date"
    }
  },
  question: "Question",
  variable: "Variable",
  mapData: "Map Data",
  mappingHeaderText: `Each column header from the file should be mapped to a corresponding
  question type in the survey creator. We have tried to map a few based on
  the header names. For headers that are not mapped, use the dropdown to
  point to a property. You can choose "Do not import" to ignore the
  contents.`,
  status: "STATUS",
  import: "IMPORT",
  columnHeader: "COLUMN HEADER",
  contentSample: "CONTENT SAMPLE",
  mapping: "MAPPING",
  mapped: "Mapped",
  autoMapped: "Auto Mapped",
  noSampleData: "No Sample Data",
  almostDone: "Almost Done!",
  finishImport: "Finish Import",
  chooseSurveyToMigrate: "Choose a survey you want to migrate the responses to.",
  uploadYourFile: "Upload Your File",
  beforeUploadCheckIfCSV: "Before uploading please make sure that your file is in CSV format.",
  next: "Next",
  cannotMapSampleData: "Cannot map sample data",
  completed: "Completed",
  failed: "Failed",
  entriesCreated: "ENTRIES CREATED",
  errors: "ERRORS",
  logs: "LOGS",
  importedBy: "IMPORTED BY",
  lastImport: "LAST IMPORT",
  survey: "SURVEY",
  uploading: "uploading",
  uploadingTime: "uploadingTime",
  surveyId: "surveyId",
  surveyName: "surveyName",
  internalErrorMessage: "Some internal error occured",
  invalidCredentialMessage: "Invalid Credentials. Please update the valid API Key in Response Import app.",
  seeGuidelinesLink: "https://docs.google.com/document/d/1SDHhzytd6nyrRxN0-EV_vpcmqifzVSnJiB6yprpb-Xc",
  sampleCSVLink: "https://status-error-logs.s3.amazonaws.com/Response-Import-Sample-CSV/Sample.csv"
}

const contactProperty = [
  {
    label: commonConstants.contactProperty.type.fullName,
    value: commonConstants.contactProperty.type.fullName
  },
  {
    label: commonConstants.contactProperty.type.email,
    value: commonConstants.contactProperty.type.email
  },
  {
    label: commonConstants.contactProperty.type.phone,
    value: commonConstants.contactProperty.type.phone
  },
  {
    label: commonConstants.contactProperty.type.mobile,
    value: commonConstants.contactProperty.type.mobile
  },
  {
    label: commonConstants.contactProperty.type.jobTitle,
    value: commonConstants.contactProperty.type.jobTitle
  },
  {
    label: commonConstants.contactProperty.type.language,
    value: commonConstants.contactProperty.type.language
  },
  {
    label: commonConstants.contactProperty.type.createdDate,
    value: commonConstants.contactProperty.type.createdDate
  }
];

const responsePropertyValues = [
  {
    label: commonConstants.responseProperty.type.deviceType,
    value: commonConstants.responseProperty.type.deviceType
  },
  {
    label: commonConstants.responseProperty.type.ipAdress,
    value: commonConstants.responseProperty.type.ipAdress
  },
  {
    label: commonConstants.responseProperty.type.language,
    value: commonConstants.responseProperty.type.language
  },
  {
    label: commonConstants.responseProperty.type.browser,
    value: commonConstants.responseProperty.type.browser
  },
  {
    label: commonConstants.responseProperty.type.os,
    value: commonConstants.responseProperty.type.os
  },
  {
    label: commonConstants.responseProperty.type.timeZone,
    value: commonConstants.responseProperty.type.timeZone
  },
  {
    label: commonConstants.responseProperty.type.browserLanguage,
    value: commonConstants.responseProperty.type.browserLanguage
  },
  {
    label: commonConstants.responseProperty.type.createdAt,
    value: commonConstants.responseProperty.type.createdAt
  }
]

const accountsWithHigherThreshold = [1000028383]

module.exports = {
  commonConstants,
  contactProperty,
  responsePropertyValues, 
  accountsWithHigherThreshold
}