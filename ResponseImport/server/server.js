const { getSubmissionObject } = require("./helpers/submission");
const { getContactPropertyObject } = require("./helpers/contactSubmission");

const getSubmissionMetaData = ({curRow, mappings}) => {
  const metaData = {};
  Object.keys(mappings).forEach((mapping) => {
    if(curRow[mapping]?.trim()){
      if(mappings[mapping] === 'tags') {
        const tags = curRow[mapping].split(",").map(item => item.trim()).filter(item => item !== "");
        if(tags.length > 0) {
          metaData[mappings[mapping]] = tags;
        }
      }
      else if (mappings[mapping] === 'date_time') {
        metaData[mappings[mapping]] = new Date(curRow[mapping]);
      }
      else {
        metaData[mappings[mapping]] = curRow[mapping];
      }
    }
  });
  if(Object.keys(metaData).length>0) {
    return metaData;
  }
  else return null;
}

const getSubmissionVariables = ({curRow, mappings}) => {
  const variablesData = {};
  Object.keys(mappings).forEach((mapping) => {
    if(curRow[mapping]?.trim()){
      variablesData[mappings[mapping].name] = curRow[mapping];
    }
  });
  if(Object.keys(variablesData).length>0) {
    return variablesData;
  }
  else return null;
}

exports = {
  csvMappingHandler: async function (payload, parentLayer) {
    return importHandler(payload, parentLayer);
  },
};

