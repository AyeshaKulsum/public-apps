import React, { useState, useEffect } from "react";
import {
  ChevronDownIcon,
  PlusIcon,
  DeleteIcon,
} from "@sparrowengg/twigs-react-icons";
import {
  Box,
  Button,
  Flex,
  Text,
  Select,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  IconButton,
  RadioGroup,
  Radio,
  Tooltip
} from "@sparrowengg/twigs-react";
import { shareTypeOptions, surveyVariables, topLevelCondition } from "../../constants/common";
import Conditions from "./Conditions";
import { generateRandomId } from "../../helpers/generateRandomId";
import CustomSelect from "../utils/CustomSelect";
import {
  surveyOptionsFetch,
  channelOptionsFetch,
  getSurveyVariables,
} from "../../helpers/ApiFunctions";
import { getFieldsFromDb } from "../../helpers/storageFunctions";

const Configuration = ({
  router,
  setRouter,
  surveyDetails,
  setSurveyDetails,
  filters,
  setFilters,
  triggers,
  props,
}) => {
  const [isSubCondCompleted, setIsSubCondCompleted] = useState(false);
  const [surveyOptions, setSurveyOptions] = useState([]);
  const [loading, setLoading] = useState({ survey: true, channel: true });
  const [channelOptions, setChannelOptions] = useState({
    EMAIL: null,
    WHATSAPP: null,
    SMS: null,
  });
  const [allOptions, setAllOptions] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [fieldOptions, setFieldOptions] = useState([]);

  const surveyDataFetch = async () => {
    try {
      const result = await surveyOptionsFetch(props);
      setSurveyOptions(result);
      const fields = await getFieldsFromDb(props);
      setFieldOptions(fields);
      setLoading((prev) => ({ ...prev, survey: false }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const channelDataFetch = async () => {
    try {
      if (surveyDetails.survey) {
        surveyDetails.shareConfig.forEach(async (share) => {
          if (share.shareType) {
            if (!channelOptions[share.shareType.value]) {
              const result = await channelOptionsFetch(
                props,
                surveyDetails.survey.id,
                share.shareType.value,
              );
              setChannelOptions((prevOptions) => ({
                ...prevOptions,
                [share.shareType.value]: result,
              }));
              setLoading((prev) => ({ ...prev, channel: false }));
            }
          }
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateSurveyVariables = async () => {
    try {
      if (!surveyDetails?.survey?.id) return;
      if(!initialLoad){
        setFilters({
          parentComparator: topLevelCondition[0],
          conditions: [],
          mainCondition: true
        });
      }
      setIsSubCondCompleted(false);
      setInitialLoad(false);
      const result = await getSurveyVariables(props, surveyDetails?.survey?.id);
      const data = result.map((item) => ({
        id: item.id,
        label: item.label,
        value: item.name,
        type: surveyVariables.name,
      }));
      setAllOptions([...fieldOptions, ...data]);
    } catch (error) {
      console.error('updateSurveyVariables -> Error fetching data:', error);
    }
  };

  useEffect(() => {
    surveyDataFetch();
  }, []);

  useEffect(() => {
    channelDataFetch();
  }, [surveyDetails]);

  useEffect(() => {
    if(surveyDetails?.survey?.id && !loading.survey) updateSurveyVariables();
  }, [surveyDetails?.survey?.id, loading.survey]);

  const addCondition = () => {
    setFilters((prev) => ({
      ...prev,
      conditions: [
        ...prev.conditions,
        {
          id: generateRandomId(),
          comparator: "AND",
          subConditions: [
            {
              id: generateRandomId(),
              field: null,
              operator: null,
              value: null,
            },
          ],
        },
      ],
    }));
  };

  const addShareConfig = () => {
    setSurveyDetails((prev) => ({
      ...prev,
      shareConfig: [
        ...prev.shareConfig,
        {
          id: generateRandomId(),
          shareType: null,
          shareChannel: null,
        },
      ],
    }));
  };

  const removeShareConfig = (id, index) => {
    const updatedShareConfig = surveyDetails?.shareConfig?.filter(
      (item) => item.id !== id,
    );
    setSurveyDetails((prev) => ({ ...prev, shareConfig: updatedShareConfig }));
  };

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      css={{
        width: "100%",
        height: "calc(100% - 72vh)",
        backgroundColor: "$white900",
        padding: "$40 0",
      }}
    >
      <Flex flexDirection="column" gap="$32" css={{ width: "488px" }}>
        <Box>
          <Text
            weight="bold"
            css={{ fontSize: '$xl', color: '$neutral900', marginBottom: '$12' }}
          >
            Select Survey
          </Text>
          <CustomSelect
            placeholder={''}  
            options={surveyOptions}
            surveyDetails={surveyDetails}
            setSurveyDetails={setSurveyDetails}
            type={'SURVEY'}
            value={surveyDetails?.survey}
            setChannelOptions={setChannelOptions}
            isLoading={loading?.survey}
            setLoading={setLoading}
          />
        </Box>
        <Box>
          <Text
            weight="bold"
            css={{ fontSize: "$xl", color: "$neutral900", marginBottom: "$12" }}
          >
            Set Condition
          </Text>
          <Box css={{ marginBlockEnd: '$12' }}>
            <Text size="md" weight="bold" css={{ color: '$neutral900', marginBlockEnd:'$8' }}>
              When should the survey be sent?
            </Text>
            <RadioGroup onChange={(value) => setFilters((prev) => ({ ...prev, mainCondition: value === 'MATCH' }))}>
              <Flex flexDirection="column" gap="$4" css={{ color: '$neutral900' }}>  
                <Radio value="MATCH" checked={filters.mainCondition === true} css={{cursor:'pointer'}}>Send survey when conditions match</Radio>  
                <Radio value="NOT_MATCH" checked={filters.mainCondition === false} css={{cursor:'pointer'}}>Send survey when conditions do NOT match</Radio>
              </Flex>
            </RadioGroup>
          </Box>
          <Flex alignItems="center" css={{ marginBottom: "$8" }}>
            <Text size="md" weight="bold" css={{ color: "$neutral900" }}>
              Which meet
            </Text>
            <DropdownMenu size="sm">
              <DropdownMenuTrigger asChild>
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  css={{ cursor: "pointer", marginLeft: "$2" }}
                >
                  <Text
                    size="md"
                    weight="medium"
                    css={{ color: "$neutral800" }}
                  >
                    {filters?.parentComparator?.label}
                  </Text>
                  <ChevronDownIcon size="20" strokeWidth={2} color="#6A6A6A" />
                </Flex>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                onCloseAutoFocus={(e) => e.preventDefault()}
                sideOffset={5}
                align="start"
                css={{ minWidth: "$30" }}
              >
                {topLevelCondition.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    css={{ cursor: "pointer" }}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        parentComparator: item,
                      }))
                    }
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Text size="md" weight="bold" css={{ color: '$neutral900' }}>
              of these conditions:
            </Text>
          </Flex>
          {filters?.conditions?.map((condition, index) => (
            <Conditions
              allOptions={allOptions}
              setAllOptions={setAllOptions}
              props={props}
              condition={condition}
              index={index}
              filters={filters}
              setFilters={setFilters}
              isSubCondCompleted={isSubCondCompleted}
              setIsSubCondCompleted={setIsSubCondCompleted}
            />
          ))}
          {!isSubCondCompleted && (
            <Tooltip content={!surveyDetails.survey ? 'Please select a survey to add conditions' : null} side="right">
              <Button
                size="md"
                variant="ghost"
                leftIcon={<PlusIcon />}
                css={{
                  width: "fit-content",
                  svg: { path: { strokeWidth: "2" } },
                }}
                onClick={addCondition}
                disabled={!surveyDetails.survey}
              >
                Add condition
              </Button>
            </Tooltip>
          )}
        </Box>
        <Box>
          <Text
            weight="bold"
            css={{ fontSize: "$xl", color: "$neutral900", marginBottom: "$12" }}
          >
            Share Configuration
          </Text>
          <Flex flexDirection="column" gap="$8">
            {surveyDetails?.shareConfig?.map((share, index) => {
              return (
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  gap="$4"
                  css={{
                    position: "relative",
                  }}
                  key={share.id}
                >
                  <CustomSelect
                    placeholder={""}
                    label={"Choose Share Type"}
                    options={shareTypeOptions}
                    surveyDetails={surveyDetails}
                    setSurveyDetails={setSurveyDetails}
                    type={"SHARE"}
                    shareId={share.id}
                    shareType={"shareType"}
                    isDisabled={surveyDetails.survey === null}
                    customStyles={{ width: "240px" }}
                    value={share?.shareType}
                    setChannelOptions={setChannelOptions}
                    setLoading={setLoading}
                  />
                  <CustomSelect
                    placeholder={""}
                    label={"Choose Share Channel"}
                    options={
                      share?.shareType
                        ? channelOptions[share?.shareType.value] !== null
                          ? channelOptions[share?.shareType.value]
                          : []
                        : []
                    }
                    surveyDetails={surveyDetails}
                    setSurveyDetails={setSurveyDetails}
                    type={"SHARE"}
                    shareId={share.id}
                    shareType={"shareChannel"}
                    isDisabled={share.shareType === null}
                    customStyles={{ width: "240px" }}
                    value={share?.shareChannel}
                    isLoading={loading?.channel}
                    setLoading={setLoading}
                  />
                  <Flex
                    alignItems="center"
                    justifyContent="center"
                    gap="$2"
                    css={{
                      position: "absolute",
                      right: "-15%",
                      top: "50%",
                    }}
                    className="addShareConfig"
                  >
                    {index === surveyDetails?.shareConfig?.length - 1 && (
                      <IconButton
                        icon={<PlusIcon />}
                        color="default"
                        variant="ghost"
                        onClick={addShareConfig}
                      />
                    )}
                    {surveyDetails?.shareConfig?.length > 1 && (
                      <IconButton
                        icon={<DeleteIcon />}
                        color="default"
                        variant="ghost"
                        css={{ svg: { path: { strokeWidth: "2" } } }}
                        onClick={() => removeShareConfig(share.id, index)}
                      />
                    )}
                  </Flex>
                </Flex>
              );
            })}
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Configuration;
