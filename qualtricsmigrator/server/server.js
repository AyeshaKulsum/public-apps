const cheerio = require("cheerio");

exports = {
  surveyConverter: async function (args) {
    return await surveyConverterHandler(args);
  },
};

const serverConstants = {
  classicForm: 'ClassicForm',
  surveyCreate: 'surveyCreate',
  questionCreate: 'questionCreate',
  sectionCreate:'sectionCreate',
  conversational:'Conversational'

};

const thankYouJson = {
  message:
    "We thank you for your time spent taking this survey.\nYour response has been recorded.",
  branding: true,
};

const getHeaders = () => {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer <%=iparams.surveysparrow_api_key%>`,
};}

const createSection = async ($Fetch,payload) =>{
  let properties={
    section_intro:"same",
    label:"Continue",
    single_page_view:true,
    section_randomise:payload.surveyElement.options.RandomizeQuestions ? true : false
  };
  const response = await $Fetch.post(
    `${process.env.apiUrl}/v3/sections`,
    {
      survey_id: payload.surveyId,
      sections:[
        {
          name:payload.surveyElement.name,
          description:payload.surveyElement.description,
          properties,
        }
      ]
    },
    {
      headers: getHeaders()
    }
  );
  return response;
}

const surveyConverterHandler = async (payload) => {
  try {
    const smiPayload = payload.data;
    switch (smiPayload.data.type) {
      case serverConstants.surveyCreate:
        return createSurvey(
          smiPayload.surveyName,
          $Fetch,
          smiPayload.data.surveyType,
          smiPayload.data.npsQuestion,
          smiPayload.data.folderId
        );
      case serverConstants.sectionCreate:
        try{
          return await createSection($Fetch, smiPayload);
        }catch(error){
          console.log("Error while creating a section", error);
          return { message: "ERROR OCCURED" };
        }
      case serverConstants.questionCreate:
        try {
          return await createQuestionByQuestionType(
            smiPayload,
            $Fetch
          );
        } catch (error) {
          console.log("Error while creating question", error);
          return { message: "ERROR OCCURED" };
        }
      default : console.log('Error occured while triggering smi function');
      return { message : " ERROR OCCURED"};
    }
  } catch (error) {
    return { message: "ERROR OCCURED" };
  }
};

const createSurveyFunc = async ($Fetch, surveyName, surveyType, folderId) => {
 if(folderId) {
  return $Fetch.post(
    `${process.env.apiUrl}/v3/surveys`,
    {
      name: surveyName,
      survey_folder_id: folderId,
      survey_type: surveyType,
      thankyou_json: [
        thankYouJson
      ],
    },
    {
      headers: getHeaders()
    }
  );
 } 
 return $Fetch.post(
  `${process.env.apiUrl}/v3/surveys`,
  {
    name: surveyName,
    survey_type: surveyType,
    thankyou_json: [
      thankYouJson
    ],
  },
  {
    headers: getHeaders()
  }
);
 
}

const createSurvey = async (surveyName, $Fetch, surveyType, npsQuestion, folderId) => {
  if ( surveyType && surveyType !== serverConstants.classicForm && surveyType !== serverConstants.conversational) {
    if(!npsQuestion){
      return {
        title:'Survey creation failed.',
        description:'NpsQuestion is required to create cx survey.'
      }
    }
    const response = await createSurveyFunc($Fetch, surveyName, surveyType, folderId);
    
    const surveyId = response?.data?.data?.id;

    const questions = await $Fetch.get(
      `${process.env.apiUrl}/v3/questions?survey_id=${surveyId}`,
      {
        headers: getHeaders()
      }
    );

    await $Fetch.put(
      `${process.env.apiUrl}/v3/questions/${questions?.data?.data[0]?.id}`,
      {
        survey_id: surveyId,
        question:{
          text:removeHtmlTags(npsQuestion.Payload.QuestionText),
          description: npsQuestion.Payload.QuestionDescription
        }
      },
      {
        headers: getHeaders()
      }
    );

    return response;
  }
  return createSurveyFunc($Fetch, surveyName, surveyType ?? serverConstants.classicForm, folderId);
};
const sliderTypes = {
    TenGauge: "TenGauge",
    GaugeSlider: "gaugeSlider",
    ThermoMeter: "Thermometer",
    ThermometerSlider: "thermometerSlider",
    StopLight: "StopLight",
    TrafficLightSlider: "trafficLightSlider",
    Smile: "Smile",
    SmileySlider: "smileySlider",
    LineSlider:"lineSlider"
  }
const createQuestionByQuestionType = async (smiPayload, $Fetch) => {
  const questionTypes = {
    TextInput: "TE",
    MultiChoice: "MC",
    GroupRating: "Slider",
    Message: "DB",
    Matrix: "Matrix",
    RankOrder: "RO",
    SideBySide: "SBS",
    Slider: "SS",
    ConstantSum: "CS",
    GroupRank: "PGR",
    Signature: "Draw",
  };
  
  switch (smiPayload.surveyElement.Payload.QuestionType) {
    case questionTypes["TextInput"]:
      return await textInput(smiPayload, $Fetch);

    case questionTypes["MultiChoice"]:
      return await multiChoice(smiPayload, $Fetch);

    case questionTypes["Message"]:
      return await message(smiPayload, $Fetch);

    case questionTypes["Matrix"]:
      return await matrix(smiPayload, $Fetch);

    case questionTypes["GroupRating"]:
      return await groupRating(smiPayload, $Fetch);

    case questionTypes["RankOrder"]:
      return await rankOrder(smiPayload, $Fetch);

    case questionTypes["SideBySide"]:
      return await sideBySide(smiPayload, $Fetch);

    case questionTypes["Slider"]:
      return await slider(smiPayload, $Fetch);

    case questionTypes["ConstantSum"]:
      return await constantSum(smiPayload, $Fetch);

    case questionTypes["GroupRank"]:
      return await groupRank(smiPayload, $Fetch);

    case questionTypes["Signature"]:
      return await signature(smiPayload, $Fetch);

    default:
      return { message: "NOT SUPPORTED" };
  }
};

const textInput = async (smiPayload, $Fetch) => {
  return await createQuestion(
    $Fetch,
    {
      survey_id: smiPayload?.surveyId,
      ...(smiPayload?.sectionId && {section_id : smiPayload.sectionId} ),
      question: {
        text: removeHtmlTags(smiPayload.surveyElement.Payload.QuestionText),
        description: smiPayload.surveyElement.Payload.QuestionDescription,
        type: "TextInput",
        required:
          smiPayload.surveyElement.Payload.Validation.Settings.ForceResponse ===
          "ON",
        properties: {
          data: {
            type: lineFormat(smiPayload.surveyElement.Payload.Selector),
          },
        },
      },
    }
  );
};

const slider = async (smiPayload, $Fetch) => {
  let sliderType;
  if (smiPayload.surveyElement.Payload.Scale === sliderTypes.TenGauge) {
    sliderType = sliderTypes.GaugeSlider;
  } else if (smiPayload.surveyElement.Payload.Scale === sliderTypes.ThermoMeter) {
    sliderType = sliderTypes.ThermometerSlider;
  } else if (smiPayload.surveyElement.Payload.Scale === sliderTypes.StopLight) {
    sliderType = sliderTypes.TrafficLightSlider;
  } else if (smiPayload.surveyElement.Payload.Scale === sliderTypes.Smile) {
    sliderType = sliderTypes.SmileySlider;
  } else {
    sliderType = sliderTypes.LineSlider;
  }
  return await createQuestion(
    $Fetch,
    {
      survey_id: smiPayload?.surveyId,
      ...(smiPayload?.sectionId && {section_id : smiPayload.sectionId} ),
      question: {
        text: removeHtmlTags(smiPayload.surveyElement.Payload.QuestionText),
        description: smiPayload.surveyElement.Payload.QuestionDescription,
        type: "Slider",
        required:
          smiPayload.surveyElement.Payload.Validation.Settings
            ?.ForceResponse === "ON",
        properties: {
          data: {
            slider_type: sliderType,
          },
        },
      },
    }
  );
};

const signature = async (smiPayload, $Fetch) => {
  return await createQuestion(
    $Fetch,
    {
      survey_id: smiPayload?.surveyId,
      ...(smiPayload?.sectionId && {section_id : smiPayload.sectionId} ),
      question: {
        text: removeHtmlTags(smiPayload.surveyElement.Payload.QuestionText),
        description: smiPayload.surveyElement.Payload.QuestionDescription,
        type: "Signature",
        required:
          smiPayload.surveyElement.Payload.Validation.Settings
            ?.ForceResponse === "ON",
      },
    }
  );
};

const sideBySide = async (smiPayload, $Fetch) => {
  let sbsRowLen = smiPayload.surveyElement.Payload.ChoiceOrder.length;
  let sbsArray = new Array(sbsRowLen);
  for (let i = 0; i < sbsRowLen; i++) {
    sbsArray[i] = {
      left_text:
        smiPayload.surveyElement.Payload.Choices[
          smiPayload.surveyElement.Payload.ChoiceOrder[i]
        ]?.Display,
    };
  }
  let sbsColumnArray = [];
  let itr = 0;
  while (itr < smiPayload.surveyElement.Payload.NumberOfQuestions) {
    let obj = {};
    obj.name =
      smiPayload.surveyElement.Payload.AdditionalQuestions[
        itr + 1
      ].QuestionText;
    let choices = [];
    for (const answer in smiPayload.surveyElement.Payload.AdditionalQuestions[
      itr + 1
    ].Answers) {
      choices.push({
        text: smiPayload.surveyElement.Payload.AdditionalQuestions[itr + 1]
          .Answers[answer]?.Display,
      });
    }
    obj.choices = choices;
    sbsColumnArray.push(obj);
    itr += 1;
  }
  return await createQuestion(
    $Fetch,
    {
      survey_id: smiPayload?.surveyId,
      ...(smiPayload?.sectionId && {section_id : smiPayload.sectionId} ),
      question: {
        text: removeHtmlTags(smiPayload.surveyElement.Payload.QuestionText),
        description: smiPayload.surveyElement.Payload.QuestionDescription,
        type: "Matrix",
        randomized:
          smiPayload.surveyElement.Payload.Randomization !== undefined,
        required:
          smiPayload.surveyElement.Payload.Validation.Settings
            ?.ForceResponse === "ON",
        properties: {
          data: {
            type: "DROP_DOWN",
          },
        },
        row: sbsArray,
        column: sbsColumnArray,
      },
    }
  );
};

const removeHtmlTags = (text) => {
  const $ = cheerio.load(text);
  return $.text();
};

const rankOrder = async (smiPayload, $Fetch) => {
  let rankOrderChoiceLen = smiPayload.surveyElement.Payload.ChoiceOrder.length;
  let rankOrderArray = new Array(rankOrderChoiceLen);
  for (let i = 0; i < rankOrderChoiceLen; i++) {
    rankOrderArray[i] = {
      text: smiPayload.surveyElement.Payload.Choices[
        smiPayload.surveyElement.Payload.ChoiceOrder[i]
      ]?.Display,
    };
  }

  return await createQuestion(
    $Fetch,
    {
      survey_id: smiPayload?.surveyId,
      ...(smiPayload?.sectionId && {section_id : smiPayload.sectionId} ),
      question: {
        text: removeHtmlTags(smiPayload.surveyElement.Payload.QuestionText),
        description: smiPayload.surveyElement.Payload.QuestionDescription,
        type: "RankOrder",
        required:
          smiPayload.surveyElement.Payload.Validation.Settings.ForceResponse ===
          "ON",
        choices: rankOrderArray,
      },
    }
  );
};

const multiChoice = async (smiPayload, $Fetch) => {
  const properties = { data: {} };
  if (
    smiPayload.surveyElement.Payload.Selector === "MAVR" ||
    smiPayload.surveyElement.Payload.Selector === "MACOL" ||
    smiPayload.surveyElement.Payload.Selector === "MSB"
  ) {
    if (
      smiPayload.surveyElement.Payload.Validation.Settings?.MinChoices &&
      !smiPayload.surveyElement.Payload.Validation.Settings.MaxChoice
    ) {
      properties.data.type = "RANGE";
      properties.data.minLimit =
        smiPayload.surveyElement.Payload.Validation.Settings.MinChoices;
      properties.data.maxLimit =
        smiPayload.surveyElement.Payload.ChoiceOrder.length;
    } else if (
      smiPayload.surveyElement.Payload.Validation.Settings.MinChoices &&
      smiPayload.surveyElement.Payload.Validation.Settings.MaxChoices
    ) {
      properties.data.type = "RANGE";
      properties.data.minLimit =
        smiPayload.surveyElement.Payload.Validation.Settings.MinChoices;
      properties.data.maxLimit =
        smiPayload.surveyElement.Payload.Validation.Settings.MinChoices;
    }
  }
  if (smiPayload.surveyElement.Payload.Selector === "NPS") {
    return await createQuestion(
      $Fetch,
      {
        survey_id: smiPayload?.surveyId,
        ...(smiPayload?.sectionId && {section_id : smiPayload.sectionId} ),
        question: {
          text: smiPayload.surveyElement.Payload.QuestionText.replace(
            /<[^>]*>/g,
            ""
          ),
          description: smiPayload.surveyElement.Payload.QuestionDescription,
          type: "OpinionScale",
          required:
            smiPayload.surveyElement.Payload.Validation.Settings
              .ForceResponse === "ON",
          properties: {
            data: {
              min:
                smiPayload.surveyElement.Payload.ColumnLabels.length > 1 &&
                smiPayload.surveyElement.Payload.ColumnLabels[0]?.Display
                  ? smiPayload.surveyElement.Payload.ColumnLabels[0].Display
                  : "builder.opinion_scale.min",
              mid:
                smiPayload.surveyElement.Payload.ColumnLabels.length == 3 &&
                smiPayload.surveyElement.Payload.ColumnLabels[1]?.Display
                  ? smiPayload.surveyElement.Payload.ColumnLabels[1].Display
                  : "builder.opinion_scale.mid",
              max:
                smiPayload.surveyElement.Payload.ColumnLabels.length > 2 &&
                smiPayload.surveyElement.Payload.ColumnLabels[
                  smiPayload.surveyElement.Payload.ColumnLabels.length - 1
                ]?.Display
                  ? smiPayload.surveyElement.Payload.ColumnLabels[
                      smiPayload.surveyElement.Payload.ColumnLabels.length - 1
                    ]?.Display
                  : "builder.opinion_scale.max",
              step: 10,
            },
          },
        },
      }
    );
  } else {
    let chLen = smiPayload.surveyElement.Payload.ChoiceOrder.length;
    let arr = [];
    let other = false;
    let otherText = "";
    for (let i = 0; i < chLen; i++) {
      if (
        smiPayload.surveyElement.Payload.Choices[
          smiPayload.surveyElement.Payload.ChoiceOrder[i]
        ]?.TextEntry === "true"
      ) {
        other = true;
        otherText =
          smiPayload.surveyElement.Payload.Choices[
            smiPayload.surveyElement.Payload.ChoiceOrder[i]
          ]?.Display;
        continue;
      }
      arr.push({
        text: smiPayload.surveyElement.Payload.Choices[
          smiPayload.surveyElement.Payload.ChoiceOrder[i]
        ]?.Display,
      });
    }
    if (smiPayload.surveyElement.Payload.Selector === "DL") {
      return await createQuestion(
        $Fetch,
        other
          ? {
              survey_id: smiPayload?.surveyId,
              ...(smiPayload?.sectionId && {section_id : smiPayload.sectionId} ),
              question: {
                text: removeHtmlTags(
                  smiPayload.surveyElement.Payload.QuestionText
                ),
                description:
                  smiPayload.surveyElement.Payload.QuestionDescription,
                type: "Dropdown",
                multiple_answers:
                  smiPayload.surveyElement.Payload.Selector === "MAVR",
                other: other,
                other_text: {
                  text: otherText,
                },
                required:
                  smiPayload.surveyElement.Payload.Validation.Settings
                    .ForceResponse === "ON",
                choices: arr,
              },
            }
          : {
              survey_id: smiPayload?.surveyId,
              ...(smiPayload?.sectionId && {section_id : smiPayload.sectionId} ),
              question: {
                text: removeHtmlTags(
                  smiPayload.surveyElement.Payload.QuestionText
                ),
                description:
                  smiPayload.surveyElement.Payload.QuestionDescription,
                type: "Dropdown",
                multiple_answers:
                  smiPayload.surveyElement.Payload.Selector === "MAVR",
                required:
                  smiPayload.surveyElement.Payload.Validation.Settings
                    .ForceResponse === "ON",
                choices: arr,
              },
            }
      );
    }
    return await createQuestion(
      $Fetch,
      other
        ? {
            survey_id: smiPayload?.surveyId,
            ...(smiPayload?.sectionId && {section_id : smiPayload.sectionId} ),
            question: {
              text: removeHtmlTags(
                smiPayload.surveyElement.Payload.QuestionText
              ),
              description: smiPayload.surveyElement.Payload.QuestionDescription,
              type: "MultiChoice",
              multiple_answers:
                smiPayload.surveyElement.Payload.Selector === "MAVR" ||
                smiPayload.surveyElement.Payload.Selector === "MACOL" ||
                smiPayload.surveyElement.Payload.Selector === "MSB",
              other: other,
              other_text: {
                text: otherText,
              },
              randomized:
                smiPayload.surveyElement.Payload.Randomization !== undefined,
              required:
                smiPayload.surveyElement.Payload.Validation.Settings
                  .ForceResponse === "ON",
              choices: arr,
              properties,
            },
          }
        : {
            survey_id: smiPayload?.surveyId,
            ...(smiPayload?.sectionId && {section_id : smiPayload.sectionId} ),
            question: {
              text: removeHtmlTags(
                smiPayload.surveyElement.Payload.QuestionText
              ),
              description: smiPayload.surveyElement.Payload.QuestionDescription,
              type: "MultiChoice",
              multiple_answers:
                smiPayload.surveyElement.Payload.Selector === "MAVR" ||
                smiPayload.surveyElement.Payload.Selector === "MACOL" ||
                smiPayload.surveyElement.Payload.Selector === "MSB",
              randomized:
                smiPayload.surveyElement.Payload.Randomization !== undefined,
              required:
                smiPayload.surveyElement.Payload.Validation.Settings
                  .ForceResponse === "ON",
              choices: arr,
              properties,
            },
          }
    );
  }
};

const message = async (smiPayload, $Fetch) => {
  return await createQuestion(
    $Fetch,
    {
      survey_id: smiPayload?.surveyId,
      ...(smiPayload?.sectionId && {section_id : smiPayload.sectionId} ),
      question: {
        text: removeHtmlTags(smiPayload.surveyElement.Payload.QuestionText),
        description: smiPayload.surveyElement.Payload.QuestionDescription,
        type: "Message",
      },
    }
  );
};

const matrix = async (smiPayload, $Fetch) => {
  if (smiPayload.surveyElement.Payload.Selector === "Likert") {
    let rows = smiPayload.surveyElement.Payload.ChoiceOrder.length;
    let rowArray = new Array(rows);
    for (let i = 0; i < rows; i++) {
      rowArray[i] = {
        left_text:
          smiPayload.surveyElement.Payload.Choices[
            smiPayload.surveyElement.Payload.ChoiceOrder[i]
          ]?.Display,
      };
    }
    let columns = smiPayload.surveyElement.Payload.AnswerOrder.length;
    let columnArray = new Array(columns);
    for (let i = 0; i < columns; i++) {
      columnArray[i] = {
        name: smiPayload.surveyElement.Payload.Answers[
          smiPayload.surveyElement.Payload.AnswerOrder[i]
        ]?.Display,
      };
    }
    if (
      smiPayload.surveyElement.Payload.SubSelector === "SingleAnswer" ||
      smiPayload.surveyElement.Payload.SubSelector === "DL"
    ) {
      return await createQuestion(
        $Fetch,
        {
          survey_id: smiPayload?.surveyId,
          ...(smiPayload?.sectionId && {section_id : smiPayload.sectionId} ),
          question: {
            text: removeHtmlTags(smiPayload.surveyElement.Payload.QuestionText),
            description: smiPayload.surveyElement.Payload.QuestionDescription,
            type: "Matrix",
            randomized:
              smiPayload.surveyElement.Payload.Randomization !== undefined,
            required:
              smiPayload.surveyElement.Payload.Validation.Settings
                ?.ForceResponse === "ON",
            row: rowArray,
            column: columnArray,
          },
        }
      );
    } else if (
      smiPayload.surveyElement.Payload.SubSelector === "MultipleAnswer"
    ) {
      return await createQuestion(
        $Fetch,
        {
          survey_id: smiPayload?.surveyId,
          ...(smiPayload?.sectionId && {section_id : smiPayload.sectionId} ),
          question: {
            text: removeHtmlTags(smiPayload.surveyElement.Payload.QuestionText),
            description: smiPayload.surveyElement.Payload.QuestionDescription,
            type: "Matrix",
            randomized:
              smiPayload.surveyElement.Payload.Randomization !== undefined,
            required:
              smiPayload.surveyElement.Payload.Validation.Settings
                ?.ForceResponse === "ON",
            properties: {
              data: {
                type: "MULTIPLE_ANSWER",
              },
            },
            row: rowArray,
            column: columnArray,
          },
        }
      );
    } else if (smiPayload.surveyElement.Payload.SubSelector === "DND") {
      for (let row of rowArray) {
        row.text = row.left_text;
        delete row.left_text;
      }
      for (let column of columnArray) {
        column.left_text = column.name;
        delete column.name;
      }
      return await createQuestion(
        $Fetch,
        {
          survey_id: smiPayload?.surveyId,
          ...(smiPayload?.sectionId && {section_id : smiPayload.sectionId} ),
          question: {
            text: removeHtmlTags(smiPayload.surveyElement.Payload.QuestionText),
            description: smiPayload.surveyElement.Payload.QuestionDescription,
            type: "GroupRank",
            required:
              smiPayload.surveyElement.Payload.Validation.Settings
                ?.ForceResponse === "ON",
            properties: {
              data: {
                is_ranking_enabled: false,
              },
            },
            choices: rowArray,
            row: columnArray,
          },
        }
      );
    } else {
      return { message: "NOT SUPPORTED" };
    }
  } else if (smiPayload.surveyElement.Payload.Selector === "Bipolar") {
    let rows = smiPayload.surveyElement.Payload.ChoiceOrder.length;
    let rowArray = new Array(rows);
    for (let i = 0; i < rows; i++) {
      let s =
        smiPayload.surveyElement.Payload.Choices[
          smiPayload.surveyElement.Payload.ChoiceOrder[i]
        ]?.Display;
      let a = "";
      let b = "";
      for (let i = s.length; i > 0; i--) {
        if (
          (s[i] === ":" && s[i - 1] !== "\\") ||
          (s[i] === ":" && s.slice(i, i + 5) === "\\\\")
        ) {
          a = s.slice(0, i);
          b = s.slice(i + 1);
        }
      }
      a = a.replace(/\\/g, "");
      b = b.replace(/\\/g, "");
      rowArray[i] = { left_text: a, right_text: b };
    }
    let columns = smiPayload.surveyElement.Payload.AnswerOrder.length;
    let columnArray = new Array(columns);
    for (let i = 0; i < columns; i++) {
      columnArray[i] = {
        name:
          smiPayload.surveyElement.Payload.ColumnLabels[i]?.Display ||
          smiPayload.surveyElement.Payload.Answers[
            smiPayload.surveyElement.Payload.AnswerOrder[i]
          ]?.Display,
      };
    }
    return await createQuestion(
      $Fetch,
      {
        survey_id: smiPayload?.surveyId,
        ...(smiPayload?.sectionId && {section_id : smiPayload.sectionId} ),
        question: {
          text: removeHtmlTags(smiPayload.surveyElement.Payload.QuestionText),
          description: smiPayload.surveyElement.Payload.QuestionDescription,
          type: "BipolarMatrix",
          randomized:
            smiPayload.surveyElement.Payload.Randomization !== undefined,
          required:
            smiPayload.surveyElement.Payload.Validation.Settings
              ?.ForceResponse === "ON",
          row: rowArray,
          column: columnArray,
        },
      }
    );
  } else if (smiPayload.surveyElement.Payload.Selector === "TE") {
    let rows = smiPayload.surveyElement.Payload.ChoiceOrder.length;
    let rowArray = new Array(rows);
    for (let i = 0; i < rows; i++) {
      rowArray[i] = {
        left_text:
          smiPayload.surveyElement.Payload.Choices[
            smiPayload.surveyElement.Payload.ChoiceOrder[i]
          ]?.Display,
      };
    }
    let columns = smiPayload.surveyElement.Payload.AnswerOrder.length;
    let columnArray = new Array(columns);
    for (let i = 0; i < columns; i++) {
      columnArray[i] = {
        name: smiPayload.surveyElement.Payload.Answers[
          smiPayload.surveyElement.Payload.AnswerOrder[i]
        ]?.Display,
      };
    }

    return await createQuestion(
      $Fetch,
      {
        survey_id: smiPayload?.surveyId,
        ...(smiPayload?.sectionId && {section_id : smiPayload.sectionId} ),
        question: {
          text: removeHtmlTags(smiPayload.surveyElement.Payload.QuestionText),
          description: smiPayload.surveyElement.Payload.QuestionDescription,
          type: "Matrix",
          randomized:
            smiPayload.surveyElement.Payload.Randomization !== undefined,
          required:
            smiPayload.surveyElement.Payload.Validation.Settings
              ?.ForceResponse === "ON",
          properties: {
            data: {
              type: "TEXT_INPUT",
            },
          },
          row: rowArray,
          column: columnArray,
        },
      }
    );
  } else {
    return { message: "NOT SUPPORTED" };
  }
};

const groupRating = async (smiPayload, $Fetch) => {
  let rows = smiPayload.surveyElement.Payload.ChoiceOrder.length;
  let rowArray = new Array(rows);
  for (let i = 0; i < rows; i++) {
    rowArray[i] = {
      left_text:
        smiPayload.surveyElement.Payload.Choices[
          smiPayload.surveyElement.Payload.ChoiceOrder[i]
        ]?.Display,
    };
  }
  if (
    smiPayload.surveyElement.Payload.Selector === "HSLIDER" ||
    smiPayload.surveyElement.Payload.Selector === "HBAR"
  ) {
    let rate;
    if (smiPayload.surveyElement.Payload.Configuration.GridLines > 10)
      rate = 10;
    else if (smiPayload.surveyElement.Payload.Configuration.GridLines < 3)
      rate = 3;
    else rate = smiPayload.surveyElement.Payload.Configuration.GridLines;

    return await createQuestion(
      $Fetch,
      {
        survey_id: smiPayload?.surveyId,
        ...(smiPayload?.sectionId && {section_id : smiPayload.sectionId} ),
        question: {
          text: removeHtmlTags(smiPayload.surveyElement.Payload.QuestionText),
          description: smiPayload.surveyElement.Payload.QuestionDescription,
          type: "GroupRating",
          required:
            smiPayload.surveyElement.Payload.Validation.Settings
              ?.ForceResponse === "ON",
          properties: {
            data: {
              rating_scale: rate,
            },
          },
          row: rowArray,
        },
      }
    );
  } else if (smiPayload.surveyElement.Payload.Selector === "STAR") {
    return await createQuestion(
      $Fetch,
      {
        survey_id: smiPayload?.surveyId,
        ...(smiPayload?.sectionId && {section_id : smiPayload.sectionId} ),
        question: {
          text: removeHtmlTags(smiPayload.surveyElement.Payload.QuestionText),
          description: smiPayload.surveyElement.Payload.QuestionDescription,
          type: "GroupRating",
          required:
            smiPayload.surveyElement.Payload.Validation.Settings
              ?.ForceResponse === "ON",
          properties: {
            data: {
              rating_scale:
                smiPayload.surveyElement.Payload.Configuration.StarCount > 3
                  ? smiPayload.surveyElement.Payload.Configuration.StarCount
                  : 3,
            },
          },
          row: rowArray,
        },
      }
    );
  } else {
    return { message: "NOT SUPPORTED" };
  }
};

const groupRank = async (smiPayload, $Fetch) => {
  let groupRankLen = smiPayload.surveyElement.Payload.ChoiceOrder.length;
  let groupRankChoices = new Array(groupRankLen);
  for (let i = 0; i < groupRankLen; i++) {
    groupRankChoices[i] = {
      text: smiPayload.surveyElement.Payload.Choices[
        smiPayload.surveyElement.Payload.ChoiceOrder[i]
      ]?.Display,
    };
  }

  let groupRankRows = new Array(smiPayload.surveyElement.Payload.Groups.length);
  let i = 0;
  while (i < smiPayload.surveyElement.Payload.Groups.length) {
    groupRankRows[i] = {
      left_text: smiPayload.surveyElement.Payload.Groups[i],
    };
    i++;
  }
  return await createQuestion(
    $Fetch,
    {
      survey_id: smiPayload?.surveyId,
      ...(smiPayload?.sectionId && {section_id : smiPayload.sectionId} ),
      question: {
        text: removeHtmlTags(smiPayload.surveyElement.Payload.QuestionText),
        description: smiPayload.surveyElement.Payload.QuestionDescription,
        type: "GroupRank",
        required:
          smiPayload.surveyElement.Payload.Validation.Settings
            ?.ForceResponse === "ON",
        properties: {
          data: {
            is_ranking_enabled: true,
          },
        },
        choices: groupRankChoices,
        row: groupRankRows,
      },
    }
  );
};

const createQuestion = async ($Fetch, payload) => {
  const res =  await $Fetch.post(
    `${process.env.apiUrl}/v3/questions`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer <%=iparams.surveysparrow_api_key%>`,
      },
    }
  );
  
  return res;
};

