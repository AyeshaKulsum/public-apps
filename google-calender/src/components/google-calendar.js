import {
  Box,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Flex
} from "@sparrowengg/twigs-react";
import React from "react";
import AddEvents from "./add-events";
import EventsList from "./events-list";
import { useForm } from "react-hook-form";
import { calendarConstants } from "../commons/constants";
import dayjs from "dayjs";

const eventDetails  = {
  summary: "",
  description: "",
  start: dayjs().add(1, 'hour').toISOString(),
  end: dayjs().add(2, 'hour').toISOString(),
  location: "",
  attendees: []
};

const GoogleCalendar = ({ client }) => {
  const { register, reset, handleSubmit, setValue, getValues ,formState: { errors } } = useForm({ defaultValues: eventDetails });
  const resetEventDetails = () => reset(eventDetails);
  const { eventTabs } = calendarConstants;
  return (
    <Box css={{ paddingBlock: "$6" }}>
      <Tabs defaultValue={eventTabs.ADD_EVENT}>
        <Flex justifyContent="center" css={{ borderBottom: "$borderWidths$xs solid $neutral200" }}>
          <TabsList>
            <TabsTrigger value={eventTabs.ADD_EVENT}> ADD EVENT </TabsTrigger>
            <TabsTrigger value={eventTabs.LIST_EVENT} onClick={() => resetEventDetails()}> LIST OF EVENTS </TabsTrigger>
          </TabsList>
        </Flex>
        <TabsContent value={eventTabs.ADD_EVENT}>
          <AddEvents register={register} errors={errors} handleSubmit={handleSubmit} setValue={setValue} getValues={getValues} resetEventDetails={resetEventDetails} client={client} />
        </TabsContent>
        <TabsContent value={eventTabs.LIST_EVENT}>
          <EventsList client={client} />
        </TabsContent>
      </Tabs>
    </Box>
  );
};

export default GoogleCalendar;
