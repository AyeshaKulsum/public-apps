const v3ApisBaseUrl = `https://api.surveysparrow.com/v3/`;
const config = {
  headers: {
    Authorization: `Bearer <%=iparams.surveysparrow_api_key%>`,
    "Content-Type": "application/json",
  },
};

exports = {
  onScheduledEvent: async function (args) {
    await handleScheduledEvent(args);
  },
  onSubmissionComplete: async function (args) {
    console.log("Submission Complete Triggered", JSON.stringify(args));
    try {
      const surveyId = args.data.survey.id;
      const allContacts = await $Storage.getV2(`${surveyId}`) || [];
      const contactId = args.data.contact?.id;
      if (contactId) {
        const data = {
          surveyId,
          contactId,
          channelId: args.data.channel.id
        }
        allContacts.push(data);
        await $Storage.setV2(`${surveyId}`, allContacts);
      }
      console.log('🤓');
    } catch (error) {

    }
  },
  onChannelUpdate: async function () {
    // console.log("Submission Complete Triggered", JSON.stringify(args));
    try {
      console.log('🤓');
    } catch (error) {

    }
  },
  onCXChannelUpdate: async function () {
    // console.log("NPS Submission Complete Triggered", JSON.stringify(args));
    try {
      console.log('🤓');
    } catch (error) {

    }
  },
  createSchedule: async function (args) {
    return await createSchedule(args);
  },
};

const handleScheduledEvent = async (args) => {
  try {
    const {
      preferences,
      selectedChannels,
      surveyId,
      contactListIds,
      preferenceIndex,
      config,
    } = args.data;
    console.log('In Handle Schedule Event', JSON.stringify(args.data));
    await triggerSurveyShare({
      surveyId,
      config,
      channelId: selectedChannels[preferences[preferenceIndex].value].id,
      contactListIds,
      preferenceType: preferences[preferenceIndex].value,
      triggeredChannelsId: Object.keys(preferences).filter((pref) => pref < preferenceIndex).map((pref) => selectedChannels[preferences[pref].value].id)
    });
    if (preferenceIndex < 2) {
      await scheduleSurveyShare({
        ...args.data,
        preferenceIndex: preferenceIndex + 1,
      });
    }
  } catch (e) {
    console.log(e);
  }
};

const createSchedule = async (args) => {
  try {
    const payload = args.data;
    var config = {
      headers: {
        Authorization: `Bearer <%=iparams.surveysparrow_api_key%>`,
        "Content-Type": "application/json",
      },
    };

    const {
      preferences,
      schedule,
      selectedChannels,
      surveyId,
      isAllContacts,
      contactListIds,
    } = payload;
    let preferenceIndex = 0;
    if (schedule.schedule1.value === "now") {
      await triggerSurveyShare({
        surveyId,
        config,
        triggeredChannelsId: [],
        channelId: selectedChannels[preferences[preferenceIndex].value].id,
        isAllContacts,
        contactListIds,
        preferenceType: preferences[preferenceIndex].value,
      });
      preferenceIndex++;
    }
    await scheduleSurveyShare({
      ...payload,
      config,
      preferenceIndex: preferenceIndex,
    });
    return {
      data: {
        status: 200,
        message: "Schedule Created Successfully",
      },
    };
  } catch (e) {
    console.log(e);
    return {
      data: {
        status: 500,
        message: "Failed to Create Schedule",
      },
    };
  }
};

