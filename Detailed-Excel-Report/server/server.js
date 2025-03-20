const constants = require("./constants");

exports = {
  getXlsxData: async function (args) {
    const response = await getXlsxData(args);
    return response;
  },
};

const getXlsxData = async (args) => {
  try {
    const {
      API_BASE_URL,
      supportedQuestionTypes,
    } = await constants;
    console.log('args',JSON.stringify(args));
    const surveyId = args.data.surveyId;

    if (!surveyId) {
      throw new Error("Survey ID is required");
    }

    var config = {
      headers: {
        Authorization: `Bearer <%= iparams.surveysparrow_api_key %>`,
        "Content-Type": "application/json",
      },
    };

    const surveyUrl = `${API_BASE_URL}/v3/surveys/${surveyId}`;

    const survey = await $Fetch.get(surveyUrl, config);

    if (survey?.status !== 200 || !survey?.data?.data) {
      return {
        data: {
          status: survey?.status || 500,
          error: survey?.data?.error || "Fetching survey failed.",
        },
      };
    }

    let questions = await getAllQuestionsofSurvey({
      surveyId,
      config,
    });

    const failedReports = [];
    const options = {};
    const totalResponsesCount = {};

    questions=questions.sort((questionX,questionY)=>questionX.id-questionY.id);
    
    for(const question of questions){
        getCategoriesForEachQuestion({
          question,
          options,
        });
    }

    for (const question of questions) {
      if (!supportedQuestionTypes.includes(question.type)) {
        continue;
      }
      try {
        const questionReportUrl = `${API_BASE_URL}/v3/reports/question?survey_id=${surveyId}&&question_id=${question.id}`;
        const response = await $Fetch.get(questionReportUrl, config);
        if (response && response.status === 200 && response.data?.data) {
          await getResponsesCount({
            result: response.data.data,
            totalResponsesCount,
            questionId: question.id,
            options,
            questionType: question.type,
          });
          await setCategoriesCountFromResponses({
            result:
              response.data.data,
            options,
            questionId: question.id,
            questionType:question.type,
          });
        } else {
          failedReports.push(question.id);
        }
      } catch (error) {
        failedReports.push(question.id);
        console.error(
          "Error in fetching report for the question : ",
          question.id,
          error
        );
      }
    }

    const structuredXlsxData = await generateStructuredXlsxData({
      surveyName: survey.data.data.name,
      surveyType: survey.data.data.survey_type,
      questions,
      options,
      failedReports,
      totalResponsesCount,
    });

    return {
      data: {
        status: 200,
        reportData: structuredXlsxData,
      },
    };
  } catch (error) {
    console.error("Error in generating XLSX export", error);
    throw new Error("Error in generating XLSX export");
  }
};

