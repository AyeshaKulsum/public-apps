import { Box, Flex, FormInput, Text } from "@sparrowengg/twigs-react";
import React, { useState, useEffect } from "react";
import { commonConstants } from "../../constants/common-constants";
import { InfoFillIcon } from "../icons";

const Builder = ({ setQuestion, selectedType, setSelectedType, setCurrentSelectedType}) => {
  const [text, setText] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState([]);
  const { questionType } = commonConstants;

  const isMultiQuestionType = (type) => {
    const multipleQuestionType = [
      questionType.multiChoice,
      questionType.dropDown,
      questionType.rankOrder
    ];
    return multipleQuestionType.some((quesType) => quesType === type);
  };

  const handleTextChange = (e) => {
    if (e.target.value) {
      const currentText = e.target.value;
      setText(currentText);
      const extractedQuestions = currentText.split(/\n\n+/);
      const formattedQuestions = extractedQuestions.map((questions, index) => {
        if (questions.length !== 0 && questions.split(/\n/).length > 1) {
          const splittedArray = questions.split(/\n/);
          let question = splittedArray[0];
          splittedArray.splice(0, 1);
          let arrOptions = splittedArray.map((options) => {
            return { text: options };
          });
          let questionValue = {
            question,
            type:
              selectedType.length !== 0 &&
              selectedType[index] &&
              isMultiQuestionType(selectedType[index]?.type)
                ? selectedType[index]?.type
                : questionType.multiChoice,
            options: arrOptions,
            label:
              questions.split(/\n/).length > 1 &&
              selectedType[index] &&
              isMultiQuestionType(selectedType[index]?.type)
                ? selectedType[index]?.label
                : "Multiple Choice"
          };
          return questionValue;
        } else if (questions.length !== 0) {
          return {
            question: questions,
            type:
              (selectedType.length !== 0 && selectedType[index] && !isMultiQuestionType(selectedType[index]?.type))
                ? selectedType[index].type
                : questionType.textInput,
            label: (selectedType[index] && !isMultiQuestionType(selectedType[index]?.type)) ? selectedType[index]?.label : "Text"
          };
        } else {
          return null;
        }
      });
      setCurrentQuestion(formattedQuestions.filter((ques) => ques !== null));
    } else {
      setSelectedType([])
      setCurrentSelectedType([]);
      setQuestion([]);
      setText("");
      return;
    }
  };

  useEffect(() => {
    setQuestion(currentQuestion);
  }, [currentQuestion]);

  return (
    <Box css={{ paddingInline: "$20", maxWidth: 732, width: "100%" }}>
      <Flex gap="$2" css={{ paddingBlock: "$8 $6" }}>
        <InfoFillIcon />
        <Text
          size="sm"
          css={{
            flex: 1,
            color: "$neutral800",
            lineHeight: "$sm"
          }}
        >
          Type the question and its answer choices in separate lines. Hit the{" "}
          <Text as="span" weight="bold">
            ‘Enter’
          </Text>{" "}
          key twice to add the next question.
        </Text>
      </Flex>
      <FormInput
        as="textarea"
        placeholder={commonConstants.placeholderText}
        value={text}
        onChange={handleTextChange}
        css={{
          height: 474,
          marginTop: "$2",
          resize: "none",
          padding: "$8"
        }}
      />
    </Box>
  );
};

export default Builder;
