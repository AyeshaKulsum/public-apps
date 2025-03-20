import React, { useState } from "react";
import {
  Accordion,
  AlertDialog,
  AlertDialogAction,
  AlertDialogActions,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  Box,
  Button,
  Flex,
  Text,
  toast,
} from "@sparrowengg/twigs-react";
import { DeleteIcon, PlusIcon } from "@sparrowengg/twigs-react-icons";
import Card from "./utils/Card";
import NoShareState from "./utils/NoShareState";

const Listing = ({ schedulesData, router, setRouter, client, setSchedulesData }) => {
  const [accordionOpen, setAccordionOpen] = useState(null);
  const [openAlertDialog, setOpenAlertDialog] = useState({});

  const deleteShare = async (id) => {
    try {
      setOpenAlertDialog({ ...openAlertDialog, [id]: false });
      const surveyId = await client.data.get("getSurveyId");
      const result = await client.db.getV2(`shares_pref_${surveyId}`);
      const shares = result ? JSON.parse(result) : [];
      await client.db.setV2(
        `shares_pref_${surveyId}`,
        shares.filter((share) => share.id !== id)
      );
      setSchedulesData(shares.filter((share) => share.id !== id));
      toast({
        variant: "default",
        description: "The share was deleted successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "error",
        description: "Failed to delete the share",
      });
    }
  };

  return (
    <Flex alignItems="center" justifyContent="center" css={{ width: "100%" }}>
      {schedulesData?.length > 0 ? (
        <Box css={{ width: "1120px", paddingBlock: "$40" }}>
          <Flex
            alignItems="center"
            justifyContent="space-between"
            css={{ width: "100%", marginBlockEnd: "$20" }}
          >
            <Box>
              <Text weight="bold" css={{ fontSize: "$xl", color: "$neutral900" }}>
                FlexiShare
              </Text>
              <Text css={{ color: "$neutral600", marginBlockStart: "$2" }}>
                Effortlessly manage survey distributions with customizable preferences for each contact, scheduling via email, SMS, and WhatsApp.
              </Text>
            </Box>
            <Button
              size="lg"
              css={{ svg: { path: { strokeWidth: 2 } } }}
              leftIcon={<PlusIcon />}
              onClick={() => setRouter("ChooseContactList")}
            >
              Configure Share
            </Button>
          </Flex>
          <Accordion
            type="multiple"
            onValueChange={(val) => setAccordionOpen(val)}
          >
            {schedulesData.map((schedule, index) => (
              <>
              <Card client={client} setSchedulesData={setSchedulesData} key={index} item={schedule} accordionOpen={accordionOpen} openAlertDialog={openAlertDialog} setOpenAlertDialog={setOpenAlertDialog} />
                <AlertDialog open={!!openAlertDialog[schedule.id]}>
                <AlertDialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                    <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
                  <AlertDialogDescription>Are you sure you want to delete this schedule?</AlertDialogDescription>
                    <AlertDialogActions>
                      <AlertDialogCancel asChild>
                        <Button
                          color="default"
                          size="lg"
                        onClick={() => setOpenAlertDialog({ ...openAlertDialog, [schedule.id]: false })}
                        >
                          Cancel
                        </Button>
                      </AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <Button
                          color="error"
                          size="lg"
                          onClick={() => deleteShare(schedule.id)}
                          leftIcon={<DeleteIcon color="#E75030" />}
                          css={{ svg: { path: { strokeWidth: 2 } } }}
                        >
                          Yes, Delete
                        </Button>
                      </AlertDialogAction>
                    </AlertDialogActions>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ))}
          </Accordion>
        </Box>
      ) : (
        <NoShareState setRouter={setRouter} />
      )}
    </Flex>
  );
};

export default Listing;
