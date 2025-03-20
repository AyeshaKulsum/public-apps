import React, { useState, useRef, useEffect } from "react";
import Upload from "./Upload";
import Browse from "./Browse";
import { NavigationSVG } from "./icons";
import {
  QulatricsConstants,
  QuestionTypeConstants,
  surveyTypes,
  domain,
  header,
  classicSurveys,
  toastrConstants,
} from "../constants/qualtricsConstants";
import Loader from "../commons/components/Loader";
import { CloseIcon } from "@sparrowengg/twigs-react-icons";
import StatusTable from "./StatusTable";
import {
  Box,
  Text,
  Dialog,
  DialogContent,
  Flex,
  IconButton,
  toast,
  ToastDescription,
  ToastTitle,
} from "@sparrowengg/twigs-react";
import JumpToSurveyBuilder from "./JumpToBuilderPage";

const Main = (props) => {
  const [router, setRouter] = useState("upload");
  const [loader, setLoader] = useState(false);
  const [file, setFile] = useState(null);
  const [surveyName, setSurveyName] = useState("");
  const [surveyId, setSurveyId] = useState(null);
  const [fileName, setFileName] = useState("No File chosen");
  const [unsupportedQuestionsList, setUnsupportedQuestionsList] = useState([]);
  const [initialUnsupportedQuestionsList, setInitialUnsupportedQuestionsList] =
    useState([]);
  const [initialSupportedQuestionList, setInitialSupportedQuestionList] =
    useState([]);
  const [supportedQuestionList, setSupportedQuestionList] = useState([]);
  const [hasUploaded, setHasUploaded] = useState(false);
  const [npsQuestion, setNpsQuestion] = useState(false);
  const [surveyType, setSurveyType] = useState(surveyTypes.classicForm);
  const [folders, setFolders] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [chosenFolder, setChosenFolder] = useState({
    label: "My Surveys",
    value: false,
  });
  const [surveyFlow, setSurveyFlow] = useState({});
  const [sectionsOrder, setSectionsOrder] = useState([]);
  const [questionsOrder, setQuestionsOrder] = useState({});
  const [uploadLoader, setUploadLoader] = useState(false);
  const [unsupportedQuestionCount, setUnsupportedQuestionsCount] = useState(0);
  const [migrationFailedQuestionsCount, setMigrationFailedQuestionsCount] =
    useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [questionsMigrationStatus, setQuestionsMigrationStatus] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isloading, setIsloading] = useState(true);

  const fileRef = useRef();

  const setFoldersList = async () => {
    try {
      const response = JSON.parse(
        await props.client.request.get(`${domain}v3/survey_folders`, header)
      );
      let error;
      if (Object.keys(response).length === 0) {
        error = new Error();
        error.title = toastrConstants.toastrTitles.apiQuotaError;
        error.description = toastrConstants.toastrDescriptions.apiQuotaError;
        throw error;
      } else if (!response.body.data || response.body.message) {
        setIsAuthenticated(true);
        error = new Error();
        error.title = toastrConstants.toastrTitles.fetchFoldersError;
        error.description =
          response.body.message ||
          toastrConstants.toastrDescriptions.somethingWrong;
        throw error;
      }
      setIsAuthenticated(true);
      const foldersArray = response.body.data.map((folder) => ({
        value: folder.id,
        label: folder.name,
      }));
      foldersArray.unshift({
        label: "My Surveys",
        value: false,
      });
      setFolders(foldersArray);
    } catch (error) {
      !error.title && (error.title = toastrConstants.toastrTitles.unknownError);
      !error.description &&
        (error.description = toastrConstants.toastrDescriptions.pageRefresh);
      triggerToastr({ data: error });
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    setFoldersList();
  }, []);

  useEffect(() => {
    if (surveyId) {
      if (migrationFailedQuestionsCount === 0) {
        setIsRedirecting(true);
        window.top.location.href =
          document.referrer + `builder/edit/${surveyId}`;
      } else {
        setShowAddModal(true);
      }
    }
  }, [surveyId, questionsMigrationStatus]);

  const triggerToastr = ({ data, isSuccess = false }) => {
    toast({
      variant: isSuccess
        ? toastrConstants.resultTypes.default
        : toastrConstants.resultTypes.error,
      title: (
        <ToastTitle
          css={{
            fontWeight: "$7",
          }}
        >
          {data.title}
        </ToastTitle>
      ),
      description: (
        <ToastDescription
          css={{
            fontWeight: "$5",
          }}
        >
          {data.description}
        </ToastDescription>
      ),
    });
  };

  const setInitialStates = () => {
    setHasUploaded(false);
    setNpsQuestion(false);
    setRouter("upload");
    setFileName("No File chosen");
    setFile(null);
    setSurveyName("");
    setSurveyType(surveyTypes.classicForm);
    setChosenFolder({
      label: "My Surveys",
      value: false,
    });
    fileRef.current.value = "";
  };

  const trimFailedList = (isChat, isClassic = false) => {
    let newQuestionList = [];
    let newFailedList = [];
    if (isClassic) {
      setSupportedQuestionList(initialSupportedQuestionList);
      setUnsupportedQuestionsList(initialUnsupportedQuestionsList);
      setUnsupportedQuestionsCount(initialUnsupportedQuestionsList.length);
      return;
    }
    const chatRestrictedQuestions = [
      QuestionTypeConstants.Slider,
      QuestionTypeConstants.constantSum,
      QuestionTypeConstants.GroupRank,
      QuestionTypeConstants.Signature,
    ];
    const nonChatRestrictedQuestions = [
      QuestionTypeConstants.matrix,
      QuestionTypeConstants.GroupRating,
      QuestionTypeConstants.rankOrder,
      QuestionTypeConstants.SideBySide,
      QuestionTypeConstants.Slider,
      QuestionTypeConstants.constantSum,
      QuestionTypeConstants.GroupRank,
      QuestionTypeConstants.Signature,
    ];
    for (const question of initialSupportedQuestionList) {
      if (!isChat) {
        if (
          chatRestrictedQuestions.some(
            (type) => type === question?.payload?.Payload?.QuestionType
          )
        ) {
          newFailedList.push({
            id: question.id,
            qId: question?.payload?.PrimaryAttribute,
            question: question?.payload?.SecondaryAttribute,
            status: false,
            payload: question?.payload,
          });
          continue;
        } else {
          newQuestionList.push(question);
        }
      } else {
        if (
          (question?.payload?.Payload?.QuestionType ===
            QuestionTypeConstants.multiChoice &&
            question?.payload?.Payload?.Selector === "DL") ||
          nonChatRestrictedQuestions.some(
            (type) => type === question?.payload?.Payload?.QuestionType
          )
        ) {
          newFailedList.push({
            id: question.id,
            qId: question?.payload?.PrimaryAttribute,
            question: question?.payload?.SecondaryAttribute,
            status: false,
            payload: question?.payload,
          });
          continue;
        } else {
          newQuestionList.push(question);
        }
      }
    }
    setSupportedQuestionList(newQuestionList);
    setUnsupportedQuestionsList([
      ...initialUnsupportedQuestionsList,
      ...newFailedList,
    ]);
    setUnsupportedQuestionsCount(
      [...initialUnsupportedQuestionsList, ...newFailedList].length
    );
  };

  async function handleQuestionCreation() {
    setLoader(true);
    let i = 1;
    let migrateQuestions = [];
    let failedQuestionsCount = 0;
    let error;
    try {
      const response = await props.client.request.invoke(
        QulatricsConstants.smi,
        {
          data: {
            type: QulatricsConstants.surveyCreateSmi,
            surveyType,
            npsQuestion,
            folderId: chosenFolder?.id,
          },
          surveyName: surveyName,
        }
      );
      const smiResponse = await JSON.parse(response);
      const responseData = smiResponse.body;

      if (responseData?.data?.id || responseData?.data?.data?.id) {
        if (npsQuestion) {
          migrateQuestions.push({
            id: i,
            qId: npsQuestion.PrimaryAttribute,
            question: npsQuestion.SecondaryAttribute,
            status: true,
          });
          i += 1;
        }
        for (let index = 0; index < sectionsOrder.length; index++) {
          const sectionKey = sectionsOrder[index];
          const section = surveyFlow[sectionKey];
          let sectionId = null;
          if (section.ID && classicSurveys.includes(surveyType)) {
            try {
              const createdSection = JSON.parse(
                await props.client.request.invoke(QulatricsConstants.smi, {
                  data: {
                    type: QulatricsConstants.sectionCreateSmi,
                  },
                  surveyElement: {
                    name: `SECTION ${index}`,
                    description: section.Description,
                    options: section.Options || {},
                  },
                  surveyId:
                    responseData.data?.id || responseData.data?.data?.id,
                })
              );
              if (createdSection?.body?.data?.data[0]?.id) {
                sectionId = createdSection.body.data.data[0].id;
              }
            } catch (error) {
              console.log(
                `Section creation failed for section with ID : ${section.ID} and name : SECTION ${index}`
              );
            }
          }
          for (let questionKey of questionsOrder[sectionKey]) {
            try {
              if (
                supportedQuestionList.some(
                  (question) =>
                    question.payload.PrimaryAttribute === questionKey
                )
              ) {
                const payload =
                  section[QulatricsConstants.blockElements][questionKey];
                const res = JSON.parse(
                  await props.client.request.invoke(QulatricsConstants.smi, {
                    data: {
                      type: QulatricsConstants.questionCreateSmi,
                    },
                    surveyElement: payload,
                    surveyId:
                      responseData.data?.id || responseData.data?.data?.id,
                    sectionId: sectionId,
                  })
                );
                const migrationStatus =
                  res.body?.data?.id || res.body?.data?.data?.id;
                !migrationStatus &&
                  failedQuestionsCount++ &&
                  console.log(
                    "Question creation failed for question with ID : ",
                    payload.PrimaryAttribute
                  );
                migrateQuestions.push({
                  id: i,
                  qId: payload.PrimaryAttribute,
                  question: payload.SecondaryAttribute,
                  status: migrationStatus ? true : false,
                });
              }
            } catch (error) {
              failedQuestionsCount++;
              migrateQuestions.push({
                id: i,
                qId: payload.PrimaryAttribute,
                question: payload.SecondaryAttribute,
                status: false,
              });
              console.log(
                "Question creation failed for question with ID : ",
                payload.PrimaryAttribute
              );
            }
            i += 1;
          }
        }
        failedQuestionsCount === 0 &&
          triggerToastr({
            data: {
              title: toastrConstants.toastrTitles.migrationSuccess,
              description:
                toastrConstants.toastrDescriptions.migrationSuccessDesc,
            },
            isSuccess: true,
          });
        setMigrationFailedQuestionsCount(failedQuestionsCount);
        setSurveyId(responseData.data?.id || responseData.data?.data?.id);
      } else {
        error = new Error();
        if (responseData.status === 401) {
          error.title = toastrConstants.toastrTitles.badToken;
          error.description = toastrConstants.toastrDescriptions.badTokenDesc;
        } else if (responseData.status === 402) {
          error.title = toastrConstants.toastrTitles.surveyCreationFailed;
          error.description =
            toastrConstants.toastrDescriptions.surveysQuotaError;
          error.isReset = false;
        } else if (responseData.status === 429) {
          error.title = toastrConstants.toastrTitles.surveyCreationFailed;
          error.description = toastrConstants.toastrDescriptions.apiQuotaError;
          error.isReset = false;
        } else {
          error.title =
            responseData.title ||
            toastrConstants.toastrTitles.surveyCreationFailed;
          error.description =
            responseData.description ||
            toastrConstants.toastrDescriptions.somethingWrong;
        }
        throw error;
      }
    } catch (error) {
      throw error;
    } finally {
      setQuestionsMigrationStatus(migrateQuestions);
      setLoader(false);
    }
  }

  function handleSubmit(file) {
    try {
      const text = new FileReader();
      text.readAsText(file);
      let res = {};
      let idx = 1;

      text.onload = async () => {
        try {
          setUploadLoader(true);
          res = JSON.parse(text.result);
          setFile(null);

          let failedQuestionsList = [];
          let passedQuestionList = [];

          let actualQuestions = [];
          let blockList = [];
          let surveyFlowOrder = [];
          for (let element of res.SurveyElements) {
            if (element.Element === QulatricsConstants.blockList) {
              if (element.Payload.length) {
                blockList = element.Payload;
              } else {
                for (const key in element.Payload) {
                  blockList.push(element.Payload[key]);
                }
              }
            } else if (element.Element === QulatricsConstants.surveyQuestion) {
              actualQuestions.push(element);
            } else if (element.Element === QulatricsConstants.surveyFlow) {
              surveyFlowOrder.push(element.Payload);
            }
          }

          surveyFlowOrder.sort(function (a, b) {
            return a.FlowID - b.FlowID;
          });

          const questionAndSectionMapping = {};
          const trashQuestions = [];
          const tSurveyFlow = {
            individualQuestions: {
              BlockElements: {},
            },
          };
          const tSectionsOrder = [QulatricsConstants.individualQuestions];
          let tQuestionsOrder = {
            [QulatricsConstants.individualQuestions]: [],
          };

          for (let item of surveyFlowOrder) {
            const sortedFlow = (item.Flow = item.Flow.filter(
              (section) => section.ID
            ).sort((a, b) => a.FlowID - b.FlowID));
            sortedFlow.forEach((sectionElement) => {
              if (!tSurveyFlow[sectionElement.ID]) {
                tQuestionsOrder[sectionElement.ID] = [];
                tSectionsOrder.push(sectionElement.ID);
                tSurveyFlow[sectionElement.ID] = {};
              }
            });
          }

          for (let block of blockList) {
            const isTrashed =
              block.Description === QulatricsConstants.introduction ||
              block.Type !== QulatricsConstants.thrash
                ? false
                : true;
            let sectionedQuestions;
            if (block.BlockElements) {
              sectionedQuestions = block.BlockElements.filter(
                (question) => question.QuestionID
              );
            }
            if (!isTrashed && sectionedQuestions) {
              if (!tSurveyFlow[block.ID]) {
                tSectionsOrder.push(block.ID);
                tQuestionsOrder[block.ID] = [];
              }
              tSurveyFlow[block.ID] = {
                ...block,
                BlockElements: {},
              };
              const sortedQuestions = sectionedQuestions.sort(function (a, b) {
                return a.QuestionID - b.QuestionID;
              });
              for (let ques of sortedQuestions) {
                questionAndSectionMapping[ques.QuestionID] = block.ID;
                tQuestionsOrder[block.ID].push(ques.QuestionID);
              }
            } else {
              if (tSurveyFlow[block.ID]) {
                delete tSurveyFlow[block.ID];
              }
              if (sectionedQuestions) {
                for (let ques of sectionedQuestions) {
                  trashQuestions.push(ques.QuestionID);
                }
              }
            }
          }

          for (let ques of actualQuestions) {
            if (
              questionAndSectionMapping[ques.PrimaryAttribute] &&
              tSurveyFlow[questionAndSectionMapping[ques.PrimaryAttribute]]?.[
                QulatricsConstants.blockElements
              ]
            ) {
              tSurveyFlow[questionAndSectionMapping[ques.PrimaryAttribute]][
                QulatricsConstants.blockElements
              ][ques.PrimaryAttribute] = ques;
            } else if (
              ques.QuestionID &&
              !trashQuestions.includes(ques.QuestionID)
            ) {
              tSurveyFlow[QulatricsConstants.individualQuestions][
                QulatricsConstants.blockElements
              ][ques.PrimaryAttribute] = ques;
              tQuestionsOrder[QulatricsConstants.individualQuestions].push(
                ques.QuestionID
              );
            }
          }
          let npsQuestionCount = 0;
          for (let sectionKey of tSectionsOrder) {
            for (let questionKey of tQuestionsOrder[sectionKey]) {
              const payload =
                tSurveyFlow[sectionKey][QulatricsConstants.blockElements][
                  questionKey
                ];
              if (
                payload?.Payload?.QuestionType ===
                  QuestionTypeConstants.multiChoice &&
                payload?.Payload?.Selector === QuestionTypeConstants.nps &&
                npsQuestionCount === 0
              ) {
                tQuestionsOrder = {
                  ...tQuestionsOrder,
                  [sectionKey]: tQuestionsOrder[sectionKey].filter(
                    (questionId) => questionId !== payload.PrimaryAttribute
                  ),
                };

                npsQuestionCount += 1;
                setNpsQuestion(payload);
                continue;
              }
              checkForUnSupportedTypes(
                payload,
                failedQuestionsList,
                idx,
                passedQuestionList
              );
              idx += 1;
            }
          }
          setSectionsOrder(tSectionsOrder);
          setQuestionsOrder(tQuestionsOrder);
          setSurveyFlow(tSurveyFlow);
          setUnsupportedQuestionsList(failedQuestionsList);
          setInitialUnsupportedQuestionsList(failedQuestionsList);
          setInitialSupportedQuestionList(passedQuestionList);
          setSupportedQuestionList(passedQuestionList);
          setUnsupportedQuestionsCount(failedQuestionsList.length);
          setUploadLoader(false);
          setHasUploaded(true);
          setRouter("configure");
        } catch (error) {
          setInitialStates();
          triggerToastr({
            data: {
              title: toastrConstants.toastrTitles.uploadError,
              description: toastrConstants.toastrDescriptions.parsingErrorDesc,
            },
          });
        }
      };
    } catch (error) {
      setInitialStates();
      triggerToastr({
        data: {
          title: toastrConstants.toastrTitles.uploadError,
          description: toastrConstants.toastrDescriptions.parsingErrorDesc,
        },
      });
    }
  }

  const handleFileUpload = ({ target: { files } }) => {
    if (
      (files[0].name.length > 4 &&
        files[0].name.slice(files[0].name.length - 4) !== ".qsf") ||
      files[0].name.length <= 4
    ) {
      triggerToastr({
        data: {
          title: toastrConstants.toastrTitles.uploadError,
          description: toastrConstants.toastrDescriptions.uploadErrorDesc,
        },
      });
      return;
    }
    files[0] && setFileName(files[0].name);
    setFile(files[0]);
    handleSubmit(files[0]);
  };

  const proceedHandler = async () => {
    let reset = true;
    try {
      await handleQuestionCreation();
    } catch (error) {
      if (error.isReset === false) {
        reset = false;
      }
      triggerToastr({
        data: {
          title: error.title || toastrConstants.toastrTitles.migrationFailed,
          description:
            error.description ||
            toastrConstants.toastrDescriptions.migrationErrorDesc,
        },
      });
    } finally {
      reset && setInitialStates();
    }
  };

  return (
    <>
    {isloading ? (
      <Flex
        css={{ height: "100vh" }}
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Loader />
      </Flex>
    ) : (
    <Box>
      {isRedirecting ? (
        <Flex
          css={{ height: "calc(80vh - 72px)" }}
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Loader label="Please wait. Redirecting to Builder Page..." />
        </Flex>
      ) : (
        <Flex
          css={{
            width: "100%",
            height: "76px",
            background: "$white900",
            border: "$borderWidths$xs solid $neutral200",
            position: "sticky",
            top: "0",
            padding: "0 20px",
            zIndex: 5,
          }}
          alignItems="center"
          justifyContent="center"
        >
          <Flex
            alignItems="center"
            gap="$8"
            css={{ position: "relative", flex: 1, justifyContent: "center" }}
          >
            <Text
              size="md"
              weight={router === "upload" ? "bold" : "regular"}
              css={{
                color: router === "upload" ? "$neutral900" : "$neutral500",
                cursor: "pointer",
              }}
              onClick={() => {
                if (!loader) {
                  setInitialStates();
                }
              }}
            >
              Upload
            </Text>
            <NavigationSVG
              size="20"
              color={router === "configure" ? "#2B2B2B" : "#C6C6C6"}
            />
            <Text
              size="md"
              weight={router === "configure" ? "bold" : "regular"}
              css={{
                color: router === "configure" ? "$neutral900" : "$neutral300",
                cursor: "pointer",
              }}
              onClick={() => {
                if (!file) {
                  props.client.interface.alertMessage(
                    "Upload file to continue",
                    {
                      type: "failure",
                    }
                  );
                } else if (!loader) {
                  setRouter("configure");
                }
              }}
            >
              Configure
            </Text>
          </Flex>
        </Flex>
      )}
      {showAddModal && (
        <Dialog open>
          <DialogContent
            css={{
              padding: 0,
              minHeight: "80vh",
              minWidth: "80vw",
              overflowY: "auto",
            }}
          >
            {!loader && (
              <Flex
                css={{
                  border: "$borderWidths$xs solid $neutral200",
                  padding: "0 $12",
                  height: "$18",
                }}
                alignItems="center"
                justifyContent="space-between"
              >
                <Text
                  as="span"
                  weight="medium"
                  css={{ color: "$neutral900", fontSize: "23px" }}
                >
                  Migration Status
                </Text>
                <IconButton
                  icon={<CloseIcon />}
                  size="md"
                  color="default"
                  onClick={() => {
                    setFile(null);
                    setFileName("No File chosen");
                    setSurveyName("");
                    setSurveyType(surveyTypes.classicForm);
                    setChosenFolder({
                      label: "My Surveys",
                      value: false,
                    });
                    setSurveyId(null);
                    setNpsQuestion(false);
                    setShowAddModal(false);
                    setRouter("upload");
                  }}
                />
              </Flex>
            )}
            {loader ? (
              <Flex
                css={{ height: "calc(80vh - 72px)" }}
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                <Loader label="Do not Reload or Go Back.." />
              </Flex>
            ) : null}
            <Flex
              css={{
                height: "calc(80vh - 72px)",
                padding: "$12",
                position: "relative",
              }}
              flexDirection="column"
            >
              <Flex
                flexDirection="column"
                gap="$3"
                css={{
                  paddingBottom: "$6",
                  paddingLeft: "$6",
                }}
              >
                <Text
                  weight="medium"
                  css={{
                    color: "$neutral900",
                    fontSize: "14px",
                    paddingBottom: "$4",
                  }}
                >
                  The below list shows the questions from the supported types
                  that failed to be created in the survey due to some issue.
                </Text>
                <Text
                  weight="medium"
                  css={{ color: "$neutral900", fontSize: "14px" }}
                >
                  {`Total Unsupported Questions: ${unsupportedQuestionCount}`}
                </Text>
                <Text
                  weight="medium"
                  css={{ color: "$neutral900", fontSize: "14px" }}
                >
                  {`Total Failed Questions: ${
                    migrationFailedQuestionsCount + unsupportedQuestionCount
                  }`}
                </Text>
              </Flex>
              {migrationFailedQuestionsCount > 0 && (
                <StatusTable Questiondata={questionsMigrationStatus} />
              )}
              <Flex
                justifyContent="center"
                css={{
                  paddingTop: "$8",
                  position: "absolute",
                  bottom: "$6",
                  width: "97%",
                  background: "white",
                }}
              >
                {migrationFailedQuestionsCount > 0 && !loader ? (
                  <JumpToSurveyBuilder
                    SurveyId={surveyId}
                    isAllQuestionsFailed={
                      supportedQuestionList.length ===
                      migrationFailedQuestionsCount
                    }
                  />
                ) : null}
              </Flex>
            </Flex>
          </DialogContent>
        </Dialog>
      )}

      {!isRedirecting && (
        <Box css={{ width: "100%" }}>
          {router === "upload" && (
            <Upload
              fileName={fileName}
              fileRef={fileRef}
              handleFileUpload={handleFileUpload}
              isAuthenticated={isAuthenticated}
              triggerToastr={triggerToastr}
            />
          )}
          {router === "configure" && !uploadLoader && (
            <Browse
              folders={folders}
              setSurveyName={setSurveyName}
              setSurveyType={setSurveyType}
              setChosenFolder={setChosenFolder}
              surveyName={surveyName}
              unsupportedQuestionsList={unsupportedQuestionsList}
              fileName={fileName}
              proceedHandler={proceedHandler}
              loader={loader}
              trimFailedList={trimFailedList}
              hasUploaded={hasUploaded}
              chosenFolder={chosenFolder}
              surveyType={surveyType}
              sectionsCount={sectionsOrder.length}
              npsQuestion={!!npsQuestion}
            />
          )}
        </Box>
      )}
    </Box>
  )}</>
  );
};

