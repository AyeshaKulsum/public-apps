import React from "react";
import {
  Button,
  Flex,
  Grid,
  Text,
  Select,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@sparrowengg/twigs-react";
import { EmailShare, SMSShare, WhatsAppShare } from "../../icons";
import {
  pref1Durations,
  otherPrefDurations,
  scheduleTypes,
  channelTypes
} from "../../constants";
import { ChevronDownIcon } from "@sparrowengg/twigs-react-icons";

const CustomDropdownMenu = ({
  options,
  schedule,
  setSchedule,
  schedulingType,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild css={{ display: "inline-flex" }}>
        <Flex
          alignItems="center"
          css={{
            cursor: "pointer",
            padding: "$2 $1 $2 $2",
            margin: "0 $1",
            borderRadius: "$lg",
            "&:hover": { backgroundColor: "$primary50" },
          }}
        >
          <Text size="md" weight="medium" css={{ color: "$primary500" }}>
            {schedule[schedulingType].label}
          </Text>
          <ChevronDownIcon size={24} strokeWidth={2} color="#4A9CA6" />
        </Flex>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        css={{ minWidth: "168px", height: "176px", overflow: "auto" }}
        align="start"
      >
        {options?.map((item) => {
          return (
            <DropdownMenuItem
              key={item.id}
              onClick={() =>
                setSchedule((prev) => ({ ...prev, [schedulingType]: item }))
              }
              css={{ cursor: "pointer" }}
            >
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const CustomSharesMenu = ({ icon, value, options , selectedChannels, setSelectedChannels }) => {
  return (
    <Grid
      templateColumns="50% 50%"
      css={{
        borderBottom: "$borderWidths$xs solid $neutral200",
        padding: "$10 $6",
        color: "$neutral900",
        alignItems: "center",
      }}
    >
      <Flex alignItems="center" gap="$4">
        {icon}
        <Text size="md" weight="medium">
          {value}
        </Text>
      </Flex>
      <Select
        placeholder={`Choose ${value} Share`}
        size="lg"
        css={{
          ".twigs-select__control": {
            borderRadius: "$xl",
            ".twigs-select__value-container, & .twigs-select__placeholder": {
              fontSize: "$sm",
            },
          },
        }}
        options={options}
        value={selectedChannels[value] }
        onChange={(e) => setSelectedChannels((prev) => ({ ...prev, [value]: e }))}
      />
    </Grid>
  );
};

const Configure = ({ emailChannels, smsChannels, whatsappChannels, schedule, setSchedule, selectedChannels, setSelectedChannels }) => {

  return (
    <Flex css={{ width: "100%" }} justifyContent="center">
      <Flex css={{ width: "680px" }} flexDirection="column">
        <Flex flexDirection="column" gap="$4" css={{ marginBottom: "$12" }}>
          <Text weight="bold" css={{ color: "$neutral900", fontSize: "$xl" }}>
            Choose Channel
          </Text>
          <Text size="md" css={{ color: "$neutral800" }}>
            Here are all the preferred shares from the contact list you picked.
            Now, choose the channels.
          </Text>
        </Flex>
        <Grid
          templateColumns="50% 50%"
          css={{
            borderBottom: "$borderWidths$xs solid $neutral200",
            padding: "$6",
            color: "$neutral900",
            alignItems: "center",
          }}
        >
          <Text weight="medium">All Preference</Text>
          <Text weight="medium">Shares</Text>
        </Grid>
        <CustomSharesMenu
          icon={<EmailShare />}
          value={channelTypes.EMAIL.value}
          options={emailChannels}
          selectedChannels={selectedChannels}
          setSelectedChannels={setSelectedChannels}
        />
        <CustomSharesMenu
          icon={<SMSShare />}
          value={channelTypes.SMS.value}
          options={smsChannels}
          selectedChannels={selectedChannels}
          setSelectedChannels={setSelectedChannels}
        />
        <CustomSharesMenu
          icon={<WhatsAppShare />}
          value={channelTypes.WHATSAPP.value}
          options={whatsappChannels}
          selectedChannels={selectedChannels}
          setSelectedChannels={setSelectedChannels}
        />
        <Flex
          flexDirection="column"
          gap="$8"
          css={{
            marginTop: "$20",
          }}
        >
          <Text weight="bold" css={{ color: "$neutral900", fontSize: "$xl" }}>
            Scheduling
          </Text>
          <Text size="md" css={{ color: "$neutral800", display: "inline" }}>
            Send survey to Preference 1
            {schedule.schedule1.value !== "now" && ' in'}
            <CustomDropdownMenu
              options={pref1Durations}
              schedule={schedule}
              setSchedule={setSchedule}
              schedulingType={scheduleTypes.schedule1.name}
            />
            , if not responded send survey through Preference 2 in
            <CustomDropdownMenu
              options={otherPrefDurations}
              schedule={schedule}
              setSchedule={setSchedule}
              schedulingType={scheduleTypes.schedule2.name}
            />
            , if not responded send survey through Preference 3 in
            <CustomDropdownMenu
              options={otherPrefDurations}
              schedule={schedule}
              setSchedule={setSchedule}
              schedulingType={scheduleTypes.schedule3.name}
            />
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Configure;