const getCategoriesForEachQuestion =async ({ question, options }) => {
  try {
    const {
      questionTypes,
      storageKeys,
      dataTypes,
    } = await constants;
    let questionType = question.type;
    let subQuestionType;
    if(questionType.includes("ContactForm_")){
      questionType=questionTypes.ContactForm_Statement.name;
    }else{
    options[question.id] = {};
    }
    switch (questionType) {
      case questionTypes.MultiChoice.name:
      case questionTypes.MultiChoicePicture.name:
      case questionTypes.Dropdown.name:
        options[question.id][storageKeys.data] = question.choices.reduce((acc, choice) => {
          acc[choice.id] = { choice_value: choice.txt, count: 0 };
          return acc;
        }, {});
        options[question.id][storageKeys.answers] = [];
        break;
      case questionTypes.Rating.name:
      case questionTypes.CSATScore.name:
        options[question.id][storageKeys.data] = Array.from(
          { length: question.properties.data.rating_scale },
          (_, i) => i + 1
        ).reduce((obj, key) => {
          obj[key] = 0;
          return obj;
        }, {});
        break;
      case questionTypes.OpinionScale.name:
        options[question.id][storageKeys.data] = Array.from(
          {
            length:
              question.properties.data.step -
              question.properties.data.start +
              1,
          },
          (_, i) => question.properties.data.start + i
        ).reduce((obj, key) => {
          obj[key] = 0;
          return obj;
        }, {});
        if (question.properties.data.not_applicable) {
          options[question.id][storageKeys.data][storageKeys.NA] = 0;
        }
        break;
      case questionTypes.NPSScore.name:
      case questionTypes.CESScore.name:
        const startValue = question.properties.data.start_with_one ? 1 : 0;
        options[question.id][storageKeys.data] = Array.from(
          {
            length:
              (question.type === questionTypes.NPSScore.name ? 10 : 7) -
              startValue +
              1,
          },
          (_, i) => startValue + i
        ).reduce((obj, key) => {
          obj[key] = 0;
          return obj;
        }, {});
        break;
      case questionTypes.YesNo.name:
        options[question.id][storageKeys.data] = {
          0: 0,
          1: 0,
        };
        break;
      case questionTypes.ContactForm.name:
        options[question.id][storageKeys.answers] = {};
        break;
      case questionTypes.GroupRating.name:
        options[question.id][storageKeys.ratingScale] = question.properties.data.rating_scale;
        options[question.id][storageKeys.data] = {};
        break;
      case questionTypes.GroupRating_Statement.name:
        options[question.parent_question_id][storageKeys.data][question.id] = {};
        options[question.parent_question_id][storageKeys.data][question.id][storageKeys.rtxt]=question.rtxt;
        options[question.parent_question_id][storageKeys.data][question.id][storageKeys.data] = Array.from(
          { length: options[question.parent_question_id][storageKeys.ratingScale] },
          (_, i) => i + 1
        ).reduce((obj, key) => {
          obj[key] = 0;
          return obj;
        }, {});
        break;
        case questionTypes.ContactForm_Statement.name:
          subQuestionType=question.properties.data.type;
          options[question.parent_question_id][storageKeys.answers][`${storageKeys.questionLabel}_${question.id}`] = {};
          options[question.parent_question_id][storageKeys.answers][`${storageKeys.questionLabel}_${question.id}`][storageKeys.rtxt]=question.rtxt;
          options[question.parent_question_id][storageKeys.answers][`${storageKeys.questionLabel}_${question.id}`][storageKeys.type]=subQuestionType;
          subQuestionType===dataTypes.dropdown && (options[question.parent_question_id][storageKeys.answers][`${storageKeys.questionLabel}_${question.id}`][storageKeys.choices]=question.choices.reduce((acc, choice) => {
            acc[choice.id] = choice.txt;
            return acc;
          }, {}));
          options[question.parent_question_id][storageKeys.answers][`${storageKeys.questionLabel}_${question.id}`][storageKeys.answers] = [];
          break;
        case questionTypes.FileInput.name:
          options[question.id][storageKeys.data]={};
          options[question.id][storageKeys.answers]={};
          for(const fileType of question.properties.data.file_types){
            options[question.id][storageKeys.data][fileType]=0;
            options[question.id][storageKeys.answers][fileType]=[];
          }
          break;
        case questionTypes.Signature.name:
          options[question.id][storageKeys.data]={};
          options[question.id][storageKeys.answers]={};
          Object.keys(question.properties.data.types).forEach((key)=>{
            if(question.properties.data.types[key]===true){
              options[question.id][storageKeys.data][key]=0;
              options[question.id][storageKeys.answers][key]=[];            
            };
          });
          break;
        case questionTypes.Slider.name:
            const sliderType=question.properties.data.slider_type;
            if(sliderType==='trafficLightSlider' || sliderType==='smileySlider'){
              options[question.id][storageKeys.data] = Array.from(
                { length: question.properties.data.segments },
                (_, i) => i + 1
              ).reduce((obj, key) => {
                obj[key] = 0;
                return obj;
              }, {});
            }else{
              options[question.id][storageKeys.answers] = [];
            }
            break;
            case questionTypes.Matrix.name:
              options[question.id][storageKeys.questionType] = question.properties.data.matrix.answer_type;
              options[question.id][storageKeys.rtxt] = question.rtxt;
              options[question.id][storageKeys.scalePoints] = question.scale_points.map((scale_point) => { 
                return {
                  scale_point_id: scale_point.id,
                  name: scale_point.name,
                  choices: question.choices.filter((choice) => choice.scale_point_id === scale_point.id ).map((choice) => {
                    return {
                      choice_id: choice.id,
                      txt: choice.txt
                    }
                   })
                };
               });
              if(question.properties.data.matrix.answer_type === 'RATING'){
                options[question.id][storageKeys.ratingScale] = question.properties.data.rating_scale;
              }
              break;
            case questionTypes.Matrix_Statement.name:
              subQuestionType = options[question.parent_question_id][storageKeys.questionType];
              if(subQuestionType === 'RATING'){
                options[question.parent_question_id][storageKeys.answers] = {
                  ...(options[question.parent_question_id][storageKeys.answers] || {}),
                  [question.id]: {
                    [storageKeys.rtxt]: question.rtxt,
                    [storageKeys.position]: question.position,
                    [storageKeys.scalePoints]: options[question.parent_question_id][storageKeys.scalePoints].reduce((acc, scalePoint) => {
                      acc[scalePoint.scale_point_id] = {
                        name: scalePoint.name,
                        choices: Array.from(
                          { length: options[question.parent_question_id][storageKeys.ratingScale] },
                          (_, i) => i + 1
                        ).reduce((obj, key) => {
                          obj[key] = {
                            name: key,
                            count: 0
                          };
                          return obj;
                        }, {})
                      }
                      return acc;
                    }, {})
                  }
                }
              }
              else if(subQuestionType === 'SINGLE_ANSWER' || subQuestionType === 'MULTIPLE_ANSWER'){
                options[question.parent_question_id][storageKeys.answers] = {
                  ...(options[question.parent_question_id][storageKeys.answers] || {}),
                  [question.id]: {
                    [storageKeys.rtxt]: question.rtxt,
                    [storageKeys.position]: question.position,
                    [storageKeys.scalePoints]: options[question.parent_question_id][storageKeys.scalePoints].reduce((acc, scalePoint) => {
                      acc[scalePoint.scale_point_id] = {
                        name: scalePoint.name,
                        count: 0
                      };
                      return acc;
                    }, {})
                  }
                }
              }
              else if (subQuestionType === 'TEXT_INPUT'){
                options[question.parent_question_id][storageKeys.answers] = {
                  ...(options[question.parent_question_id][storageKeys.answers] || {}),
                  [question.id]: {
                    [storageKeys.rtxt]: question.rtxt,
                    [storageKeys.position]: question.position,
                    [storageKeys.scalePoints]: options[question.parent_question_id][storageKeys.scalePoints].reduce((acc, scalePoint) => {
                      acc[scalePoint.scale_point_id] = {
                        name: scalePoint.name,
                        count: 0,
                        values: []
                      };
                      return acc;
                    }, {})
                  }
                }
              }
              else if (subQuestionType === 'DROP_DOWN'){
                options[question.parent_question_id][storageKeys.answers] = {
                  ...(options[question.parent_question_id][storageKeys.answers] || {}),
                  [question.id]: {
                    [storageKeys.rtxt]: question.rtxt,
                    [storageKeys.position]: question.position,
                    [storageKeys.scalePoints]: options[question.parent_question_id][storageKeys.scalePoints].reduce((acc, scalePoint) => {
                      acc[scalePoint.scale_point_id] = {
                        name: scalePoint.name,
                        choices: options[question.parent_question_id][storageKeys.scalePoints].find((scale) => scale.scale_point_id === scalePoint.scale_point_id).choices.reduce((acc, choice) => {
                          acc[choice.choice_id] = {
                            name: choice.txt,
                            count: 0
                          };
                          return acc;
                        }, {})
                      }
                      return acc;
                    }, {})
                  }
                }
              }
              delete options[question.id];
            break;
      default:
        options[question.id][storageKeys.answers] = [];
    }
  } catch (error) {
    console.error("Error in getting categories for each question", error);
    throw new Error("Error in getting categories for each question");
  }
};

