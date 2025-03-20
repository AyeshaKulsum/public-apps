const mappingConstants = {
    surveySparrowParentQuestionID :{
        name: 'ss_parentQuestionId'
    },
    surveySparrowQuestionID:{
        name: 'ss_qid'
    },
    surveySparrowQuestionType:{
        name: 'questionType'
    },
    surveySparrowQuestionDataType:{
        name: 'questionDataType'
    },
    answerMapping:{
        name:'answerMapping'
    },
    rowType:{
        name:'rowType',
        type:{
            Question: "Question",
            subQuestion: "subQuestion"
        }
    },
    rowProperties:{
        name:"rowProperties"
    }
};

module.exports = {
    mappingConstants
};