import { Button, Flex, Heading, toast } from "@sparrowengg/twigs-react";
import React, { useContext } from "react";
import { postQuestion } from "../../helpers/post-questions";
import { useState } from "react";
import { GlobalContext } from "../../context";
import { commonConstants } from "../../constants/common-constants";

const Navbar = ({ question, client }) => {
  const [loading, setLoading] = useState(false);
  const { surveyId } = useContext(GlobalContext);

  const closeModal = async () => await client?.interface?.handleModal("close");

  const redirectToBuilder = () =>
    (window.top.location.href = document.referrer + `builder/edit/${surveyId}`);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let questionCount = 0;
      const result = [];
      for (const value of question) {
        const response = await postQuestion(surveyId, value);
        result.push(response);
        questionCount += 1;
      }
      let error;
      result.forEach((res, idx) => {
        if (res?.includes(commonConstants.question.QUESTION_QUOTA) && !error) {
          client?.interface?.alertMessage(
            idx === 0
              ? "No questions created. Question quota reached."
              : `Error while creating ${
                question.length - idx 
                } question(s). Question quota reached`,
            { type: "failure" }
          );
          error = true;
          idx !== 0 &&  redirectToBuilder();
        }
        if(res?.includes(commonConstants.question.API_QUOTA) && !error){
          client?.interface?.alertMessage(`No questions created. API quota reached.`,
            { type: "failure" }
          );
          error = true;
          redirectToBuilder();
        }
        if(res?.includes(commonConstants.question.WRONG_PAYLOAD) && !error) {
          client?.interface?.alertMessage(`Error while creating questions. Wrong payload`,
          { type: "failure" }
        );
        error = true;
        redirectToBuilder();
        }
      });
      if (surveyId && questionCount === question.length && !error) {
        client?.interface?.alertMessage(
          `${questionCount} question(s) created successfully`,
          {
            type: "success"
          }
        );
        redirectToBuilder();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      css={{
        width: "100%",
        padding: "$8 $12",
        borderBottom: "$borderWidths$xs solid $lightBorder"
      }}
    >
      <Heading size="h6" css={{ paddingLeft: "$4" }}>
        Bulk Questions
      </Heading>
      <Flex alignItems="center" gap="$4">
        <Button size="lg" color="default" onClick={closeModal}>
          Cancel
        </Button>
        <Button size="lg" loading={loading} onClick={() => handleSubmit()} disabled={!question.length || loading}>
          Add to survey
        </Button>
      </Flex>
    </Flex>
  );
};

export default Navbar;