const updateCategoriesCount = async ( {responses, container} ) =>{
  const { dataTypes } = await constants;
  for (const answer of responses) {
    if (
      container[answer.choice_id] !== undefined &&
      container[answer.choice_id] !== null
    ) {
      if (typeof container[answer.choice_id] === dataTypes.number) {
        container[answer.choice_id] += answer.value;
      } else {
        container[answer.choice_id].count += answer.value;
      }
    }
  }
}

const setCountFromResponses= async ( { responses, options, questionId } )=>{
  const { storageKeys } = await constants;
  for (const answer of responses) {
    if(options[questionId][storageKeys.answers][answer.type]!==undefined && options[questionId][storageKeys.answers][answer.type]!==null){
      options[questionId][storageKeys.answers][answer.type].push(answer.url);
      options[questionId][storageKeys.data][answer.type]+=1;
    }
  }
}

const getFileCategory=(fileType, fileTypes)=>{
  const type=fileType.split('/')[0];
  if(type===fileTypes.image.name||type===fileTypes.video.name||type===fileTypes.audio.name){
    return type;
  }else{
    for(const key of Object.keys(fileTypes)){
      if(fileTypes[key].mimeTypes.includes(fileType)){
        return fileTypes[key].name;
      }
  }
  return null;
}
}

