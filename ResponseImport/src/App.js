import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Text,
  Tabs,
  Flex,
  TabsList,
  TabsTrigger,
  TabsContent,
  Button
} from "@sparrowengg/twigs-react";
import {
  ArrowLeftIcon
} from "@sparrowengg/twigs-react-icons";
import {
  SelectSurveyTab,
  UploadTab,
  MapFieldsTab,
  MapFieldsEmptyTab
} from "./components/tabs";
import { commonConstants } from "./constants/commonConstants";
import autoMapping from "./helpers/autoMapping";
import {
  getAllSurveys,
  fetchQuestions,
  fetchVariables,
  initilaizeClient,
  getSurvey,
  fetchResponseProperties,
  getContactProperties
} from "./helpers/fetch";
import parseCsv from "./helpers/parseCsv";
import validateQuestion from "./helpers/validateQuestion";
import formatQuestion from "./helpers/formatQuestion";
import { surveyTypes } from "./constants/surveyTypes";
import { accountsWithHigherThreshold } from "./constants/commonConstants";

function App({ setPage, setAccountData, location, isHistoryPresent }) {
  const [file, setFile] = useState();
  const [headers, setHeaders] = useState([]);
  const [sample, setSample] = useState({});
  const [survey, setSurvey] = useState();
  const [nextButton, setNextButton] = useState(false);

  const uploadRef = useRef(null);
  const mapFieldsRef = useRef(null);

  //select survey tab
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questionLoading, setQuestionLoading] = useState(true);
  const [variableLoading, setVariableLoading] = useState(true);
  const [mapFieldsLoading, setMapFieldsLoading] = useState(true);

  //upload tab
  const [uploadedFile, setUploadedFile] = useState();
  const fileTypes = ["CSV"];

  //map tab
  const [responseProperty, setResponseProperty] = useState([]);
  const [contactProperty, setContactProperty] = useState([]);

  const [responsePropertyPayload, setResponsePropertyPayload] = useState({});
  const [questions, setQuestions] = useState([]);
  const [variable, setVariable] = useState([]);
  const [variablePayload, setVariablePayload] = useState({});
  const [contactPropertyPayload, setContactPropertyPayload] = useState({});
  const firstList = [
    { value: [], label: commonConstants.question },
    { value: [], label: commonConstants.variable },
    { value: responseProperty, label: commonConstants.responseProperty.name },
    { value: contactProperty, label: commonConstants.contactProperty.name }
  ];
  const [secondList, setSecondList] = useState({});
  const [questionList, setQuestionList] = useState([]);
  const [variableList, setVariableList] = useState([]);
  const [answerPayload, setAnswerPayload] = useState({});
  const [resetChoiceList, setResetChoiceList] = useState({});
  const [errorList, setErrorList] = useState({});
  const [selectedVariable, setSelectedVariable] = useState([]);
  const [selectedResponseProperty, setSelectedResponseProperty] = useState([]);
  const [selectedContactProperty, setSelectedContactProperty] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [responseProperties, setResponseProperties] = useState([]);

  useEffect(() => {
    const init = async () => {
      await initilaizeClient();
      if (location) {
        await getSurvey(setSurvey, location);
      } else {
        await getAllSurveys(setSurveys);
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleChange = (file) => {
    setUploadedFile(file);
  };

  useEffect(() => {
    if (location && survey) {
      setLoading(false);
    }
  }, [survey, location]);

  useEffect(() => {
    const init = async () => {
      if (uploadedFile) {
        let threshold = 5000;
        if(accountsWithHigherThreshold.includes(survey?.settings_account_id)){
          threshold = 10000
        }
        if(!await parseCsv(uploadedFile, setSample, setHeaders, threshold)) return
        setFile(uploadedFile);
        setMapFieldsLoading(true);
        setTimeout(() => {
          mapFieldsRef.current.focus();
          mapFieldsRef.current.click();
        }, 10);
        setContactProperty(await getContactProperties());
        await fetchQuestions(survey, setQuestions);
        await fetchVariables(survey, setVariable);
        await fetchResponseProperties(setResponseProperties);
      }
    };
    init();
  }, [uploadedFile]);

  useEffect(() => {
    if (
      file &&
      headers.length &&
      sample &&
      !questionLoading &&
      !variableLoading
    ) {
      autoMapping(
        survey,
        headers,
        sample,
        questionList,
        variableList,
        responseProperty,
        contactProperty,
        setSecondList,
        setSelectedContactProperty,
        setSelectedResponseProperty,
        setSelectedQuestion,
        setSelectedVariable,
        setAnswerPayload,
        setVariablePayload,
        setResponsePropertyPayload,
        setContactPropertyPayload
      );
      setMapFieldsLoading(false);
    }
  }, [file, headers, sample, questionLoading, variableLoading]);

  useEffect(() => {
    const init = async () => {
      setSample({});
      setHeaders([]);
      setUploadedFile();
      setFile();
      setQuestionLoading(true);
      setVariableLoading(true);
      setMapFieldsLoading(true);
    };
    if (survey) {
      init();
    }
  }, [survey]);

  useEffect(() => {
    const result = [];
    for (let i = 0; i < questions.length; i++) {
      const formattedQuestion = formatQuestion(questions[i], questions);
      if (Array.isArray(formattedQuestion)) {
        for (let j = 0; j < formattedQuestion.length; j++) {
          result.push(formattedQuestion[j]);
        }
      } else result.push(formattedQuestion);
    }
    setQuestionList(
      result
        .filter((ques) => ques)
        .map((ques) => {
          return { label: ques.question_text, value: ques };
        })
    );
    setQuestionLoading(false);
  }, [questions]);

  useEffect(() => {
    setVariableList(
      variable.map((variable) => {
        return {
          label: variable.name,
          value: {
            id: variable.id,
            description: variable.description,
            label: variable.label,
            name: variable.name
          }
        };
      })
    );
    setVariableLoading(false);
  }, [variable]);

  useEffect(() => {
    setResponseProperty(
      Object.entries(responseProperties).map(([key, value]) => {
        return { label: value, value: key };
      })
    );
  }, [responseProperties]);

  const handleQuestionSelect = (e, header) => {
    delete errorList[header];
    if (!e) {
      handleClearSelection(header);
      return;
    }
    switch (secondList[header]) {
      case commonConstants.question:
        if (answerPayload[header]) {
          if (!validateQuestion(e.value, header, sample)) {
            setErrorList({ ...errorList, [header]: true });
            setSelectedQuestion(
              selectedQuestion.filter(
                (ques) => !(ques.label == answerPayload[header].label)
              )
            );
            delete answerPayload[header];
            return;
          }
          setSelectedQuestion([
            ...selectedQuestion.filter(
              (ques) => !(ques.label == answerPayload[header].label)
            ),
            e
          ]);
        } else {
          if (!validateQuestion(e.value, header, sample)) {
            setErrorList({ ...errorList, [header]: true });
            return;
          }
          setSelectedQuestion([...selectedQuestion, e]);
        }
        setAnswerPayload({ ...answerPayload, [header]: e });
        break;

      case commonConstants.responseProperty.name:
        if (responsePropertyPayload[header]) {
          setSelectedResponseProperty([
            ...selectedResponseProperty.filter(
              (property) =>
                !(property.label == responsePropertyPayload[header].label)
            ),
            e
          ]);
        } else {
          setSelectedResponseProperty([...selectedResponseProperty, e]);
        }
        setResponsePropertyPayload({ ...responsePropertyPayload, [header]: e });
        break;

      case commonConstants.contactProperty.name:
        if (contactPropertyPayload[header]) {
          setSelectedContactProperty([
            ...selectedContactProperty.filter(
              (property) =>
                !(property.label == contactPropertyPayload[header].label)
            ),
            e
          ]);
        } else {
          setSelectedContactProperty([...selectedContactProperty, e]);
        }
        setContactPropertyPayload({ ...contactPropertyPayload, [header]: e });
        break;

      default:
        if (variablePayload[header]) {
          setSelectedVariable([
            ...selectedVariable.filter(
              (variable) => !(variable.label == variablePayload[header].label)
            ),
            e
          ]);
        } else {
          setSelectedVariable([...selectedVariable, e]);
        }
        setVariablePayload({ ...variablePayload, [header]: e });
    }
    setResetChoiceList({ ...resetChoiceList, [header]: false });
  };

  const handleClearSelection = (header) => {
    if (answerPayload[header]) {
      setSelectedQuestion(
        selectedQuestion.filter(
          (ques) => !(ques.label == answerPayload[header].label)
        )
      );
      delete answerPayload[header];
    } else if (responsePropertyPayload[header]) {
      setSelectedResponseProperty(
        selectedResponseProperty.filter(
          (property) =>
            !(property.label == responsePropertyPayload[header].label)
        )
      );
      delete responsePropertyPayload[header];
    } else if (variablePayload[header]) {
      setSelectedVariable(
        selectedVariable.filter(
          (variable) => !(variable.label == variablePayload[header].label)
        )
      );
      delete variablePayload[header];
    } else if (contactPropertyPayload[header]) {
      setSelectedContactProperty(
        selectedContactProperty.filter(
          (property) =>
            !(property.label == contactPropertyPayload[header].label)
        )
      );
      delete contactPropertyPayload[header];
    }
  };

  const handleSubmit = async () => {
    if (
      Object.keys(answerPayload).length === 0 &&
      Object.keys(responsePropertyPayload).length === 0 &&
      Object.keys(contactPropertyPayload).length === 0 &&
      Object.keys(variablePayload).length === 0
    ) {
      window.client.interface.alertMessage("Please map fields", {
        type: "failure"
      });
      return;
    } 
    else if (!(survey.survey_type === surveyTypes.ClassicForm.name || survey.survey_type === surveyTypes.Conversational.name)) {
      if (!(Object.keys(contactPropertyPayload).length > 0 && Object.values(contactPropertyPayload).some(property => property.value === "email"))) {
        window.client.interface.alertMessage("Please map contact fields properly", { type: "failure" });
        return;
      }
    }
    const questionPayload = {};
    const variablesPayload = {};
    const responsePropertiesPayload = {};
    const contactPropertiesPayload = {};
    for (const property in answerPayload) {
      questionPayload[property] = answerPayload[property].value;
    }
    for (const property in variablePayload) {
      variablesPayload[property] = variablePayload[property].value;
    }
    for (const property in responsePropertyPayload) {
      responsePropertiesPayload[property] =
        responsePropertyPayload[property].value;
    }
    for (const property in contactPropertyPayload) {
      contactPropertiesPayload[property] =
        contactPropertyPayload[property].value;
    }
    const acceptedFields = Object.keys(questionPayload);
    const surveyMapping = {};
    for (const property in questionPayload) {
      surveyMapping[property] = {
        ss_qtype: "question",
        ss_qid: questionPayload[property].question_id,
        ss_parentQuestionId: questionPayload[property].parent_question_id,
        choice_id: null,
        questionDataType: questionPayload[property].question_data_type || null,
        questionType: questionPayload[property].question_type,
        otherChoiceId: questionPayload[property].choices.length ? questionPayload[property].choices[0].find((choice) => choice.other)?.id : null,
        answerMapping: questionPayload[property].choices.length
          ? questionPayload[property].choices[0].reduce((acc, curr) => {
              acc[curr.choice_text] = curr.id;
              return acc;
            }, {})
          : null
      };
    }
    const surveyId = survey.id;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    try {
      setDisabled(true);
      await window.client.request.s3Upload("csvMappingHandler", {
        file,
        surveyId,
        surveyType: survey.survey_type,
        timeZone,
        acceptedFields,
        surveyMapping,
        variablesPayload,
        responsePropertiesPayload,
        contactPropertiesPayload
      });
      try {
        const data = JSON.parse(await window.client.db.get("data"));
        data["uploading"] = true;
        data["uploadingTime"] = Date.now().toString();
        data["surveyId"] = surveyId;
        data["surveyName"] = survey.name;
        await window.client.db.set("data", data);
        setAccountData(data);
      } catch (error) {
        const data = {
          uploading: true,
          uploadingTime: Date.now().toString(),
          surveyId: surveyId,
          surveyName: survey.name
        };
        await window.client.db.set("data", data);
        setAccountData(data);
      }
      setPage(commonConstants.status);
      setDisabled(true);
    } catch (error) {
      console.log(error);
      setDisabled(true);
      window.client.interface.alertMessage("Some internal error occured", {
        type: "failure"
      });
    }
  };

  const handleOptionSelect = (e, header) => {
    let option;
    delete errorList[header];
    switch (e.label) {
      case commonConstants.question:
        option = commonConstants.question;
        break;
      case commonConstants.responseProperty.name:
        option = commonConstants.responseProperty.name;
        break;
      case commonConstants.contactProperty.name:
        option = commonConstants.contactProperty.name;
        break;
      default:
        option = commonConstants.variable;
    }
    handleClearSelection(header);
    setSecondList({ ...secondList, [header]: option });
    setResetChoiceList({ ...resetChoiceList, [header]: true });
  };

  const handleBackButton = async () => {
    if (isHistoryPresent) {
      setPage(commonConstants.status);
    } else {
      window.parent.location.href = `${document.referrer}survey/${location}/results/responses`;
    }
  };

  return (
    <Box
      css={{
        height: "100vh",
        width: "100vw"
      }}
    >
      <Flex
        alignItems="center"
        css={{
          paddingBlock: "$10",
        }}
      >
        <Flex
          alignItems="center"
          gap="$5"
          css={{
            cursor: "pointer",
            marginLeft:"$8",
            left: "$10"
          }}
          onClick={handleBackButton}
        >
          {(location || isHistoryPresent) && (
            <>
              <ArrowLeftIcon size={20} />
              <Text
                css={{
                  color: "$neutral300"
                }}
              >
              </Text>
            </>
          )}
        </Flex>
        <Text
          size={"lg"}
          weight="medium"
          css={{
            color: "$neutral300",
            margin: "$2 $6",
            textAlign: "left"
          }}
        >
          {commonConstants.importResponseFromFile}
        </Text>
      </Flex>
      {nextButton ? (
        <Box
          css={{
            position: "absolute",
            right: "15px",
            top: "15px"
          }}
        >
          <Button
            color="primary"
            size="lg"
            disabled={disabled}
            onClick={handleSubmit}
          >
            {commonConstants.finishImport}
          </Button>
        </Box>
      ) : null}
      
      <Flex alignItems="center" justifyContent="center">
        <Tabs defaultValue={location ? "upload" : "selectSurvey"}>
          <Box
            css={{
              width: "100vw",
              boxShadow: "$sm"
            }}
          >
            <TabsList
              css={{
                height: "$15",
                borderTop: "1px solid $neutral200",
                borderBottom: "1px solid $neutral200",
                justifyContent: "center"
              }}
            >
              {!location && (
                <TabsTrigger
                  value="selectSurvey"
                  onClick={() => {
                    setNextButton(false);
                  }}
                >
                  {commonConstants.selectSurvey}
                </TabsTrigger>
              )}
              <TabsTrigger
                ref={uploadRef}
                disabled={!survey}
                onClick={() => {
                  setNextButton(false);
                }}
                value="upload"
              >
                {commonConstants.upload}
              </TabsTrigger>
              <TabsTrigger
                disabled={!file}
                ref={mapFieldsRef}
                onClick={() => {
                  setNextButton(true);
                }}
                value="mapFields"
              >
                {commonConstants.mapFields}
              </TabsTrigger>
            </TabsList>
          </Box>
          {!location && (
            <TabsContent value="selectSurvey">
              <Box
                css={{
                  marginTop: "$25"
                }}
              >
                <SelectSurveyTab
                  loading={loading}
                  uploadRef={uploadRef}
                  surveys={surveys}
                  setSurvey={setSurvey}
                  survey={survey}
                />
              </Box>
            </TabsContent>
          )}
          <TabsContent value="upload">
            <Box
              css={{
                marginTop: "$25"
              }}
            >
              <UploadTab
                loading={loading}
                handleChange={handleChange}
                fileTypes={fileTypes}
                uploadedFile={uploadedFile}
              />
            </Box>
          </TabsContent>
          <TabsContent value="mapFields">
            {file ? (
              <Box
                css={{
                  marginTop: "$25"
                }}
              >
                <MapFieldsTab
                  mapFieldsLoading={mapFieldsLoading}
                  headers={headers}
                  sample={sample}
                  firstList={firstList}
                  secondList={secondList}
                  errorList={errorList}
                  questionList={questionList}
                  variableList={variableList}
                  responseProperty={responseProperty}
                  contactProperty={contactProperty}
                  answerPayload={answerPayload}
                  variablePayload={variablePayload}
                  responsePropertyPayload={responsePropertyPayload}
                  contactPropertyPayload={contactPropertyPayload}
                  selectedQuestion={selectedQuestion}
                  selectedVariable={selectedVariable}
                  selectedResponseProperty={selectedResponseProperty}
                  selectedContactProperty={selectedContactProperty}
                  handleOptionSelect={handleOptionSelect}
                  handleQuestionSelect={handleQuestionSelect}
                />
              </Box>
            ) : (
              <Box
                css={{
                  height: "60vh",
                  width: "100vw"
                }}
              >
                <MapFieldsEmptyTab />
              </Box>
            )}
          </TabsContent>
        </Tabs>
      </Flex>
    </Box>
  );
}

export default App;
