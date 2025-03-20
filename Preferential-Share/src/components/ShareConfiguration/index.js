import React, { useEffect, useState } from "react";
import Header from "./Header";
import Configure from "./Configure";
import ChooseContactList from "./ChooseContactList";
import {
  v3ApisBaseUrl,
  requestConfig,
  channelTypes,
  scheduleTypes,
  pref1Durations,
  otherPrefDurations,
  defaultPreferences,
} from "../../constants";
import CircleLoader from "../HelperComponents/CircleLoader";
import { Flex, toast } from "@sparrowengg/twigs-react";
import Listing from "./Listing";
import SaveDialog from "./utils/SaveDialog";
const defaultSchedule = {
  [scheduleTypes.schedule1.name]: pref1Durations[0],
  [scheduleTypes.schedule2.name]: otherPrefDurations[0],
  [scheduleTypes.schedule3.name]: otherPrefDurations[0],
};
const defaultChannelsSelected = {
  [channelTypes.EMAIL.value]: false,
  [channelTypes.SMS.value]: false,
  [channelTypes.WHATSAPP.value]: false,
};
const ShareConfiguration = ({ client }) => {
  const [contactList, setContactList] = useState([]);
  const [isAllContacts, setIsAllContacts] = useState(false);
  const [router, setRouter] = useState("");
  const [loader, setLoader] = useState(true);
  const [isConfigurable, setIsConfigurable] = useState(false);
  const [emailChannels, setEmailChannels] = useState(null);
  const [smsChannels, setSmsChannels] = useState(null);
  const [whatsappChannels, setWhatsappChannels] = useState(null);
  const [surveyId, setSurveyId] = useState(null);
  const [schedule, setSchedule] = useState(defaultSchedule);
  const [selectedChannels, setSelectedChannels] = useState(
    defaultChannelsSelected,
  );
  const [buttonLoader, setButtonLoader] = useState(false);
  const [isSchedulable, setIsSchedulable] = useState(false);
  const [schedulesData, setSchedulesData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [scheduleName, setScheduleName] = useState("");
  const [allTakenNames, setAllTakenNames] = useState([]);


  const channelTypesWithState = {
    [channelTypes.EMAIL.label]: {
      ...channelTypes.EMAIL,
      function: setEmailChannels,
    },
    [channelTypes.SMS.label]: {
      ...channelTypes.SMS,
      function: setSmsChannels,
    },
    [channelTypes.WHATSAPP.label]: {
      ...channelTypes.WHATSAPP,
      function: setWhatsappChannels,
    },
  };


  useEffect(() => {
    if(router === 'Listing'){
      setContactList(contactList?.map((item) => ({ ...item, isChecked: false })));
      setSchedule(defaultSchedule);
      setSelectedChannels(defaultChannelsSelected);
      setScheduleName("");
    }
  }, [router])

  useEffect(() => {
    fetchAllRequiredData();
  }, []);

  useEffect(() => {
    setIsSchedulable(
      !Object.values(selectedChannels).some((item) => item === false),
    );
  }, [selectedChannels]);

  const saveScheduleDataToDB = async (data) => {
    const surveyId = await client.data.get("getSurveyId");
    const result = await client.db.getV2(`shares_pref_${surveyId}`);
    const shares = result ? JSON.parse(result) : [];
    await client.db.setV2(`shares_pref_${surveyId}`, [data, ...shares]);
  }

  const saveNameToDB = async (name) => {
    const result = await client.db.getV2(`allTakenNames`);
    const allTakenNames = result ? JSON.parse(result) : [];
    await client.db.setV2(`allTakenNames`, [name, ...allTakenNames]);
  }

  const fetchAllRequiredData = async () => {
    try {
      await fetchAllContactListsOfAccount();
      await fetchSurveyDetails();
      const surveyId = await client.data.get("getSurveyId");
      const result = await client.db.getV2(`shares_pref_${surveyId}`);
      const shares = result ? JSON.parse(result) : [];
      const result2 = await client.db.getV2(`allTakenNames`);
      const allTakenNames = result2 ? JSON.parse(result2) : [];
      setAllTakenNames(allTakenNames);
      setSchedulesData(shares);
      setRouter("Listing");
      setLoader(false);
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  const fetchSurveyDetails = async () => {
    try {
      const surveyId = await client.data.get("getSurveyId");
      setSurveyId(surveyId);
      const promises = Object.keys(channelTypes).map(async (key) => {
        return await fetchAllChannelsOfChannelType({ surveyId, type: key });
      });
      await Promise.all(promises);
      setLoader(false);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchAllChannelsOfChannelType = async ({ surveyId, type }) => {
    const { function: setChannels } = channelTypesWithState[type];
    try {
      let hasNextPage = true,
        page = 1,
        channels = [];
      while (hasNextPage) {
        const result = await client.request.get(
          `${v3ApisBaseUrl}channels?survey_id=${surveyId}&limit=100&page=${page}&type=${type}`,
          requestConfig,
        );
        if (!result) break;
        const data = await JSON.parse(result)?.body?.data;
        const structuredData = data.map((item) => {
          return {
            label: item.name,
            value: item.id,
            ...item,
          };
        });
        channels = [...channels, ...structuredData];
        page++;
        hasNextPage = JSON.parse(result)?.body?.has_next_page;
      }
      setChannels(channels.filter((channel) => channel.status === "ACTIVE"));
    } catch (e) {
      console.log(e);
      setChannels([]);
    }
  };

  const fetchAllContactListsOfAccount = async () => {
    try {
      const result = await client.request.get(
        `${v3ApisBaseUrl}contact_lists`,
        requestConfig,
      );
      const data = JSON.parse(result)?.body?.data;
      const structuredContactList = data.map((item) => {
        return {
          label: item.name,
          isChecked: false,
          ...item,
        };
      });
      setContactList(structuredContactList);
    } catch (e) {
      console.log(e);
      setContactList([]);
    }
  };

  const handleSaveSchedule = async () => {
    try {
      setButtonLoader(true);
      const preferences = await client.db.get("sharePreferences");
      const parsedPreferences = preferences
        ? JSON.parse(preferences)
        : defaultPreferences;
      const createdSchedule = await client.request.invoke("createSchedule", {
        preferences: parsedPreferences,
        schedule,
        selectedChannels: Object.keys(selectedChannels).reduce((acc, key) => {
          acc[key] = {
            id: selectedChannels[key].id,
            name: selectedChannels[key].name,
            type: selectedChannels[key].type,
          };
          return acc;
        }, {}),
        surveyId,
        isAllContacts,
        contactListIds: contactList
          .filter((item) => item.isChecked)
          .map((item) => item.id),
      });
      const jsonResult = JSON.parse(createdSchedule);
      if (jsonResult.body.data.status !== 200) {
          throw new Error("Failed to Save Schedule");
      }
      const data = {
        id: Math.random().toString(36).substring(2, 10),
        scheduleName,
        schedule,
        preferences: parsedPreferences,
        selectedChannels,
        contactList,
        isAllContacts,
      }
      await saveScheduleDataToDB(data);
      await saveNameToDB(scheduleName);
      setSchedulesData((prev) => [...prev, data]);
      setContactList(contactList.map((item) => ({ ...item, isChecked: false })));
      setSchedule(defaultSchedule);
      setSelectedChannels(defaultChannelsSelected);
      setScheduleName("");
      setButtonLoader(false);
      setOpenDialog(false);
      setRouter("Listing");
      toast({
        title: "Schedule Saved Successfully",
        variant: "default",
      });
    } catch (e) {
      console.log(e);
      setContactList(
        contactList.map((item) => ({ ...item, isChecked: false })),
      );
      setButtonLoader(false);
      setRouter("ChooseContactList");
      toast({
        title: "Failed to Save Schedule",
        variant: "error",
        description: "Please try again",
      });
    }
  };

  return (
    <>
      {loader ? (
        <Flex
          alignItems="center"
          justifyContent="center"
          css={{ width: "100%", height: "100vh" }}
        >
          <CircleLoader />
        </Flex>
      ) : (
        <>
          {router && router !== "Listing" && (
            <Header
              router={router}
              setRouter={setRouter}
              isConfigurable={isConfigurable}
              buttonLoader={buttonLoader}
              isSchedulable={isSchedulable}
              setOpenDialog={setOpenDialog}
            />
          )}
          {router === "ChooseContactList" && (
            <ChooseContactList
              contactList={contactList}
              setContactList={setContactList}
              isAllContacts={isAllContacts}
              setIsAllContacts={setIsAllContacts}
              setIsConfigurable={setIsConfigurable}
            />
          )}
          {router === "Configure" && (
            <Configure
              emailChannels={emailChannels}
              smsChannels={smsChannels}
              whatsappChannels={whatsappChannels}
              schedule={schedule}
              setSchedule={setSchedule}
              selectedChannels={selectedChannels}
              setSelectedChannels={setSelectedChannels}
            />
          )}
          {router === "Listing" && (
            <Listing
              schedulesData={schedulesData}
              router={router}
              setRouter={setRouter}
              client={client}
              setSchedulesData={setSchedulesData}
            />
          )}
          {openDialog && (
            <SaveDialog
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
              scheduleName={scheduleName}
              setScheduleName={setScheduleName}
              handleSaveSchedule={handleSaveSchedule}
              buttonLoader={buttonLoader}
              allTakenNames={allTakenNames}
            />
          )}
        </>
      )}
    </>
  );
};
export default ShareConfiguration;