const lineFormat = (type) => {
  if (type === "ML" || type === "ESTB") {
    return "MULTI_LINE";
  } else {
    return "SINGLE_LINE";
  }
};

const generateProperties = (smiPayload) => {

  if (smiPayload.surveyElement.Payload.Selector === "VRTL") {
    return {
      data: {
        type: "TEXT",
        minLimit:
          smiPayload.surveyElement.Payload?.Configuration?.CSSliderMin || 0,
        maxLimit:
          smiPayload.surveyElement.Payload?.Configuration?.CSSliderMax || 100,
        symbol_position:
          smiPayload.surveyElement.Payload?.ClarifyingSymbolType === "Before"
            ? "PREFIX"
            : "SUFFIX",
        symbol: smiPayload.surveyElement.Payload?.ClarifyingSymbol,
      },
    };
  }
  return {
    data: {
      type: "SLIDER",
      minLimit:
        smiPayload.surveyElement.Payload?.Configuration?.CSSliderMin || 0,
      maxLimit:
        smiPayload.surveyElement.Payload?.Configuration?.CSSliderMax || 100,
      segments:
        smiPayload.surveyElement.Payload?.Configuration?.GridLines < 10
          ? smiPayload.surveyElement.Payload?.Configuration?.GridLines
          : 10,
      decimals:
        smiPayload.surveyElement.Payload?.Configuration?.NumDecimals < 3
          ? smiPayload.surveyElement.Payload?.Configuration?.NumDecimals
          : 2,
    },
  };
};
const constantSum = async (smiPayload, $Fetch) => {
  let csLen = smiPayload.surveyElement.Payload.ChoiceOrder.length;
  let csArray = new Array(csLen);
  for (let i = 0; i < csLen; i++) {
    csArray[i] = {
      left_text:
        smiPayload.surveyElement.Payload.Choices[
          smiPayload.surveyElement.Payload.ChoiceOrder[i]
        ]?.Display,
    };
  }

  return await createQuestion(
    $Fetch,
    {
      survey_id: smiPayload?.surveyId,
      ...(smiPayload?.sectionId && {section_id : smiPayload.sectionId} ),
      question: {
        text: removeHtmlTags(smiPayload.surveyElement.Payload.QuestionText),
        description: smiPayload.surveyElement.Payload.QuestionDescription,
        type: "ConstantSum",
        required:
          smiPayload.surveyElement.Payload.Validation.Settings.ForceResponse ===
          "ON",
        properties: generateProperties(smiPayload),
        row: csArray,
      },
    }
  );
};