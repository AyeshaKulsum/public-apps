const domain = "https://api.surveysparrow.com/";
const header = {
    options: {
      headers: {
        Authorization: "Bearer <%= iparams.surveysparrow_api_key %>"
      }
    }
  };
const QulatricsConstants = {
    thrash: 'Trash',
    introduction: 'Introduction',
    surveyQuestion: 'SQ',
    blockList: 'BL',
    smi: 'surveyConverter',
    questionCreateSmi: 'questionCreate',
    surveyCreateSmi: 'surveyCreate',
    sectionCreateSmi:'sectionCreate',
    question: 'Question',
    surveyFlow:'FL',
    blockElements:'BlockElements',
    individualQuestions:'individualQuestions'
}
const QuestionTypeConstants = {
    matrix: 'Matrix',
    textEntry: 'TE',
    form: 'FORM',
    constantSum: 'CS',
    rankOrder: 'RO',
    maxDiff: 'MaxDiff',
    timing: 'Timing',
    meta:'Meta',
    highLight:'HL',
    drillDown: 'DD',
    GroupRating: "Slider",
    Message: "DB",
    multiChoice: 'MC',
    SideBySide: "SBS",
    Slider: "SS",
    GroupRank: "PGR",
    Signature: "Draw",
    nps:"NPS"
}

const surveyTypes = {
    classicForm: "ClassicForm",
    nps: "NPS",
    npsChat: "NPSChat",
    conversational: "Conversational",
    ces: "CES",
    cesChat: "CESChat",
    csat: "CSAT",
    csatChat: "CSATChat"
};

const surveyTypesLabel = {
    classicForm: "Classic Survey",
    nps: "NPS",
    npsChat: "NPS Chat",
    conversational: "Chat Survey",
    ces: "CES",
    cesChat: "CES Chat",
    csat: "CSAT",
    csatChat: "CSAT Chat"
};

const surveyLabelSurveyTypeMapping = {
    "Classic Survey":"ClassicForm",
    "NPS":"NPS",
    "NPS Chat":"NPSChat",
    "Chat Survey":"Conversational",
    "CES":"CES",
    "CES Chat":"CESChat",
    "CSAT":"CSAT",
    "CSAT Chat":"CSATChat"
};

const surveySurveyTypeLabelMapping = {
    "ClassicForm":"Classic Survey",
    "NPS":"NPS",
    "NPSChat":"NPS Chat",
    "Conversational":"Chat Survey",
    "CES":"CES",
    "CESChat":"CES Chat",
    "CSAT":"CSAT",
    "CSATChat":"CSAT Chat"
};

const toastrConstants={
    resultTypes:{
        error:"error",
        success:"success",
        default:"default"
    },
    toastrTitles:{
        badToken:"Bad Token",
        fetchFoldersError:"Error while fetching folders",
        unknownError:"Unknown error occured",
        uploadError:"File upload failed",
        migrationSuccess:"Migration success",
        migrationFailed:"Migration failed",
        surveyCreationFailed:"Survey creation failed."
    },
    toastrDescriptions:{
        badTokenDesc:"Please authenticate again with valid token.",
        somethingWrong:"Something went wrong",
        pageRefresh:"Please refresh the app and try again.",
        uploadErrorDesc:"Wrong file format detected while uploading.",
        migrationSuccessDesc:"Survey created successfully.",
        migrationErrorDesc:"Please upload and try again.",
        apiQuotaError:"API quota limit exceeded.",
        surveysQuotaError:"Surveys quota limit exceeded.",
        parsingErrorDesc:"Error occured while parsing the file."
    }
}

const classicSurveys=["ClassicForm","NPS","CES","CSAT"];

export  { QulatricsConstants, QuestionTypeConstants, surveyTypes, domain, header, surveyTypesLabel, surveyLabelSurveyTypeMapping, surveySurveyTypeLabelMapping, classicSurveys , toastrConstants};