const triggerSurveyShare = async ({
  surveyId,
  config,
  channelId,
  triggeredChannelsId,
  isAllContacts,
  contactListIds,
  preferenceType,
}) => {
  try {
    const fetchUrl = `${v3ApisBaseUrl}channels/${channelId}`;
    let contacts = [];
    if(isAllContacts){
      contacts = await fetchAllContacts();
    }
    else{
      for (let i = 0; i < contactListIds.length; i++) {
        contacts = [
          ...contacts,
          ...(await fetchAllContactsOfContactList({
            contactListId: contactListIds[i],
            config,
          })),
        ];
      }
    }

    const allContacts = await $Storage.getV2(`${surveyId}`) || [];
    const allTriggeredContacts = allContacts.filter((contact) => triggeredChannelsId.includes(contact.channelId));

    contacts = contacts.filter((con) => !allTriggeredContacts.includes(con.id));
    if (preferenceType === "Email") {
      contacts = contacts.map((contact) => {
        if (contact.email) {
          return {
            email: contact.email,
          };
        }
      }).filter(element => element !== undefined);
    } else {
      contacts = contacts.map((contact) => {
        if (contact.mobile) {
          return {
            mobile: contact.mobile,
          };
        }
      }).filter(element => element !== undefined);
    }

    const payload = {
      survey_id: surveyId,
      contacts,
    };
    if(preferenceType === "Sms"){
      payload['sms'] = {
        "twilio_consent_agreed": true
      }
    }
    console.log("PAYLOAD", JSON.stringify(payload), fetchUrl);
    if (contacts.length > 0) {
      const result = await $Fetch.put(fetchUrl, payload, config);
      if (result.status !== 200) {
        console.log("Failed to Share Survey for preferenceType: ${preferenceType} with channelId: ${channelId} and surveyId: ${surveyId}");
      } else {
        console.log(
          `Survey Shared Successfully for preferenceType: ${preferenceType} with channelId: ${channelId} and surveyId: ${surveyId}`
        );
      }
    }
    else {
      console.log(`No contacts for preferenceType: ${preferenceType} with channelId: ${channelId} and surveyId: ${surveyId}`)
    }
  } catch (e) {
    throw e;
  }
};

const fetchAllContactsOfContactList = async ({ contactListId, config }) => {
  try {
    let currentContacts = [];
    let hasNextPage = true;
    let page = 1;
    while (hasNextPage) {
      const fetchUrl = `${v3ApisBaseUrl}contacts?contact_list_id=${contactListId}&limit=50&page=${page}`;
      const contacts = await $Fetch.get(fetchUrl, config);
      if (contacts.status !== 200) {
        throw new Error("Failed to Fetch Contacts");
      }
      currentContacts = [...currentContacts, ...contacts.data.data];
      hasNextPage = contacts.data.has_next_page;
      page++;
    }
    return currentContacts;
  } catch (e) {
    throw e;
  }
};

const fetchAllContacts = async () => {
  try {
    let currentContacts = [];
    let hasNextPage = true;
    let page = 1;
    while (hasNextPage) {
      const fetchUrl = `${v3ApisBaseUrl}contacts?limit=50&page=${page}`;
      const contacts = await $Fetch.get(fetchUrl, config);
      if (contacts.status !== 200) {
        throw new Error("Failed to Fetch Contacts");
      }
      currentContacts = [...currentContacts, ...contacts.data.data];
      hasNextPage = contacts.data.has_next_page;
      page++;
    }
    return currentContacts;
  } catch (e) {
    throw e;
  }
}

const generateUniqueId = async () => {
  const { v4: uuidv4 } = await require('uuid');
  return uuidv4().replace(/-/g, '').substring(0, 10);
}

const scheduleSurveyShare = async (data) => {
  try {
    const { schedule, preferenceIndex, preferences, surveyId } = data;
    const scheduleTime =
      schedule[`schedule${preferenceIndex + 1}`].label.split(" ")[0];
    const scheduleAt = new Date(
      new Date().getTime() + Number(scheduleTime) * 60 * 1000
    ).toISOString();
    const generatedUUID = await generateUniqueId();
    const scheduleName = `${preferences[preferenceIndex].value}_${surveyId}_${generatedUUID}`;
    const result = await $Schedule.create({
      name: scheduleName,
      data: data,
      schedule_at: scheduleAt,
    });
    console.log(
      `${scheduleName} Schedule Created Successfully`,
      result
    );
  } catch (e) {
    throw e;
  }
};
