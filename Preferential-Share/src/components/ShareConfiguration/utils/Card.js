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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@sparrowengg/twigs-react";
import {
  ChevronRightIcon,
  EllipsisVerticalIcon,
  DeleteIcon,
} from "@sparrowengg/twigs-react-icons";
import { EmailShare, SMSShare, WhatsAppShare } from "../../../icons";

const CustomView = ({ label, icon, schedule }) => {
  return (
    <Flex alignItems="center" gap="$4">
      {icon}
      <Text css={{ color: "$neutral600" }}>-</Text>
      <Text weight="medium" css={{ color: "$neutral800" }}>
        {label}
      </Text>
      <Text css={{ color: "$neutral600" }}>
        {schedule?.value !== "now" ? "after " : " "}
        <Text as="span" weight="medium" css={{ color: "$neutral800" }}>
          {schedule?.label}
        </Text>
      </Text>
    </Flex>
  );
};

const renderCustomView = (label, selectedChannels, schedule) => {
  switch (label) {
    case "Email":
      return (
        <CustomView
          label={selectedChannels?.Email?.label}
          icon={<EmailShare />}
          schedule={schedule}
        />
      );
    case "Sms":
      return (
        <CustomView
          label={selectedChannels?.Sms?.label}
          icon={<SMSShare />}
          schedule={schedule}
        />
      );
    case "WhatsApp":
      return (
        <CustomView
          label={selectedChannels?.WhatsApp?.label}
          icon={<WhatsAppShare />}
          schedule={schedule}
        />
      );
    default:
      return null;
  }
};

const Card = ({ item, accordionOpen, openAlertDialog, setOpenAlertDialog }) => {
  const {
    id,
    scheduleName,
    contactList,
    selectedChannels,
    schedule,
    preferences,
    isAllContacts,
  } = item;
  const selectedContactList = isAllContacts
    ? "All Contacts"
    : contactList
      ?.filter((contact) => contact?.isChecked)
      ?.map((contact) => contact?.name)
      ?.join(", ");

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
              <Text weight="bold" size="md" css={{ color: "$neutral900" }}>
                {scheduleName}
              </Text>
            </Flex>
            <Flex alignItems="center" gap="$4">
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
                  <DropdownMenuItem css={{ cursor: "pointer" }} onClick={() => setOpenAlertDialog({ ...openAlertDialog, [id]: true })}>
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
                CONTACT LIST
              </Text>
              <Text css={{ color: "$neutral800" }} truncate>
                {selectedContactList}
              </Text>
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
              <Text weight="bold" css={{ color: "$neutral900" }}>
                SCHEDULE
              </Text>
              <Flex flexDirection="column" gap="$4">
                {
                  Object?.values(preferences)?.map((item, index)=>renderCustomView(item?.value, selectedChannels, schedule?.[`schedule${index+1}`]))
                }
              </Flex>
            </Flex>
          </Flex>
        </AccordionContent>
      </AccordionItem>
    </>
  );
};

export default Card;
