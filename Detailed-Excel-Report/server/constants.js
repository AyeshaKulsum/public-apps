const API_BASE_URL = "https://api.surveysparrow.com";

const supportedQuestionTypes = [
  "EmailInput",
  "NumberInput",
  "PhoneNumber",
  "URLInput",
  "MultiChoice",
  "MultiChoicePicture",
  "NPSScore",
  "CESScore",
  "CSATScore",
  "NPSFeedback",
  "CESFeedback",
  "CSATFeedback",
  "Rating",
  "OpinionScale",
  "TextInput",
  "YesNo",
  "HeatMap",
  "Matrix"
];

const questionTypes={
    EmailInput:{
        label:"Email",
        name:"EmailInput"
    },
    NumberInput:{
        label:"Number",
        name:"NumberInput"
    },
    PhoneNumber:{
        label:"Phone Number",
        name:"PhoneNumber"
    },
    URLInput:{
        label:"Website",
        name:"URLInput"
    },
    MultiChoice:{
        label:"Multiple Choice",
        name:"MultiChoice"
    },
    MultiChoicePicture:{
        label:"Picture Choice",
        name:"MultiChoicePicture"
    },
    NPSScore:{
        label:"NPS Score",
        name:"NPSScore"
    },
    CESScore:{
        label:"CES Score",
        name:"CESScore"
    },
    CSATScore:{
        label:"CSAT Score",
        name:"CSATScore"
    },
    NPSFeedback:{
        label:"NPS Feedback",
        name:"NPSFeedback"
    },
    CESFeedback:{
        label:"CES Feedback",
        name:"CESFeedback"
    },
    CSATFeedback:{
        label:"CSAT Feedback",
        name:"CSATFeedback"
    },
    Rating:{
        label:"Rating",
        name:"Rating"
    },
    OpinionScale:{
        label:"Opinion Scale",
        name:"OpinionScale"
    },
    TextInput:{
        label:"Text",
        name:"TextInput"
    },
    YesNo:{
        label:"Yes or No",
        name:"YesNo"
    },
    HeatMap:{
        label:'HeatMap',
        name:'HeatMap'
    },
    Matrix:{
        label:'Matrix',
        name:'Matrix'
    },
    Matrix_Statement:{
      label:'Matrix_Statement',
      name:'Matrix_Statement'
    },
    BipolarMatrix:{
        label:'Bipolar Matrix',
        name:'BipolarMatrix'
    },
    RankOrder:{
        label:'Rank Order',
        name:'RankOrder'
    },
    GroupRank:{
        label:'Group Rank',
        name:'GroupRank'
    },
    ContactForm:{
        label:'Contact Form',
        name:'ContactForm'
    },
    DateTime:{
        label:'Date',
        name:'DateTime'
    },
    Dropdown:{
        label:'Dropdown',
        name:'Dropdown'
    },
    Slider:{
        label:'Slider',
        name:'Slider'
    },
    GroupRating:{
        label:'Group Rating',
        name:'GroupRating'
    },
    Message:{
        label:'Message',
        name:'Message'
    },
    FileInput:{
        label:'Upload',
        name:'FileInput'
    },
    CameraInput:{
        label:'Photo Capture',
        name:'CameraInput'
    },
    AudioInput:{
        label:'Record Audio',
        name:'AudioInput'
    },
    ConstantSum:{
        label:'Constant Sum',
        name:'ConstantSum'
    },
    PaymentQuestion:{
        label:'Payment',
        name:'PaymentQuestion'
    },
    Consent:{
        label:'Consent/Agreement',
        name:'Consent'
    },
    Signature:{
        label:'Signature',
        name:'Signature'
    },
    GroupRating_Statement:{
        label:"GroupRating Statement",
        name:"GroupRating_Statement"
    },
    ContactForm_Statement:{
        label:"ContactForm Statement",
        name:"ContactForm_Statement"
    },
}

const applicableQuestionTypes = [ "NPSScore", "CESScore", "CSATScore", "OpinionScale", "Rating","Signature","FileInput"];

const scoringQuestionTypes = ["NPSScore", "CESScore", "CSATScore"];

const storageKeys={
    data:"data",
    answers:"answers",
    contact:'C',
    subQuestion:'SQ',
    question:'Q',
    NA:'N/A',
    choices:'choices',
    ratingScale:"ratingScale",
    rtxt:'rtxt',
    type:'type',
    questionLabel:'question',
    applicableCount:"applicable_count",
    scalePoints:'scalePoints',
    questionType: 'questionType',
    position: 'position'
};

const dataTypes={
    dropdown:'dropdown',
    number:'number',
    object:'object',
};

const fileTypes={
    image:{
        label:'Image',
        name:'image',
        icon:'image',
        mimeTypes:[
            'image/*',
        ]
    },
    video:{
        label:'Video',
        name:'video',
        icon:'video',
        mimeTypes:[
            'video/x-ms-wmv', 'video/x-msvideo', 'video/quicktime', 'video/3gpp', 'video/MP2T',
            'application/x-mpegURL', 'video/mp4', 'video/x-flv',
        ]
    },
    audio:{
        label:'Audio',
        name:'audio',
        icon:'audio',
        mimeTypes:[
            'audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/aac', 'audio/amr', 'audio/x-m4a'
        ]
    },
    doc:{
        label:'Document',
        name:'doc',
        icon:'file',
        mimeTypes:[
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
            'application/vnd.ms-word.document.macroEnabled.12',
            'application/vnd.ms-word.template.macroEnabled.12',
            'application/vnd.ms-excel',
            'application/xls',
            'application/csv',
            'text/csv',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
            'application/vnd.ms-excel.sheet.macroEnabled.12',
            'application/vnd.ms-excel.template.macroEnabled.12',
            'application/vnd.ms-excel.addin.macroEnabled.12',
            'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.openxmlformats-officedocument.presentationml.template',
            'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
            'application/vnd.ms-powerpoint.addin.macroEnabled.12',
            'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
            'application/vnd.ms-powerpoint.template.macroEnabled.12',
            'application/vnd.ms-powerpoint.slideshow.macroEnabled.12',
            'application/pdf',
        ]
    }
}

exports={
    API_BASE_URL,
    supportedQuestionTypes,
    questionTypes,
    applicableQuestionTypes,
    scoringQuestionTypes,
    storageKeys,
    dataTypes,
    fileTypes
}