const setCategoriesCountFromResponses = async ({
  result,
  options,
  questionId,
  questionType,
}) => {
  try {
    const {
      questionTypes,
      storageKeys,
    } = await constants;
    let container;
    if (result.report_answers && options[questionId][storageKeys.answers]) {
      container = options[questionId][storageKeys.answers];
      if(questionType===questionTypes.ContactForm.name){
        for (const answer of result.report_answers) {
          for(const subQuestionId of Object.keys(container)){
            if(answer[subQuestionId]){
              container[subQuestionId][storageKeys.choices] ? container[subQuestionId][storageKeys.answers].push(container[subQuestionId][storageKeys.choices][answer[subQuestionId]]) : container[subQuestionId][storageKeys.answers].push(answer[subQuestionId]);
            }else{
              container[subQuestionId][storageKeys.answers].push(storageKeys.NA);
            }
          }
        }
      }else if(questionType===questionTypes.Signature.name){
        await setCountFromResponses({ responses: result.report_answers.map((answer)=>answer.answer), options , questionId});
      }else if(questionType===questionTypes.FileInput.name){
        for(const answer of result.report_answers){
          await setCountFromResponses({ responses: answer.answer?.files, options , questionId });
        }
      }else{
      for (const answer of result.report_answers) {
        container.push(answer.answer);
      }
    }
    } 
    if(result.report_data && (options[questionId][storageKeys.data] || questionType === questionTypes.Matrix.name)){
      container = options[questionId][storageKeys.data];
      if(questionType===questionTypes.GroupRating.name){
        for(const subQuestionReport of result.report_data){
          const subQuestionData=subQuestionReport.ratings.map((choiceObj)=>{
            return {
              choice_id:choiceObj.rating,
              value:choiceObj.count
            }
          });
          updateCategoriesCount( { responses: subQuestionData, container: container[subQuestionReport.question_id][storageKeys.data]});
        }
      } else if(questionType===questionTypes.Matrix.name) {
        const subQuestionType = options[questionId][storageKeys.questionType];
        const container = options[questionId][storageKeys.answers];
        if(subQuestionType==='RATING'){
          const subContainers = Object.keys(container);
          for(let i = 0; i< result.report_data.length; i++){
            const answers = result.report_data[i];
            const newContainer = container[subContainers[i]];
            for(let j =0; j< answers.length; j++){
              Object.values(answers[j]).forEach((obj)=>{
                if(newContainer[storageKeys.scalePoints][obj.answer_choice_scale_point_id][storageKeys.choices][obj.rating]){
                  newContainer[storageKeys.scalePoints][obj.answer_choice_scale_point_id][storageKeys.choices][obj.rating].count += 1;
                }
              });
            }
          }
        }
        else if(subQuestionType==='SINGLE_ANSWER' || subQuestionType==='MULTIPLE_ANSWER' || subQuestionType==='DROP_DOWN'){
          const subContainers = Object.keys(container);
          for(let i = 0; i< result.report_data.length; i++){
            const answers = result.report_data[i];
            const newContainer = container[subContainers[i]];
            for(let j =0; j< answers.length; j++){
              Object.keys(answers[j]).forEach((objKey)=>{
                if(subQuestionType==='DROP_DOWN'){
                  if(newContainer[storageKeys.scalePoints][objKey][storageKeys.choices][answers[j][objKey][0]]){
                    newContainer[storageKeys.scalePoints][objKey][storageKeys.choices][answers[j][objKey][0]].count += 1;
                  }
                }
                else{
                  if(newContainer[storageKeys.scalePoints][objKey]){
                    newContainer[storageKeys.scalePoints][objKey].count += 1;
                  }
                }
              });
            }
          }
        }
        else if(subQuestionType==='TEXT_INPUT'){
          const subContainers = Object.keys(container);
          for(let i = 0; i< result.report_data.length; i++){
            const answers = result.report_data[i];
            const newContainer = container[subContainers[i]];
            for(let j =0; j< answers.length; j++){
              Object.values(answers[j]).forEach((answer)=>{
                answer.forEach((obj) => {
                  if(newContainer[storageKeys.scalePoints][obj.answer_choice_scale_point_id]){
                    newContainer[storageKeys.scalePoints][obj.answer_choice_scale_point_id].count += 1;
                    newContainer[storageKeys.scalePoints][obj.answer_choice_scale_point_id].values.push([obj.text]);
                  }
                })
              });
            }
          }
        }
      }else{
        updateCategoriesCount({ responses: result.report_data, container});
      }
    }
  } catch (error) {
    console.error("Error in setting categories count from responses", error);
    throw new Error("Error in setting categories count from responses");
  }
};

