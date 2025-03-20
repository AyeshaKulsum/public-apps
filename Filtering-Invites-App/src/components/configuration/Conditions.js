import React, { useEffect } from "react";
import { Box, Flex, Text, IconButton, Button } from "@sparrowengg/twigs-react";
import { AddFilterSVG } from "../../icons";
import { CloseIcon, DeleteIcon } from "@sparrowengg/twigs-react-icons";
import Filter from "../utils/Filter";
import { subMenuOptions } from "../../constants/common";
import { generateRandomId } from "../../helpers/generateRandomId";
import { getFieldsFromDb } from "../../helpers/storageFunctions";

const Conditions = ({
  props,
  allOptions,
  setAllOptions,
  condition,
  index,
  filters,
  setFilters,
  isSubCondCompleted,
  setIsSubCondCompleted,
}) => {
  useEffect(() => {
    const checkCond = condition?.subConditions?.every(
      (item) =>
        (item.operator?.value === "NO_VALUE" && item.value === null) ||
        item.value !== null
    );
    setIsSubCondCompleted(!checkCond);
  }, [condition?.subConditions]);

  const removeCondition = (id) => {
    const updatedConditions = filters?.conditions?.filter(
      (item) => item.id !== id
    );
    setFilters((prev) => ({ ...prev, conditions: updatedConditions }));
  };

  const addSubCondition = (id) => {
    const updatedConditions = filters?.conditions?.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          subConditions: [
            ...(item.subConditions || []),
            {
              id: generateRandomId(),
              field: null,
              operator: null,
              value: null,
            },
          ],
        };
      }
      return item;
    });
    setFilters((prev) => ({ ...prev, conditions: updatedConditions }));
  };

  const removeSubCondition = (condId, subId) => {
    if (condition?.subConditions?.length === 1) {
      setIsSubCondCompleted(false);
      removeCondition(condId);
      return;
    }
    const updatedConditions = filters?.conditions?.map((item) => {
      if (item.id === condId) {
        return {
          ...item,
          subConditions: [
            ...(item.subConditions || []).filter(
              (subItem) => subItem.id !== subId
            ),
          ],
        };
      }
      return item;
    });
    setFilters((prev) => ({ ...prev, conditions: updatedConditions }));
  };

  const handleComparator = (id) => {
    const updatedConditions = filters?.conditions?.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          comparator: item.comparator === "AND" ? "OR" : "AND",
        };
      }
      return item;
    });
    setFilters((prev) => ({ ...prev, conditions: updatedConditions }));
  };

  return (
    <Box css={{ width: "100%", marginBottom: "$12" }}>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        gap="$3"
        css={{
          marginBottom: "$4",
          height: "$6",
          ".filterUtils": { display: "none" },
          "&:hover": { ".filterUtils": { display: "flex" } },
        }}
      >
        {index !== 0 && (
          <Text weight="bold" css={{ color: "$neutral900" }}>
            {filters?.parentComparator?.value?.toLowerCase()}
          </Text>
        )}
        <Text weight="bold" css={{ color: "$neutral900" }}>
          When
        </Text>
        <Box
          css={{ width: "100%", height: "1px", backgroundColor: "$black200" }}
        />
        {!isSubCondCompleted && (
          <Flex
            alignItems="center"
            justifyContent="center"
            gap="$4"
            className="filterUtils"
          >
            <IconButton
              icon={<AddFilterSVG />}
              color="default"
              variant="ghost"
              css={{
                "& > span:first-child": {
                  width: "$4 !important",
                },
              }}
              onClick={() => addSubCondition(condition.id)}
            />
            <IconButton
              icon={<DeleteIcon />}
              color="default"
              variant="ghost"
              css={{
                "& > span:first-child": {
                  width: "$4 !important",
                },
                svg: { path: { strokeWidth: "2" } },
              }}
              onClick={() => removeCondition(condition.id)}
            />
          </Flex>
        )}
      </Flex>
      {condition?.subConditions?.map((subCondition, index) => (
        <Flex
          alignItems="center"
          justifyContent="space-between"
          css={{
            marginBottom: "$4",
            ".subCondCloseIcon": { visibility: "hidden" },
            "&:hover": { ".subCondCloseIcon": { visibility: "visible" } },
          }}
        >
          <Flex alignItems="center" gap="$2">
            {index !== 0 && (
              <Button
                size="xs"
                color="default"
                onClick={() => handleComparator(condition.id)}
              >
                {condition.comparator?.toLowerCase()}
              </Button>
            )}
            <Filter
              props={props}
              options={allOptions}
              setAllOptions={setAllOptions}
              type={"DROPDOWN"}
              field={{ label: "Choose Field", value: "field" }}
              condition={condition}
              filters={filters}
              setFilters={setFilters}
              subCondition={subCondition}
            />
            {subCondition?.field && (
              <Filter
                options={subMenuOptions}
                type={"NESTED_DROPDOWN"}
                field={{ label: "Choose Data Type", value: "operator" }}
                condition={condition}
                filters={filters}
                setFilters={setFilters}
                subCondition={subCondition}
              />
            )}
            {subCondition?.operator &&
              subCondition?.operator?.value !== "NO_VALUE" && (
                <Filter
                  type={"TEXT"}
                  field={{ label: "Type Value", value: "value" }}
                  condition={condition}
                  filters={filters}
                  setFilters={setFilters}
                  subCondition={subCondition}
                />
              )}
          </Flex>
          <IconButton
            icon={<CloseIcon />}
            color="default"
            variant="ghost"
            css={{ svg: { path: { strokeWidth: "2" } } }}
            className="subCondCloseIcon"
            onClick={() => removeSubCondition(condition.id, subCondition.id)}
          />
        </Flex>
      ))}
    </Box>
  );
};

export default Conditions;
