import React from "react";
import { Text } from "@sparrowengg/twigs-react";

const ConditionSummary = ({ condition }) => {
  return (
    <>
      {condition?.subConditions?.map((subCondition, index) => {
        return (
          <>
            <Text
              as="span"
              weight="medium"
              css={{
                color: "$neutral800",
                margin: index !== 0 ? "0 $2" : "0 $2 0 0",
              }}
            >
              {index !== 0 && condition?.comparator?.toLowerCase()}
            </Text>
            <Text
              as="span"
              css={{ color: "$neutral600", wordBreak: "break-all" }}
            >
              {subCondition?.field?.label || ""}{" "}
              {subCondition?.operator?.value === "BOOLEAN"
                ? "is"
                : subCondition?.operator?.label || ""}{" "}
              {subCondition?.operator?.value === "BOOLEAN"
                ? subCondition?.value?.label
                : subCondition?.value || ""}
            </Text>
          </>
        );
      })}
    </>
  );
};

export default ConditionSummary;
