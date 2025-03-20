import React from "react";
import { Button, Flex, IconButton, Text, toast, Tooltip } from "@sparrowengg/twigs-react";
import { ForwardArrow } from "../../icons";
import { ChevronRightIcon, ArrowLeftIcon } from "@sparrowengg/twigs-react-icons";

const Header = ({ router, setRouter, isConfigurable, buttonLoader, isSchedulable, setOpenDialog }) => {

  const navigateToConfigure = () => {
    isConfigurable
      ? setRouter("Configure")
      : toast({
          variant: "error",
          title: "Error",
          description: "Choose atleast one contact list to configure",
        });
  };

  return (
    <Flex
      css={{
        width: "100%",
        background: "white",
        height: "72px",
        position: "sticky",
        top: "0px",
        borderBottom: "$borderWidths$xs solid $neutral200",
        marginBottom: "$40",
        padding: "0 $12",
      }}
      alignItems="center"
    >
      <Flex
        css={{ width: "100%" }}
        alignItems="center"
        justifyContent="space-between"
      >
        <IconButton
          icon={<ArrowLeftIcon strokeWidth={2} />}
          size="lg"
          color="default"
          onClick={() => {
            setRouter("Listing");
          }}
        />
        <Flex alignItems="center" justifyContent="center" gap="$10">
          <Text
            size="md"
            css={{
              color:
                router === "ChooseContactList" ? "$black900" : "$neutral800",
              cursor: "pointer",
            }}
            weight={router === "ChooseContactList" ? "bold" : "medium"}
            onClick={() => setRouter("ChooseContactList")}
          >
            Choose List
          </Text>
          <ForwardArrow />
          <Text
            size="md"
            css={{
              color: router === "Configure" ? "$black900" : "$neutral800",
              cursor: "pointer",
            }}
            weight={router === "Configure" ? "bold" : "medium"}
            onClick={() => {
              navigateToConfigure();
            }}
          >
            Configure
          </Text>
        </Flex>
        {router === "ChooseContactList" ? (
          <Tooltip
            side="bottom"
            content={
              isConfigurable
                ? ""
                : "Choose atleast one contact list to configure"
            }
          >
            <Button
              size="lg"
              rightIcon={<ChevronRightIcon />}
              css={{ svg: { path: { strokeWidth: "2.5" } } }}
              disabled={!isConfigurable}
              onClick={()=>navigateToConfigure()}
            >
              {"Next, Configure"}
            </Button>
          </Tooltip>
        ) : (
          <Tooltip
          side="bottom"
          content={
            isSchedulable
              ? ""
              : "Choose all preference channels to save schedule"
          }
        >
          <Button
            size="lg"
            css={{ svg: { path: { strokeWidth: "2.5" } } }}
            disabled={buttonLoader || !isSchedulable}
            loading={buttonLoader}
            onClick={() => setOpenDialog(true)}
          >
            Save Schedule
          </Button>
          </Tooltip>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;
