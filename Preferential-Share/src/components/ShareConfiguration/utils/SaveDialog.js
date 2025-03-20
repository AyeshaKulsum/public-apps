import {
  Button,
  Dialog,
  DialogContent,
  Flex,
  FormHelperText,
  FormInput,
  IconButton,
  Text,
} from "@sparrowengg/twigs-react";
import { CloseIcon } from "@sparrowengg/twigs-react-icons";
import React from "react";

const SaveDialog = ({
  openDialog,
  setOpenDialog,
  scheduleName,
  setScheduleName,
  handleSaveSchedule,
  buttonLoader,
  allTakenNames
}) => {
  return (
    <Dialog open={openDialog}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        css={{
          width: 600,
          height: 264,
          borderRadius: "$2xl",
          padding: "0",
        }}
      >
        <Flex flexDirection="column" css={{ height: "100%" }}>
          <Flex
            alignItems="center"
            justifyContent="space-between"
            css={{
              height: "72px",
              padding: "0 $12",
              borderBottom: "$borderWidths$xs solid $neutral200",
            }}
          >
            <Text weight="bold" size="lg" css={{ color: "$neutral900" }}>
              Save Schedule
            </Text>
            <IconButton
              color="bright"
              size="lg"
              onClick={() => setOpenDialog(false)}
            >
              <CloseIcon />
            </IconButton>
          </Flex>
          <Flex
            alignItems="center"
            justifyContent="center"
            css={{ width: "100%", flexGrow: "1", padding: "0 $12" }}
          >
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
                css={{ borderRadius: "$xl" }}
                onChange={(e) => setScheduleName(e.target.value)}
                value={scheduleName}
                errorBorder={allTakenNames.includes(scheduleName) ? true : false}
                error={allTakenNames.includes(scheduleName) ? "Name already exists. Enter a new name." : ""}
              />
            </Flex>
          </Flex>
          <Flex
            alignItems="center"
            justifyContent="end"
            css={{ width: "100%", height: "72px", padding: "0 $12" }}
            gap="$4"
          >
            <Button
              color="default"
              size="lg"
              disabled={buttonLoader}
              onClick={() => setOpenDialog(false)}
            >
              Cancel
            </Button>
            <Button loading={buttonLoader} disabled={buttonLoader || allTakenNames.includes(scheduleName)} size="lg" onClick={handleSaveSchedule}>
              Finish Schedule
            </Button>
          </Flex>
        </Flex>
      </DialogContent>
    </Dialog>
  );
};

export default SaveDialog;