const getResponsesCount = async ({
  result,
  totalResponsesCount,
  questionId,
  options,
  questionType,
}) => {
  try {
    const {
      applicableQuestionTypes,
      storageKeys,
      fileTypes
    } = await constants;
    totalResponsesCount[questionId] = {
      ...result.response_count,
    };
    const container = options[questionId][storageKeys.data];
    if (container) {
      if (applicableQuestionTypes.includes(questionType)) {
        let count = 0;
        const responses = result.report_data || result.report_answers;
        for (const answer of responses) {
          if(answer.answer?.files){
            const updatedFiles=await Promise.all(answer.answer.files.map(async(file)=>{
              file.type=await getFileCategory(file.type, fileTypes);
              return file;
            }));
            for(const file of updatedFiles){
              if(container[file.type]!==undefined && container[file.type]!==null){
                count++;
                break;
              }
            }
          }else if (
            container[answer.choice_id] !== undefined &&
            container[answer.choice_id] !== null
          ) {
            count += answer.value;
          }else if(container[answer.answer.type]!==undefined && container[answer.answer.type]!==null){
            count+=1;
          }
        }
        totalResponsesCount[questionId][storageKeys.applicableCount] = count;
      } else {
        totalResponsesCount[questionId][storageKeys.applicableCount] =
          result.response_count.answered;
      }
    }
  } catch (error) {
    console.error("Error in getting responses count", error);
    throw new Error("Error in getting responses count");
  }
};

const generateStructuredXlsxData = async ({
  surveyName,
  surveyType,
  questions,
  options,
  failedReports,
  totalResponsesCount,
}) => {
  try {
    const {
      questionTypes,
      applicableQuestionTypes,
      scoringQuestionTypes,
      storageKeys
    } = await constants;
    const responseData = [
      [`Survey Name : ${surveyName}`],
      [`Survey Type : ${surveyType}`],
      [],
      [],
      [],
    ];
    let count = 0;
    for (const question of questions) {
      const questionId = question.id;
      if (options[questionId] && totalResponsesCount[questionId]) {
        count++;
        if (question.section !== null && question.section.title !== null) {
          responseData.push([`Section Title : ${question.section.title}`]);
        }
        responseData.push(
          [`${storageKeys.question}${count} Description : ${question.rtxt}`],
          [`Question Type : ${question.type}`],
          [
            `Answered Count : ${
              applicableQuestionTypes.includes(question.type)
                ? totalResponsesCount[questionId].applicable_count
                : totalResponsesCount[questionId].answered
            }`,
          ],
          [`Skipped Count : ${totalResponsesCount[questionId].skipped}`]
        );
        if (questionTypes.OpinionScale.name === question.type) {
          responseData.push([
            `Not Applicable Count : ${totalResponsesCount[questionId].not_applicable_count}`,
          ]);
        } else if (scoringQuestionTypes.includes(question.type)) {
          const score = await getScoreForQuestion({
            questionId,
            options,
            questionType: question.type,
            questionTypes,
          });
          responseData.push([score]);
        }

        await setRecordsForQuestion({
          options,
          questionId,
          responseData,
          totalResponsesCount,
          questionType: question.type,
          questionTypes,
        });

        responseData.push([], []);
      }
    }
    if (failedReports.length > 0) {
      responseData.push([]);
      responseData.push([
        "Failed to generate reports for questions with Ids : ",
      ]);
      for (const questionId of failedReports) {
        responseData.push([questionId]);
      }
    }
    return responseData;
  } catch (error) {
    console.error("Error in generating structured XLSX data", error);
    throw new Error("Error in generating structured XLSX data");
  }
};

