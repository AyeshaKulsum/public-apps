import React from "react";
import {
  Text,
  Table,
  Tbody,
  Thead,
  Th,
  Tr,
  Td,
  Flex,
  Box
} from "@sparrowengg/twigs-react";
import Loader from "../Loader";
import { TickCircleIcon, AlertIcon } from "@sparrowengg/twigs-react-icons";
import Select from "react-select";
import { commonConstants } from "../../constants/commonConstants";

export const MapFieldsTab = ({
  mapFieldsLoading,
  headers,
  sample,
  firstList,
  secondList,
  errorList,
  questionList,
  variableList,
  responseProperty,
  contactProperty,
  answerPayload,
  variablePayload,
  responsePropertyPayload,
  contactPropertyPayload,
  selectedQuestion,
  selectedVariable,
  selectedResponseProperty,
  selectedContactProperty,
  handleOptionSelect,
  handleQuestionSelect
}) => {
  return (
    <>
      {mapFieldsLoading ? (
        <Loader />
      ) : (
        <Flex
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          css={{
            width: "100vw"
          }}
        >
          <Text size={"lg"} weight="bold">
            {commonConstants.mapData}
          </Text>
          <Text
            css={{
              marginBlock: "$5 $6",
              color: "$neutral300",
              textAlign: "center",
              width: "70%"
            }}
          >
            {commonConstants.mappingHeaderText}
          </Text>
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
                backgroundColor: "transparent",
                "& th": {
                  color: "$neutral900",
                  borderColor: "transparent",
                  borderBottom: "1px solid $neutral300",
                  width: "25%",
                  fontWeight: "bold",
                  opacity: "0.5",
                  fontSize: "$xs"
                }
              }}
            >
              <Th>{commonConstants.status}</Th>
              <Th>{commonConstants.columnHeader}</Th>
              <Th>{commonConstants.contentSample}</Th>
              <Th>{commonConstants.mapping}</Th>
            </Thead>
            <Tbody>
              {headers.map((header) => {
                return (
                  <Tr
                    key={header}
                    css={{
                      borderColor: "transparent",
                      borderBottomColor: "black"
                    }}
                  >
                    <Td
                      css={{
                        borderColor: "transparent",
                        borderBottom: "1px solid $neutral200"
                      }}
                    >
                      <Flex justifyContent="center" gap="10px">
                        {answerPayload[header] ||
                        variablePayload[header] ||
                        responsePropertyPayload[header] ||
                        contactPropertyPayload[header] ? (
                          <TickCircleIcon color="#56B0BB" size={20} />
                        ) : (
                          <AlertIcon color="red" size={20} />
                        )}
                        <Flex
                          alignItems="flex-start"
                          justifyContent="center"
                          flexDirection="column"
                          gap="$5"
                        >
                          <Text>{commonConstants.mapped}</Text>
                          <Text
                            size={"xs"}
                            css={{
                              color: "$neutral300"
                            }}
                          >
                            {commonConstants.autoMapped}
                          </Text>
                        </Flex>
                      </Flex>
                    </Td>
                    <Td
                      css={{
                        maxWidth: "350px",
                        textAlign: "center",
                        wordBreak: "break-word",
                        wordWrap: "break-word",
                        borderColor: "transparent",
                        borderBottom: "1px solid $neutral200"
                      }}
                    >
                      <Text size="sm" css={{ textAlign: "center" }}>
                        {header}
                      </Text>
                    </Td>
                    <Td
                      css={{
                        maxWidth: "350px",
                        textAlign: "center",
                        wordBreak: "break-word",
                        wordWrap: "break-word",
                        borderColor: "transparent",
                        borderBottom: "1px solid $colors$wanWhite"
                      }}
                    >
                      <Text css={{ textAlign: "center" }} size="sm">
                        {sample[header]?.data[0]
                          ? `${sample[header].data[0]} ${
                              sample[header].count > 1
                                ? `  +${sample[header].count - 1}  more`
                                : ""
                            }`
                          : commonConstants.noSampleData}
                      </Text>
                    </Td>
                    <Td
                      css={{
                        borderColor: "transparent",
                        borderBottom: "1px solid $neutral200"
                      }}
                    >
                      <Flex
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="column"
                        gap="$10"
                      >
                        <Box
                          style={{
                            maxWidth: "448px",
                            width: "100%"
                          }}
                        >
                          <Select
                            options={firstList}
                            value={
                              secondList[header]
                                ? secondList[header] == commonConstants.question
                                  ? firstList.find(
                                      (list) =>
                                        list.label == commonConstants.question
                                    )
                                  : secondList[header] ==
                                    commonConstants.responseProperty.name
                                  ? firstList.find(
                                      (list) =>
                                        list.label ==
                                        commonConstants.responseProperty.name
                                    )
                                  : secondList[header] ==
                                    commonConstants.contactProperty.name
                                  ? firstList.find(
                                      (list) =>
                                        list.label ==
                                        commonConstants.contactProperty.name
                                    )
                                  : firstList.find(
                                      (list) =>
                                        list.label == commonConstants.variable
                                    )
                                : null
                            }
                            onChange={(e) => {
                              handleOptionSelect(e, header);
                            }}
                          />
                        </Box>
                        <Box
                          style={{
                            maxWidth: "448px",
                            width: "100%"
                          }}
                        >
                          <Select
                            options={
                              secondList[header]
                                ? secondList[header] == commonConstants.question
                                  ? questionList
                                  : secondList[header] ==
                                    commonConstants.responseProperty.name
                                  ? responseProperty
                                  : secondList[header] ==
                                    commonConstants.contactProperty.name
                                  ? contactProperty
                                  : variableList
                                : []
                            }
                            value={
                              answerPayload[header] ||
                              variablePayload[header] ||
                              responsePropertyPayload[header] ||
                              contactPropertyPayload[header] ||
                              null
                            }
                            isOptionDisabled={(option) => {
                              return (
                                selectedQuestion.find(
                                  (e) => e.label == option.label
                                ) ||
                                selectedVariable.find(
                                  (e) => e.label == option.label
                                ) ||
                                selectedResponseProperty.find(
                                  (e) => e.label == option.label
                                ) ||
                                selectedContactProperty.find(
                                  (e) => e.label == option.label
                                )
                              );
                            }}
                            isDisabled={!secondList[header]}
                            isClearable={true}
                            onChange={(e) => handleQuestionSelect(e, header)}
                          />
                        </Box>
                      </Flex>
                      {errorList[header] ? (
                        <Text
                          size="sm"
                          css={{
                            color: "$negative400",
                            textAlign: "left",
                            marginTop: "$5"
                          }}
                        >
                          {commonConstants.cannotMapSampleData}
                        </Text>
                      ) : null}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Flex>
      )}
    </>
  );
};
