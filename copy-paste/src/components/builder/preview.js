import {
  Box,
  Button,
  Flex,
  Text,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@sparrowengg/twigs-react";
import { ChevronDownIcon } from "@sparrowengg/twigs-react-icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import { commonConstants } from "../../constants/common-constants";
import NoData from "../commons/no-data";
import PreviewBox from "./preview-box";
import { GlobalContext } from "../../context";

const Preview = ({
  question,
  setQuestion,
  setSelectedType,
  currentSelectedType,
  setCurrentSelectedType
}) => {
  const { questionType } = commonConstants;
  const { surveyType } = useContext(GlobalContext);

  const handleDropdown = (type, index) => {
    let updatedSelectedType = [...currentSelectedType];
    updatedSelectedType[index] = {
      index: index,
      type: type.value,
      label: type.label
    };
    setCurrentSelectedType(updatedSelectedType);
    setSelectedType(updatedSelectedType);
    let temp = [...question];
    temp[index].type = type.value;
    temp[index] = { ...temp[index], label: type.label };
    setQuestion(temp);
  };

  const handleOptions = (options, isMultipleQuestion) => {
    let filteredOptions;
    const { surveyTypes, questionType } = commonConstants;
    const CX_Filters = (option) =>
      !(
        option.value === questionType.emailInput ||
        option.value === questionType.urlInput ||
        option.value === questionType.numberInput ||
        option.value === questionType.slider ||
        option.value === questionType.dateTime ||
        option.value === questionType.signature ||
        option.value === questionType.cameraInput
      );

    switch (surveyType) {
      case surveyTypes.CHAT_SURVEY:
        if (isMultipleQuestion) {
          filteredOptions = options.filter(
            (option) => option.value === questionType.multiChoice
          );
        } else {
          filteredOptions = options.filter(
            (option) =>
              !(
                option.value === questionType.cameraInput ||
                option.value === questionType.signature ||
                option.value === questionType.slider
              )
          );
        }
        break;
      case surveyTypes.CES_SURVEY:
      case surveyTypes.CSAT_SURVEY:
      case surveyTypes.NPS_SURVEY:
        if (!isMultipleQuestion) {
          filteredOptions = options.filter((option) => CX_Filters(option));
        } else {
          filteredOptions = options;
        }
        break;
      case surveyTypes.CES_CHAT_SURVEY:
      case surveyTypes.CSAT_CHAT_SURVEY:
      case surveyTypes.NPS_CHAT_SURVEY:
        if (!isMultipleQuestion) {
          filteredOptions = options.filter((option) => CX_Filters(option));
        } else {
          filteredOptions = options.filter(
            (option) => option.value === questionType.multiChoice
          );
        }
        break;
      case surveyTypes.OFFLINE_APP:
        if (!isMultipleQuestion) {
          filteredOptions = options.filter(
            (option) =>
              !(
                option.value === questionType.slider ||
                option.value === questionType.urlInput
              )
          );
        } else {
          filteredOptions = options;
        }
        break;
      default:
        filteredOptions = options;
    }
    return filteredOptions;
  };

  const handleQuestionOptions = (question) => {
    const isMultipleQuestion =
      question.type === questionType.multiChoice ||
      question.type === questionType.dropDown ||
      question.type === questionType.rankOrder;

    const optionType = isMultipleQuestion
      ? commonConstants.multipleQuestionTypes
      : commonConstants.commonQuestionTypes;
    const options = handleOptions(optionType, isMultipleQuestion);
    return options;
  };
  const previewRef = useRef(null);

  useEffect(() => {
    previewRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [question]);

  return (
    <Flex
      flexDirection="column"
      justifyContent="space-between"
      css={{
        maxWidth: 496,
        width: "100%",
        backgroundColor: "#F2F5F8",
        borderLeft: "$borderWidths$xs solid $lightBorder",
        borderBottomRightRadius: "15px"
      }}
    >
      <Box css={{ paddingTop: "$20" }}>
        <Flex
          flexDirection="column"
          justifyContent={question.length ? "flex-start" : "center"}
          gap="$8"
          css={{
            overflowY: "auto",
            height: "calc( 585px - $10 )",
            paddingBottom: "$10",
            paddingInline: "$20"
          }}
        >
          {question?.length > 0 ? (
            question?.map((question, index) => {
              const currentQuestionType = Object.values(questionType).find(
                (type) => type === question?.type
              );
              return (
                <>
                  {question?.question?.length > 0 ? (
                    <Box
                      ref={previewRef}
                      css={{
                        background: "$white900",
                        padding: "$10",
                        borderRadius: "$2xl",
                        border: "$borderWidths$xs solid $black200"
                      }}
                    >
                      <Text size="md" css={{
                         wordBreak: "break-word",
                         width: "100%"
                      }}>{question?.question}</Text>

                      <QuestionDropdown
                        options={handleQuestionOptions(question)}
                        handleDropdown={handleDropdown}
                        index={index}
                        type={question?.type}
                        value={question?.label || currentQuestionType}
                      />
                      {!question?.options?.length > 0 && (
                        <PreviewBox currentQuestionType={currentQuestionType} />
                      )}
                      <Flex
                        flexDirection="column"
                        gap="$2"
                        css={{
                          marginTop: question?.options?.length ? "$6" : 0
                        }}
                      >
                        {question?.options?.map((option, idx) => (
                          <Flex alignItems="center" gap="$2" key={idx}>
                            <Text
                              css={{
                                color: "$neutral600",
                                width: "$5",
                                lineHeight: "$sm"
                              }}
                              size="sm"
                            >
                              {question.type.includes(questionType.rankOrder)
                                ? `${idx + 1}.`
                                : `${String.fromCharCode(65 + idx)}. `}
                            </Text>
                            <Text
                              css={{
                                color: "$neutral600",
                                lineHeight: "$sm",
                                wordBreak: "break-word",
                                width: "100%"
                              }}
                              size="sm"
                            >
                              {option.text}
                            </Text>
                          </Flex>
                        ))}
                      </Flex>
                    </Box>
                  ) : null}
                </>
              );
            })
          ) : (
            <NoData title="No Question Added" />
          )}
        </Flex>
      </Box>
    </Flex>
  );
};

const QuestionDropdown = ({ options, handleDropdown, index, value, type }) => {
  const dropdownItemRef = useRef(null);
  const [btn, setBtn] = useState(false);

  useEffect(() => {
    dropdownItemRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [btn]);

  return (
    <DropdownMenu onOpenChange={() => setBtn(!btn)}>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          aria-label="Customise options"
          color="default"
          rightIcon={<ChevronDownIcon size={20} />}
          css={{ marginTop: "$4" }}
        >
          <Text
            size="sm"
            css={{ paddingBlock: "$2", color: "$neutral800" }}
            weight="medium"
          >
            {value}
          </Text>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        alignOffset={4}
        css={{
          minWidth: 160,
          marginTop: "$2",
          maxHeight: 250,
          overflowY: "auto"
        }}
      >
        {options?.map((option) => (
          <DropdownMenuItem
            ref={type === option.value ? dropdownItemRef : null}
            css={{
              padding: "$3 $6",
              background: type === option.value ? "$neutral100" : "$white900"
            }}
            key={option.label}
            onClick={() => handleDropdown(option, index)}
          >
            <Text size="sm">{option.label}</Text>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Preview;