const getScoreForQuestion = async ({
  questionId,
  options,
  questionType,
}) => {
  const {
    questionTypes,
    storageKeys,
  } = await constants;
  try {
    let score = 0,
      result;
    const container = options[questionId][storageKeys.data];
    if (questionType === questionTypes.NPSScore.name) {
      const totalResponses = Object.values(container).reduce(
        (acc, value) => acc + value,
        0
      );
      for (const [key, value] of Object.entries(container)) {
        if (key >= 9) {
          score += value;
        } else if (key <= 6) {
          score -= value;
        }
      }
      score = (score / totalResponses) * 100;
      result = `NPS Score : ${score.toFixed(0)}`;
    } else if (questionType === questionTypes.CESScore.name) {
      const totalResponses = Object.values(container).reduce(
        (acc, value) => acc + value,
        0
      );
      const scoreValue = Object.entries(container).reduce(
        (acc, [key, value]) => acc + parseInt(key, 10) * value,
        0
      );
      score = scoreValue / totalResponses;
      result = `CES Score : ${score.toFixed(0)}`;
    } else if (questionType === questionTypes.CSATScore.name) {
      const totalResponses = Object.values(container).reduce(
        (acc, value) => acc + value,
        0
      );
      const promoters = Object.entries(container).reduce(
        (acc, [key, value]) => acc + (key >= 4 ? value : 0),
        0
      );
      score = (promoters / totalResponses) * 100;
      result = `CSAT Percentage : ${score.toFixed(0)}%`;
    }
    return result;
  } catch (error) {
    console.error("Error in getting score for question", error);
    throw new Error("Error in getting score for question");
  }
};

const addRecordsForQuestion = async ( { totalResponsesCount, container, responseData, questionType, questionId } ) =>{
  const {
    questionTypes,
    dataTypes,
  } = await constants;
  responseData.push(["Option Title", "Percentage", "Count"]);
      for (const [key, value] of Object.entries(container)) {
        let percentage, currentKey, currentValue;
        if (typeof value === dataTypes.object) {
          currentKey = value.choice_value;
          percentage =
            (value.count / totalResponsesCount[questionId].applicable_count ||
              0) * 100;

          currentValue = value.count;
        } else {
          currentKey = key;
          if (questionTypes.YesNo.name === questionType) {
            currentKey = key == 0 ? "Yes" : "No";
          }
          currentValue = value;
          percentage =
            (value / totalResponsesCount[questionId].applicable_count || 0) *
            100;
        }
        responseData.push([
          currentKey,
          `${
            percentage % 1 === 0 ? percentage.toFixed(0) : percentage.toFixed(2)
          }%`,
          currentValue,
        ]);
      }
}