export default Main;

function checkForUnSupportedTypes(
  payload,
  failedQuestionsList,
  idx,
  passedQuestionList
) {
  if (
    (payload?.Payload?.QuestionType === QuestionTypeConstants.matrix &&
      payload?.Payload?.Selector === QuestionTypeConstants.rankOrder) ||
    (payload?.Payload?.QuestionType === QuestionTypeConstants.matrix &&
      payload?.Payload?.Selector === QuestionTypeConstants.constantSum) ||
    (payload?.Payload?.QuestionType === QuestionTypeConstants.matrix &&
      payload?.Payload?.Selector === QuestionTypeConstants.maxDiff) ||
    (payload?.Payload?.QuestionType === QuestionTypeConstants.textEntry &&
      payload?.Payload?.Selector === QuestionTypeConstants.form) ||
    payload?.Payload?.QuestionType === QuestionTypeConstants.timing ||
    payload?.Payload?.QuestionType === QuestionTypeConstants.meta ||
    payload?.Payload?.QuestionType === QuestionTypeConstants.highLight ||
    payload?.Payload?.QuestionType === QuestionTypeConstants.drillDown
  ) {
    failedQuestionsList.push({
      id: idx,
      qId: payload?.PrimaryAttribute,
      question: payload?.SecondaryAttribute,
      status: false,
      payload,
    });
  } else {
    passedQuestionList.push({
      id: idx,
      qId: payload?.PrimaryAttribute,
      payload,
    });
  }
}
