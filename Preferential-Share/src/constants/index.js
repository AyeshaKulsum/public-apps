const otherPrefDurations = [
  { id: 2, label: "5 minutes", value: "5minutes" },
  { id: 3, label: "10 minutes", value: "10minutes" },
  { id: 4, label: "15 minutes", value: "15minutes" },
  { id: 5, label: "20 minutes", value: "20minutes" },
  { id: 5, label: "30 minutes", value: "30minutes" },
  { id: 6, label: "45 minutes", value: "45minutes" },
  { id: 7, label: "60 minutes", value: "60minutes" },
];

const pref1Durations = [
  { id: 1, label: "Now", value: "now" },
  ...otherPrefDurations,
];

const v3ApisBaseUrl = `https://api.surveysparrow.com/v3/`;

const requestConfig = {
  options: {
    headers: {
      Authorization:
        "Bearer <%=iparams.surveysparrow_api_key%>",
    },
  },
};

const channelTypes = {
  EMAIL: {
    value: "Email",
    label: "EMAIL",
  },
  SMS: {
    value: "Sms",
    label: "SMS",
  },
  WHATSAPP: {
    value: "WhatsApp",
    label: "WHATSAPP",
  },
};

const scheduleTypes={
    schedule1:{
        label:"Schedule 1",
        name:"schedule1",
        referrer:"Preference 1"
    },
    schedule2:{
        label:"Schedule 2",
        name:"schedule2",
        referrer:"Preference 2"
    },
    schedule3:{
        label:"Schedule 3",
        name:"schedule3",
        referrer:"Preference 3"
    }
};

const defaultPreferences ={
    0: {
      label: "EMAIL",
      value: "Email",
    },
    1: {
      label: "SMS",
      value: "Sms",
    },
    2: {
      label: "WHATSAPP",
      value: "WhatsApp",
    },
  };

export {
  v3ApisBaseUrl,
  domain,
  requestConfig,
  channelTypes,
  pref1Durations,
  otherPrefDurations,
  scheduleTypes,
  defaultPreferences,
};
