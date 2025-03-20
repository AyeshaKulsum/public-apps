import React from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Box,
  Button,
  Flex,
  IconButton,
  Text,
  Switch,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  toast,
} from "@sparrowengg/twigs-react";
import {
  ChevronRightIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  DeleteIcon,
} from "@sparrowengg/twigs-react-icons";
import { routerConstants } from "../../constants/common";
import { TriggerSVG } from "../../icons";
import ConditionSummary from "../configuration/ConditionSummary";
import {
  deleteTriggersFromDB,
  getTriggerConditionFromDB,
  changeStateOfTriggerInDB,
} from "../../helpers/storageFunctions";

const TriggerCard = ({
  item,
  accordionOpen,
  trigger,
  setTrigger,
  props,
  conditions,
  setConditions,
  index,
  setIsEdit,
  isEdit,
  setSurveyDetails,
  setFilters,
  setRouter,
}) => {
  const {
    trigger_id: id,
    trigger_name: triggerName,
    survey,
    shareConfig,
    active: checked,
  } = item;

  const getLabels = (data, type) => {
    const labels = data?.map((item) => item[type]?.label) || [];
    const limit = 2;
    if (labels.length > limit) {
      return `${labels.slice(0, limit).join(", ")}... +${
        labels.length - limit
      } more`;
    }
    return labels.join(", ");
  };

  const getUniqueLabels = (data) => {
    const labels = data?.map((item) => item?.shareType?.label) || [];
    const uniqueLabels = [...new Set(labels)];
    return uniqueLabels.join(", ");
  };

  const getConditionText = (mainCondition) => {
    const conditionMap = {
      true: ' - MATCH',
      false: ' - DO NOT MATCH',
    };
    return conditionMap[mainCondition] || '';
  };

  const deleteTrigger = async () => {
    try {
      if (await deleteTriggersFromDB(props, id)) {
        setTrigger((prev) => [...prev.filter((item) => item.trigger_id != id)]);
        setConditions((prev) => [
          ...prev.filter((item, current_index) => current_index != index),
        ]);
        toast({
          variant: "default",
          description: "The trigger was deleted successfully",
        });
      }
    } catch (e) {
      toast({
        variant: "error",
        description: "Failed to delete the trigger",
      });
      console.log(e);
    }
  };

  const handleEditTrigger = async () => {
    try {
      if (
        conditions[index] === undefined ||
        Object.keys(conditions[index]).length === 0
      ) {
        const list = await getTriggerConditionFromDB(props, item.trigger_id);

        if (Object.keys(list).length > 0) {
          setIsEdit({ status: true, id: item.trigger_id });
          setSurveyDetails({
            survey: item.survey,
            shareConfig: item.shareConfig,
          });
          setFilters(list);
          setRouter(routerConstants.CONFIGURATION);
        } else {
          toast({
            variant: "error",
            description: "Failed to fetch conditions",
          });
        }
      } else {
        setIsEdit({ status: true, id: item.trigger_id });
        setSurveyDetails({
          survey: item.survey,
          shareConfig: item.shareConfig,
        });
        setFilters(conditions[index]);
        setRouter(routerConstants.CONFIGURATION);
      }
    } catch (e) {
      toast({
        variant: "error",
        description: "Failed to fetch conditions",
      });
      console.log(e);
    }
  };

  return (
    <>
      <AccordionItem value={id} css={{ border: "0", marginBottom: "$8" }}>
        <AccordionTrigger
          css={{
            width: "100%",
            height: "$22",
            border: "$borderWidths$xs solid $black400",
            borderTopRightRadius: "$xl",
            borderTopLeftRadius: "$xl",
            "&[data-state='open']": {
              backgroundColorOpacity: ["$secondary500", 0.04],
            },
            "&[data-state='closed']": {
              borderRadius: "$xl",
            },
            "& > svg": { display: "none" },
            "&:hover": { backgroundColorOpacity: ["$secondary500", 0.04] },
          }}
        >
          <Flex
            alignItems="center"
            justifyContent="space-between"
            css={{ width: "100%" }}
          >
            <Flex alignItems="center" gap="$4">
              <Flex
                alignItems="center"
                justifyContent="center"
                css={{
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColorOpacity: ["$secondary500", 0.08],
                    borderRadius: "$lg",
                  },
                  svg: {
                    transform: accordionOpen?.includes(id)
                      ? "rotate(90deg)"
                      : "rotate(0deg)",
                    transition:
                      "transform 300ms cubic-bezier(0.87, 0, 0.13, 1)",
                  },
                }}
              >
                <ChevronRightIcon size={30} color="#6A6A6A" />
              </Flex>
              <TriggerSVG size="28" />
              <Text weight="bold" size="md" css={{ color: "$neutral900" }}>
                {triggerName}
              </Text>
            </Flex>
            <Flex alignItems="center" gap="$4">
              <Switch
                checked={checked}
                onClick={async (e) => {
                  e.stopPropagation();
                  if (await changeStateOfTriggerInDB(props, !checked, index)) {
                    const updatedTriggers = trigger.map((item) => {
                      if (item.trigger_id === id) {
                        return { ...item, active: !checked };
                      }
                      return item;
                    });
                    setTrigger(updatedTriggers);
                    checked
                      ? toast({
                          variant: "default",
                          description: `The trigger ${triggerName} has been paused`,
                        })
                      : toast({
                          variant: "default",
                          description: `The trigger ${triggerName} has been resumed`,
                        });
                  } else {
                    toast({
                      variant: "error",
                      description: "Failed to update the trigger state",
                    });
                  }
                }}
              />
              <DropdownMenu size="sm">
                <DropdownMenuTrigger asChild>
                  <IconButton
                    icon={<EllipsisVerticalIcon />}
                    size="md"
                    variant="ghost"
                    color="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  css={{ minWidth: "180px", borderRadius: "$xl" }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <DropdownMenuItem
                    css={{ cursor: "pointer" }}
                    onClick={handleEditTrigger}
                  >
                    <Flex alignItems="center" gap="$4">
                      <PencilIcon size={18} strokeWidth={2} />
                      <Text css={{ color: "$neutral900" }}>Edit</Text>
                    </Flex>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    css={{ cursor: "pointer" }}
                    onClick={deleteTrigger}
                  >
                    <Flex alignItems="center" gap="$4">
                      <DeleteIcon size={18} strokeWidth={2} />
                      <Text css={{ color: "$neutral900" }}>Delete</Text>
                    </Flex>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Flex>
          </Flex>
        </AccordionTrigger>
        <AccordionContent
          css={{
            padding: "0",
            border: "$borderWidths$xs solid $black400",
            borderTop: "none",
            borderBottomRightRadius: "$xl",
            borderBottomLeftRadius: "$xl",
          }}
        >
          <Flex flexDirection="column" css={{ padding: "$8 $36 $12 $36" }}>
            <Flex flexDirection="column" gap="$6">
              <Text weight="bold" css={{ color: "$neutral900" }}>
                SURVEY SETTING
              </Text>
              <Flex alignItems="center" gap="$7">
                <Flex alignItems="center" gap="$2">
                  <Text css={{ color: "$neutral500" }}>Survey Name:</Text>
                  <Text
                    weight="medium"
                    css={{ maxWidth: "180px", color: "$neutral800" }}
                    truncate
                  >
                    {survey?.label}
                  </Text>
                </Flex>
                <Box
                  css={{
                    width: "1px",
                    height: "$4",
                    backgroundColor: "$neutral200",
                  }}
                />
                <Flex alignItems="center" gap="$2">
                  <Text css={{ color: "$neutral500" }}>Share Type:</Text>
                  <Text weight="medium" css={{ color: "$neutral800" }}>
                    {getUniqueLabels(shareConfig)}
                  </Text>
                </Flex>
                <Box
                  css={{
                    width: "1px",
                    height: "$4",
                    backgroundColor: "$neutral200",
                  }}
                />
                <Flex alignItems="center" gap="$2">
                  <Text css={{ color: "$neutral500" }}>Share Channel:</Text>
                  <Text weight="medium" css={{ color: "$neutral800" }}>
                    {getLabels(shareConfig, "shareChannel")}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            <Box
              css={{
                width: "100%",
                height: "1px",
                backgroundColor: "$neutral200",
                margin: "$12 0",
              }}
            />
            <Flex flexDirection="column" gap="$6">
              <Text weight="bold" css={{ color: '$neutral900' }}>
                CONDITION {getConditionText(conditions[index]?.mainCondition)}
              </Text>
              {conditions[index]?.conditions?.map((condition, i) => {
                return (
                  <Text>
                    {i !== 0 && (
                      <Text
                        as="span"
                        weight="medium"
                        css={{ color: "$neutral800", marginRight: "$2" }}
                      >
                        {conditions[index]?.parentComparator?.value
                          ?.charAt(0)
                          .toUpperCase() +
                          conditions[index]?.parentComparator?.value
                            ?.slice(1)
                            ?.toLowerCase()}
                      </Text>
                    )}
                    <Text
                      as="span"
                      weight="medium"
                      css={{ color: "$neutral800" }}
                    >
                      {i !== 0 ? "when," : "When"}
                    </Text>
                    <ConditionSummary condition={condition} />
                  </Text>
                );
              })}
            </Flex>
          </Flex>
          <Flex
            css={{
              borderTop: "$borderWidths$xs solid $black400",
              padding: "$8 $36 0 $36",
            }}
          >
            <Button
              variant="ghost"
              leftIcon={<PencilIcon />}
              css={{ svg: { path: { strokeWidth: "2" } } }}
              onClick={handleEditTrigger}
            >
              Edit Trigger
            </Button>
          </Flex>
        </AccordionContent>
      </AccordionItem>
    </>
  );
};

export default TriggerCard;
