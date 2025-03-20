import React from "react";
import {
  Dialog,
  DialogContent,
  Flex,
  Text,
  IconButton,
  Button,
} from "@sparrowengg/twigs-react";
import { CloseIcon } from "@sparrowengg/twigs-react-icons";

const CustomDialog = ({
  dialogOpen,
  setDialogOpen,
  width,
  height,
  header,
  content,
  successBtnText,
  destructionBtnText,
  btnAlignment,
  handleCustomAction,
  successBtnProps,
}) => {
  return (
    <Dialog open={dialogOpen}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        css={{
          width: width,
          height: height,
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
              {header}
            </Text>
            <IconButton
              color="bright"
              size="lg"
              onClick={() => setDialogOpen(false)}
            >
              <CloseIcon />
            </IconButton>
          </Flex>
          <Flex
            alignItems="center"
            justifyContent="center"
            css={{ width: "100%", flexGrow: "1", padding: "0 $12" }}
          >
            {content}
          </Flex>
          <Flex
            alignItems="center"
            justifyContent={btnAlignment}
            css={{ width: "100%", height: "72px", padding: "0 $12" }}
            gap="$4"
          >
            <Button
              color="default"
              size="lg"
              onClick={() => setDialogOpen(false)}
              css={{ flexGrow: btnAlignment === "center" ? 1 : null }}
            >
              {destructionBtnText}
            </Button>
            <Button
              size="lg"
              css={{ flexGrow: btnAlignment === "center" ? 1 : null }}
              onClick={handleCustomAction}
              {...successBtnProps}
            >
              {successBtnText}
            </Button>
          </Flex>
        </Flex>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
