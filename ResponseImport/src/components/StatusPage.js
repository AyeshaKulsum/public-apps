import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  Table,
  Tbody,
  Thead,
  Th,
  Tr,
  Td
} from "@sparrowengg/twigs-react";
import {
  ArrowLeftIcon,
  TickCircleIcon,
  DownloadIcon,
  AlertIcon
} from "@sparrowengg/twigs-react-icons";
import { saveStatusToDb, initilaizeClient } from "../helpers/fetch";
import { commonConstants } from "../constants/commonConstants";
import Loader from "./Loader";
import { Spinner } from "./Spinner";
import { getAllSurveys } from "../helpers/fetch";

const StatusPage = ({
  setPage,
  accountData,
  setAccountData,
  location,
  isHistoryPresent,
  setIsHistoryPresent
}) => {
  const [newImportEnabled, setNewImportEnabled] = useState(false);
  const [importStatus, setImportStatus] = useState({});
  const [intervalId, setIntervalId] = useState();
  const [displayHistory, setDisplayHistory] = useState();
  const [loading, setLoading] = useState(true);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [surveys, setSurveys] = useState();
  const [headerConstants, setHeaderConstants] = useState([
    commonConstants.status,
    commonConstants.entriesCreated,
    commonConstants.errors,
    commonConstants.logs,
    commonConstants.lastImport
  ]);
  const headerCss = {
    borderColor: "transparent",
    color:"$neutral300",
    fontWeight: "bold",
    fontSize: "$xs"
  };

  useEffect(() => {
    const init = async () => {
      await initilaizeClient();
      await getAllSurveys(setSurveys);
      if (!location) {
        const constants = [...headerConstants];
        constants.splice(4, 0, commonConstants.survey);
        setHeaderConstants(constants);
      }
      if (!accountData["uploading"]) {
        setNewImportEnabled(true);
        setImportStatus(null);
        updateHistoryUi();
      } else {
        let status;
        try {
          status = JSON.parse(await window.client.request.getStatus());
        } catch (error) {
          console.log(error);
          setImportStatus(null);
          setNewImportEnabled(true);
          updateHistoryUi();
          setLoading(false);
          return;
        }
        if (status?.status === commonConstants.completed) {
          await saveStatusToDb(
            setAccountData,
            setDataUpdated,
            status,
            accountData,
            false
          );
          setNewImportEnabled(true);
          setIsHistoryPresent(true);
          setImportStatus(null);
        } else {
          setImportStatus({ ...status, importedBy: "User", date: Date.now() });
          const id = setInterval(function () {
            pingStatus();
          }, 10000);
          setIntervalId(id);
          updateHistoryUi();
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const pingStatus = async () => {
    try {
      const status = JSON.parse(await window.client.request.getStatus());
      if (status?.status === commonConstants.completed) {
        await saveStatusToDb(
          setAccountData,
          setDataUpdated,
          status,
          accountData,
          false
        );
        setNewImportEnabled(true);
        setIsHistoryPresent(true);
        setImportStatus(null);
      } else if (
        Date.now() - accountData["uploadingTime"] > 1200000 ||
        status?.status === commonConstants.failed
      ) {
        await saveStatusToDb(
          setAccountData,
          setDataUpdated,
          status,
          accountData,
          true
        );
        setNewImportEnabled(true);
        setIsHistoryPresent(true);
        setImportStatus(null);
      } else
        setImportStatus({ ...status, importedBy: "User", date: Date.now() });
    } catch (error) {
      window.client.interface.alertMessage(
        "Some error occured while fetching import status",
        { type: "failure" }
      );
      setNewImportEnabled(true);
      setImportStatus(null);
    }
  };

  useEffect(() => {
    if (dataUpdated) {
      updateHistoryUi();
      setDataUpdated(false);
    }
  }, [dataUpdated]);

  const updateHistoryUi = () => {
    const result = [];
    if (location) {
      if (accountData[location]) {
        Object.keys(accountData[location]).forEach((key) => {
          result.push(accountData[location][key]);
        });
        if (result.length === 0) {
          setIsHistoryPresent(false);
        }
      } else {
        setIsHistoryPresent(false);
      }
    } else {
      Object.keys(accountData).forEach((surveyKey) => {
        if (
          !(
            surveyKey == commonConstants.uploading ||
            surveyKey == commonConstants.uploadingTime ||
            surveyKey == commonConstants.surveyId ||
            surveyKey == commonConstants.surveyName
          )
        ) {
          Object.keys(accountData[surveyKey]).forEach((key) => {
            result.push(accountData[surveyKey][key]);
          });
        }
      });
      if (result.length === 0) {
        setIsHistoryPresent(false);
      }
    }
    setDisplayHistory(
      result.sort((first, second) => {
        return second.date - first.date;
      })
    );
  };

  const getSurveyName = (surveyId) => {
    for (const element of surveys) {
      if (element["value"]["id"] == surveyId) {
        return element["value"]["name"];
      }
    }
    return "-";
  };

  useEffect(() => {
    if (importStatus === null) {
      clearInterval(intervalId);
      if (!isHistoryPresent) {
        setPage(commonConstants.import);
      }
    }
  }, [importStatus, isHistoryPresent]);

  const goBack = async () => {
    if (location) {
      window.parent.location.href = `${document.referrer}survey/${location}/results/responses`;
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <Box
      css={{
        height: "100vh",
        width: "100vw"
      }}
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        css={{
          padding: "$10",
          borderBottom: "1px solid $neutral200"
        }}
      >
        <Flex
          onClick={goBack}
          alignItems="center"
          gap="$5"
          css={{
            cursor: "pointer"
          }}
        >
          {location && (
            <>
              <ArrowLeftIcon size={"20px"} />
              <Text
                css={{
                  color: "$neutral300"
                }}
              >
                Back to Responses
              </Text>
            </>
          )}
        </Flex>
        <Text
          size={"lg"}
          css={{
            color: "$neutral300"
          }}
        >
          Imports
        </Text>
        <Button
          disabled={!newImportEnabled}
          onClick={() => setPage(commonConstants.import)}
          color="primary"
          
        >
          Start New Import
        </Button>
      </Flex>
      <Box>
        <Table
          css={{
            border: "transparent",
            width: "100vw",
            marginTop: "$15",
            padding: "$5",
            borderSpacing: 0
          }}
        >
          <Thead
            css={{
              border: "transparent",
              backgroundColor: "transparent"
            }}
          >
            {headerConstants.map((headerConstant) => {
              return (
                <Th key={headerConstant} css={headerCss}>
                  {headerConstant}
                </Th>
              );
            })}
          </Thead>
          <Tbody>
            {importStatus && importStatus["status"] ? (
              <Tr
                css={{
                  borderColor: "transparent",
                  borderBottomColor: "black",
                  "& td": {
                    borderColor: "transparent",
                    borderBottom: "1px solid #e0dfdc",
                    textAlign: "center"
                  }
                }}
              >
                <Td>
                  <Flex gap="$5" justifyContent="center" alignItems="center">
                    <Spinner/>
                  </Flex>
                </Td>
                <Td>
                  <Text size="sm">
                    {importStatus.successCount ? importStatus.successCount : 0}
                  </Text>
                </Td>
                <Td>
                  <Text size="sm">
                    {importStatus.errorCount ? importStatus.errorCount : 0}
                  </Text>
                </Td>
                <Td>
                  <Text size="sm">-</Text>
                </Td>
                {!location && (
                  <Td>
                    <Text size="sm">
                      {importStatus.surveyName ? importStatus.surveyName : "-"}
                    </Text>
                  </Td>
                )}
                <Td>
                  <Text size="sm">
                    {new Date(
                      importStatus.date ? importStatus.date : Date.now()
                    ).toDateString()}
                  </Text>
                </Td>
              </Tr>
            ) : null}
            {displayHistory
              ? displayHistory.map((key) => {
                  return (
                    <Tr
                      key={key}
                      css={{
                        borderColor: "transparent",
                        borderBottomColor: "black",
                        "& td": {
                          borderColor: "transparent",
                          borderBottom: "1px solid #e0dfdc",
                          textAlign: "center"
                        }
                      }}
                    >
                      <Td>
                        <Flex
                          justifyContent="center"
                          alignItems="center"
                          gap="$5"
                        >
                          {key.failed ? (
                            <AlertIcon color="red" size={20} />
                          ) : (
                            <TickCircleIcon color="#56B0BB" size={20} />
                          )}
                        </Flex>
                      </Td>
                      <Td>
                        <Text size="sm">
                          {key.successCount ? key.successCount : 0}
                        </Text>
                      </Td>
                      <Td>
                        <Text size="sm">
                          {key.errorCount ? key.errorCount : 0}
                        </Text>
                      </Td>
                      <Td>
                        {key.errorUrl ? (
                          <a href={key.errorUrl} download>
                            <DownloadIcon size={20} />
                          </a>
                        ) : (
                          "-"
                        )}
                      </Td>
                      {!location && (
                        <Td>
                          <Text size="sm">
                            {key.surveyId ? getSurveyName(key.surveyId) : "-"}
                          </Text>
                        </Td>
                      )}
                      <Td>
                        <Text size="sm">
                          {new Date(
                            key.date ? key.date : Date.now()
                          ).toDateString()}
                        </Text>
                      </Td>
                    </Tr>
                  );
                })
              : null}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default StatusPage;