const setRecordsForQuestion = async ({
  options,
  questionId,
  responseData,
  totalResponsesCount,
  questionType,
}) => {
  const {
    questionTypes,
    storageKeys,
  } = await constants;
  try {
    let container;
    if(questionType===questionTypes.Matrix.name){
      const subQuestionType = options[questionId][storageKeys.questionType];
      container = options[questionId][storageKeys.answers];
      if(subQuestionType==='RATING' || subQuestionType==='DROP_DOWN'){
        const subContainers = Object.keys(options[questionId][storageKeys.answers]);
        for(let i = 0; i< subContainers.length; i++){
          const data = container[subContainers[i]];
          responseData.push(
            [],
            [`${storageKeys.subQuestion}${i + 1} Description : ${data.rtxt}`]
          );
          const scalePoints = Object.keys(data.scalePoints);
          for(let j = 0 ; j < scalePoints.length ;j++) {
            responseData.push(
              [`Scale Point : ${data.scalePoints[scalePoints[j]].name}`],
              ["Option Title", "Percentage", "Count"]
            );
            const totalCount = Object.values(data.scalePoints[scalePoints[j]].choices).reduce((acc, value) => acc + value.count, 0);
            for(const value of Object.values(data.scalePoints[scalePoints[j]].choices)){
              responseData.push([
                value.name,
                totalCount > 0 ? `${((value.count / totalCount) * 100)}%` : `0%`,
                value.count
              ]);
            }
            responseData.push([]);
          }
        }
      }
      else if(subQuestionType==='SINGLE_ANSWER' || subQuestionType==='MULTIPLE_ANSWER'){
        const subContainers = Object.keys(options[questionId][storageKeys.answers]);
        for(let i = 0; i< subContainers.length; i++){
          const data = container[subContainers[i]];
          responseData.push(
            [],
            [`${storageKeys.subQuestion}${i + 1} Description : ${data.rtxt}`],
            [`Scale Points Title`, `Percentage`, `Count`]
          );
          const totalCount = Object.values(data.scalePoints).reduce((acc, value) => acc + value.count, 0);
          for(const value of Object.values(data.scalePoints)){
            responseData.push([
              value.name,
              totalCount > 0 ? `${((value.count / totalCount) * 100)}%` : `0%`,
              value.count
            ]);
          }
        }
      }
      else if(subQuestionType==='TEXT_INPUT'){
        const subContainers = Object.keys(options[questionId][storageKeys.answers]);
        for(let i = 0; i< subContainers.length; i++){
          const data = container[subContainers[i]];
          responseData.push(
            [],
            [`${storageKeys.subQuestion}${i + 1} Description : ${data.rtxt}`]
          );
          for(const value of Object.values(data.scalePoints)){
            responseData.push([
              `Scale Point : ${value.name}`,
            ]);
            responseData.push(...value.values);
            responseData.push([]);
          }
        }
      }
      return;
    }
    if (options[questionId][storageKeys.data] && Object.keys(options[questionId][storageKeys.data]).length > 0) {
      container=options[questionId][storageKeys.data];
      if(questionType===questionTypes.GroupRating.name){
        for (const [index, [key, value]] of Object.entries(container).entries()) {
          responseData.push(
            [],
            [`${storageKeys.subQuestion}${index + 1} Description : ${container[key][storageKeys.rtxt]}`]
          );
          await addRecordsForQuestion({
            container: value.data,
            totalResponsesCount,
            responseData,
            questionType,
            questionId,
          });
        }
      }else{
        await addRecordsForQuestion( { container : container, totalResponsesCount , responseData, questionType, questionId} );
      }
    }
    const isOtherTextAvailable = questionTypes.MultiChoice.name === questionType || questionTypes.MultiChoicePicture.name === questionType || questionTypes.Dropdown.name===questionType;
    if (options[questionId][storageKeys.answers]) {
      container = options[questionId][storageKeys.answers];
      if (container.length > 0 || Object.keys(container.length > 0)) {
        responseData.push([!isOtherTextAvailable ? "Responses are : " : "Other texts entered are : "]);
        if(questionType===questionTypes.ContactForm.name){
          const rowHeaders=['S.No & Title'];
          for(const key of Object.keys(container)){
            rowHeaders.push(container[key][storageKeys.rtxt]);
          }
          responseData.push(rowHeaders);
          for(let i=0;i<totalResponsesCount[questionId].answered;i++){
            const row=[`${storageKeys.contact}${i+1}`];
            for(const key of Object.keys(container)){
              row.push(container[key][storageKeys.answers][i]);
            }
            responseData.push(row);
          }
        }else if(questionType===questionTypes.Signature.name || questionType===questionTypes.FileInput.name){
          for(const key of Object.keys(container)){
            responseData.push([`urls for ${key} type are : `]);
            if(!container[key]?.length){
              responseData.push(["No responses available"]);
              continue;
            }
            for(const url of container[key]){
              responseData.push([url]);
            }
          }
        }else{
        for (let i = 0; i < container.length; i++) {
          responseData.push([container[i]]);
        }
      }
      } else if(!isOtherTextAvailable) {
        responseData.push(["No responses available"]);
      }
    } 
  } catch (error) {
    console.error("Error in setting records for question", error);
    throw new Error("Error in setting records for question");
  }
};

const getAllQuestionsofSurvey = async ({ surveyId, config }) => {
  const {
    API_BASE_URL,
  } = await constants;
  let has_next_page = true;
  let page = 1;
  const questions = [];
  while (has_next_page) {
    const result = await $Fetch.get(
      `${API_BASE_URL}/v3/questions?survey_id=${surveyId}&&page=${page}&&limit=100`,
      config
    );
    if (result?.status !== 200 || !result?.data?.data) {
      return {
        data: {
          status: result?.status || 500,
          error: result?.data?.error || "Fetching questions failed.",
        },
      };
    }
    has_next_page = result.data.has_next_page;
    page++;
    questions.push(...result.data.data);
  }
  return questions;
};
