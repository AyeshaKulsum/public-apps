import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Text,
  IconButton,
  FormHelperText,
  FormInput,
  toast,
} from "@sparrowengg/twigs-react";
import { ArrowLeftIcon } from "@sparrowengg/twigs-react-icons";
import CustomDialog from "./CustomDialog";
import { routerConstants, topLevelCondition } from "../../constants/common";
import { generateRandomId } from "../../helpers/generateRandomId";
import {
  saveTriggersToDB,
  updateTriggersInDB,
} from "../../helpers/storageFunctions";
const Header = ({
  setRouter,
  triggers,
  setTriggers,
  surveyDetails,
  setSurveyDetails,
  filters,
  setFilters,
  isEdit,
  setIsEdit,
  props,
}) => {
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [triggerName, setTriggerName] = useState(
    isEdit?.status
      ? triggers.find((trigger) => trigger.trigger_id === isEdit.id)
          ?.trigger_name
      : null
  );
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [triggerNameError, setTriggerNameError] = useState();

  const currentTriggerName = isEdit?.status
  ? triggers.find((trigger) => trigger.trigger_id === isEdit.id)
      ?.trigger_name
  : null

  const allNames = triggers.map((trigger) => trigger.trigger_name);

  useEffect(() => {
    if(triggerName && (isEdit?.status ? allNames.filter((name) => name !== currentTriggerName).includes(triggerName) : allNames.includes(triggerName))){
      setTriggerNameError(true);
    }
    else{
      setTriggerNameError(false);
    }
  }, [triggerName])

  const handleCustomAction = async () => {
    setLoading(true);
    if (isEdit?.status) {
      if (
        await updateTriggersInDB(
          props,
          {
            ...surveyDetails,
            trigger_name: triggerName,
          },
          isEdit.id,
          filters
        )
      ) {
        setSurveyDetails({
          survey: null,
          shareConfig: [
            {
              id: generateRandomId(),
              shareType: null,
              shareChannel: null,
            },
          ],
        }); //reset survey details
        setFilters({ parentComparator: topLevelCondition[0], conditions: [], mainCondition: true }); //reset filters
        setRouter(routerConstants.TRIGGERS);
        setOpenDialog(false);
        toast({
          variant: "default",
          description: "The trigger was updated successfully",
        });
      } else {
        toast({
          variant: "error",
          description: "The trigger was not updated successfully",
        });
      }
      setIsEdit({ status: false, id: null });
    } else {
      if (
        await saveTriggersToDB(
          props,
          {
            ...surveyDetails,
            trigger_id: generateRandomId(),
            created_at: null,
            modified_at: null,
            active: true,
            trigger_name: triggerName,
          },
          filters
        )
      ) {
        setSurveyDetails({
          survey: null,
          shareConfig: [
            {
              id: generateRandomId(),
              shareType: null,
              shareChannel: null,
            },
          ],
        }); //reset survey details
        setFilters({ parentComparator: topLevelCondition[0], conditions: [], mainCondition: true }); //reset filters
        setRouter(routerConstants.TRIGGERS);
        setOpenDialog(false);
        toast({
          variant: "default",
          description: "The trigger was created successfully",
        });
      } else {
        toast({
          variant: "error",
          description: "The trigger was not created successfully",
        });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const firstSubCondition = filters?.conditions?.[0]?.subConditions?.[0];
    const isSingleConditionCreated = !!(
      firstSubCondition?.value?.length ||
      firstSubCondition?.value?.label?.length ||
      firstSubCondition?.operator?.value === "NO_VALUE"
    );

    let allValidFilter = true;
    filters?.conditions?.forEach((condition) => {
      condition?.subConditions && condition.subConditions.forEach((subCondition) => {
        allValidFilter = !!(
          subCondition?.value?.length ||
          subCondition?.value?.label?.length ||
          subCondition?.operator?.value === "NO_VALUE"
        )
      })
    });

    const isShareChosen = surveyDetails?.shareConfig?.some(
      ({ shareType, shareChannel }) => !shareType || !shareChannel
    );

    setDisabled(!(isSingleConditionCreated && !isShareChosen && allValidFilter));
  }, [surveyDetails, filters]);

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      css={{
        width: "100%",
        height: "$18",
        backgroundColor: "$white900",
        zIndex: "5",
        position: "sticky",
        top: "0",
        padding: "0 $12",
        borderBottom: "$borderWidths$xs solid $neutral200",
      }}
    >
      <Flex alignItems="center" justifyContent="center" gap="$4">
        <IconButton
          icon={<ArrowLeftIcon strokeWidth={2} />}
          size="lg"
          color="default"
          onClick={() => {
            setOpenAlertDialog(true);
          }}
        />
        <Text size="lg" weight="bold" css={{ color: "$neutral900" }}>
          {isEdit?.status ? "Update Trigger" : "New Trigger"}
        </Text>
      </Flex>
      <Button size="lg" onClick={() => setOpenDialog(true)} disabled={disabled}>
        {isEdit?.status ? "Update" : "Next"}
      </Button>
      {openAlertDialog && (
        <CustomDialog
          dialogOpen={openAlertDialog}
          setDialogOpen={setOpenAlertDialog}
          width={450}
          height={257}
          header="Unsaved Changes Warning"
          content={
            <Text size="md" css={{ color: "$neutral900" }}>
              If you leave the page, any data you have entered will be lost. Are
              you sure you want to exit the page?
            </Text>
          }
          successBtnText="Exit Anyway"
          destructionBtnText="Cancel"
          btnAlignment="center"
          handleCustomAction={() => {
            setSurveyDetails({
              survey: null,
              shareConfig: [
                {
                  id: generateRandomId(),
                  shareType: null,
                  shareChannel: null,
                },
              ],
            }); //reset survey details
            setFilters({
              parentComparator: topLevelCondition[0],
              conditions: [],
              mainCondition: true
            }); //reset filters
            setIsEdit({ status: false, id: null }); //reset isEdit
            setRouter(routerConstants.TRIGGERS);
          }}
        />
      )}
      {openDialog && (
        <CustomDialog
          dialogOpen={openDialog}
          setDialogOpen={setOpenDialog}
          width={600}
          height={264}
          header="Save Trigger"
          content={
            <Flex
              flexDirection="column"
              gap="$2"
              css={{ width: "100%", position: "relative" }}
            >
              <FormHelperText
                size="sm"
                css={{ position: "absolute", top: "0" }}
              >
                For your future reference, give a name to this import.{" "}
                <Text as="span" css={{ color: "$negative600" }}>
                  *
                </Text>
              </FormHelperText>
              <FormInput
                size="xl"
                showCount
                maxLength={50}
                value={triggerName}
                css={{ borderRadius: "$xl" }}
                onChange={(e) => setTriggerName(e.target.value)}
                error={triggerNameError ? "Trigger name already exists. Enter a new name." : null}
                errorBorder={triggerNameError ? true : false}
              />
            </Flex>
          }
          successBtnText={isEdit?.status ? "Update Trigger" : "Finish Trigger"}
          destructionBtnText="Cancel"
          btnAlignment="end"
          handleCustomAction={handleCustomAction}
          successBtnProps={{ disabled: (!triggerName || loading || triggerNameError) }}
        />
      )}
    </Flex>
  );
};

export default Header;