const importHandler = async (payload, parentLayer) => {
  const mainPayload = payload;
  if(mainPayload.data?.functionName === "urlToDownload"){
        return errorURL($Status, mainPayload.data);
    }
  const function1 = async (payload) => {
    try {
      await $Next.call(payload, "function2", parentLayer);
      return { status: 200 };
    } catch (error) {
      console.log('Error in function1', error);
      throw error;
    }
  };

  const function2 = async (payload) => {
    try {
      const payloadTemporary = { payload: payload.payload, iparams: payload?.appConfig?.extraPayload?.parentLayerConfigObject.iparams };
       const token = mainPayload.iparams.surveysparrow_api_key;
         const url = `${process.env.apiUrl}/v3/channels`;
         const channelPayload={
          "type": "LINK",
          "survey_id": payloadTemporary.payload.data.payload.surveyId,
          "name": "Import response",
          "accept_anonymous_response": false,
          }
         
          var config = {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            }
          };
        const createdChannel = await $Fetch.post(url, channelPayload, config);
      const results = await $File.read(payloadTemporary.payload.data.payload.key, true, payload.traceId);
      
        let batchSize =20;
        if(results.length <=20){
            batchSize = results.length;
        }


      const submissionPayload = [];
      let curRowNumber = 1;

      const isContactPropertyAvailable = Object.keys(payloadTemporary.payload.data.payload.contactPropertiesPayload).length > 0;
      
      for (let i = 0; i < results.length; i++) {
        if (curRowNumber <= 0) {
          curRowNumber += 1;
          continue;
        }
        const curRow = results[i];
        const questions = {};
        questions[curRowNumber] = {};
        Object.keys(curRow).map((key) => {
          const trimmedKey = key.trim();
          if (payloadTemporary.payload.data.payload.acceptedFields.includes(trimmedKey)) {
            questions[curRowNumber][trimmedKey] = curRow[key];
          }
        });
        const key = curRowNumber;
        const answers = questions[curRowNumber];

        let contactPropertiesPayload;
        if (isContactPropertyAvailable) {
          contactPropertiesPayload = getContactPropertyObject({
            curRow,
            contactMapping: payloadTemporary.payload.data.payload.contactPropertiesPayload
          });
        }

        const surveySparrowSubmissionAnswerPayload = getSubmissionObject({
          answers,
          mappings: payloadTemporary.payload.data.payload.surveyMapping,
          timeZone: payloadTemporary.payload.data.payload.timeZone,
        });
        
        const submissionMetaData = getSubmissionMetaData({
          curRow,
          mappings: payloadTemporary.payload.data.payload.responsePropertiesPayload
        });

        const submissionVariables = getSubmissionVariables({
          curRow,
          mappings: payloadTemporary.payload.data.payload.variablesPayload
        });
        
        let payloadData = {
          survey_id: payloadTemporary.payload.data.payload.surveyId,
          channel_id: createdChannel.data.data.id,
          answers: surveySparrowSubmissionAnswerPayload,
          trigger_workflow: false
        };
        
        if(submissionMetaData) {
          payloadData = {
            ...payloadData,
            meta_data: submissionMetaData
          }
        }
        if(submissionVariables) {
          payloadData = {
            ...payloadData,
            variables: submissionVariables,
          }
        }
        
        const parsedSubmission = {
          payload: payloadData,
          contactsPayload: contactPropertiesPayload,
          row_number: key,
        };
        submissionPayload.push(parsedSubmission);
        curRowNumber += 1;
      }
      let batch=0;
      for (let i = 0; i < submissionPayload.length;) {
        const chunkedData = submissionPayload.slice(i, i + batchSize);
        const formattedPayload = { chunkedData, isContactPropertyAvailable, surveyType: payloadTemporary.payload.data.payload.surveyType, batch };
        await $Next.call(formattedPayload, "function3", parentLayer);
        i = i + batchSize;
        batch++;
      }
      return { status: 200 };
    } catch (error) {
      console.log('Error while chunking in function2', error);
      throw error;
    }
  };

  const function3 = async (payload) => {
    const axios = require('axios');
    const token = mainPayload.iparams.surveysparrow_api_key;
    const responses = payload.payload.data.chunkedData;
    const isContactPropertyAvailable = payload.payload.data.isContactPropertyAvailable;
    const surveyType = payload.payload.data.surveyType;
    const batch = payload.payload.data.batch;
    const traceId = payload.traceId;
    try {
      const url = `${process.env.apiUrl}/v3/responses`;
      var config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      };
      
      const contactUrl = `${process.env.apiUrl}/v3/contacts`;
      if (isContactPropertyAvailable) {
        if(surveyType === "ClassicForm" || surveyType === "Conversational") {
          await Promise.all(responses.map(async (item, index) => {
            let contact;
            try{
              contact = await axios.post(contactUrl, item.contactsPayload, config);
            }
            catch(error) {
              contact = error;
            }
            
            if(contact.status === 200) {
              item.payload.contact_id = contact.data.data.id;
              const result = await $Fetch.post(url, item.payload, config);
              let j = index + 1;
              await $Status.status(result, j, batch, traceId);
            }
            else {
              if(parseInt(contact.response.status) === 409) {
                const contactIdMatch = contact.response.data.message.match(/Contact id - (\d+)/);
                const contactId = contactIdMatch ? contactIdMatch[1] : null;
                item.payload.contact_id = parseInt(contactId);
                const result = await $Fetch.post(url, item.payload, config);
                let j = index + 1;
                await $Status.status(result, j, batch, traceId);
              }
              else {
                const result = await $Fetch.post(url, item.payload, config);
                let j = index + 1;
                await $Status.status(result, j, batch, traceId);
              }
            }
          }));
        }
        else {
          await Promise.all(responses.map(async (item, index) => {
            let contact;
            try{
              contact = await axios.post(contactUrl, item.contactsPayload, config);
            }
            catch(error) {
              contact = error;
            }
            if(contact.status === 200) {
              item.payload.contact_id = contact.data.data.id;
              const result = await $Fetch.post(url, item.payload, config);
              let j = index + 1;
              await $Status.status(result, j, batch, traceId);
            }
            else {
              if(parseInt(contact.response.status) === 409) {
                const contactIdMatch = contact.response.data.message.match(/Contact id - (\d+)/);
                const contactId = contactIdMatch ? contactIdMatch[1] : null;
                item.payload.contact_id = parseInt(contactId);
                const result = await $Fetch.post(url, item.payload, config);
                let j = index + 1;
                await $Status.status(result, j, batch, traceId);
              }
              else {
                let j = index + 1;
                await $Status.status(contact, j, batch, traceId);
              }
            }
          }));
        }
      }
      else {
        if((surveyType === "ClassicForm" || surveyType === "Conversational")) {
          await Promise.all(responses.map(async (item, index) => {
            const result = await $Fetch.post(url, item.payload, config);
            let j = index + 1;
            await $Status.status(result, j, batch, traceId);
          }));
        }
        else {
          console.log('Contact property are mandatory for Cx survyes');
        }
      }
      return { status: 200 };
    } catch (error) {
      console.log(
        "Error while creating response",
        error
      );
      throw error;
    }
  };
  return (await $Batch.initialize(function1, function2, function3, parentLayer));
};

const errorURL = async ($Status, payload) => {
    const url = await $Status.getErrorURL(payload.key);
      if(url?.message){
        return {data: {"message": url.message}};
    }
    return {data: url};
}