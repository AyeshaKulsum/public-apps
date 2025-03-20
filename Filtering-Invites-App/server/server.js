const getTriggersFromDB = async () => {
  try {
    const result = await $Storage.getV2('triggers');
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}


const getTriggerConditionFromDB = async (trigger_id) => {

  try {
    const trigger = await $Storage.getV2(`filter_${trigger_id}`);
    return trigger;
  } catch (error) {
    console.log(error);
    return false;

  }

}

const domain = `https://api.surveysparrow.com`;

exports = {
  onExternalEvent: async function (args) {
    try {

      args = args.data;
      console.log("INSIDE THE EXTRNAL EVENT", JSON.stringify(args));
      const result = await getTriggersFromDB();
      console.log("TRIGGERS", JSON.stringify(result));
      if (result) {
        const data = [];
        for (const element of result) {
          if (element?.survey?.id == args["survey_id"] && element?.active) {
            const conditions = await getTriggerConditionFromDB(element?.trigger_id);
            console.log(`TRIGGER ${element.trigger_name} CONDITION`, JSON.stringify(conditions));
            if (conditions) {

              let check_condition = checkAllConditions(conditions["conditions"], args["variables"], conditions?.parentComparator?.value);
              check_condition = conditions['mainCondition'] === false ? !check_condition : check_condition;

              if (check_condition) {
                try {

                  // Filter shares based on their types
                  var email = element?.shareConfig.filter(item => item.shareType?.value === "EMAIL");
                  var whatsapp = element?.shareConfig.filter(item => item.shareType?.value === "WHATSAPP");
                  var sms = element?.shareConfig.filter(item => item.shareType?.value === "SMS");

                  //format contacts add +91 to mobile number
                  args["contacts"].forEach(contact => {
                    if (contact.mobile) {
                      contact.mobile = `+91${contact.mobile.slice(-10)}`;
                    }
                  });

                  // Filter contacts based on available email or mobile
                  var emailContacts = args["contacts"].filter(item => item.email);
                  var mobileContacts = args["contacts"].filter(item => item.mobile);

                  const results = [];

                  // Process email contacts
                  if (emailContacts.length > 0) {
                    for (const shares of email) {
                      try {
                        const result = await $Fetch.put(`${domain}/v3/channels/${shares?.shareChannel?.id}`, {
                          survey_id: args["survey_id"],
                          contacts: emailContacts,
                          variables: args["variables"]
                        }, {
                          headers: {
                            Authorization: "Bearer <%=iparams.surveysparrow_api_key%>"
                          },
                          isOAuth: false,
                          maxAttempts: 5
                        });

                        if (result.status == 200) {
                          results.push({
                            channelType: 'Email',
                            channelId: shares?.shareChannel?.id,
                            message: 'Email sent successfully!'
                          })
                        } else if (result.status == 404) {
                          results.push({
                            channelType: 'Email',
                            channelId: shares?.shareChannel?.id,
                            message: 'The channel is deleted, please update the channel in the app!'
                          })
                        }
                        else {
                          results.push({
                            channelType: 'Email',
                            channelId: shares?.shareChannel?.id,
                            message: `Failed to send Email for the survey with status ${result.status}`
                          })
                        }
                      } catch (e) {
                        results.push({
                          channelType: 'Email',
                          channelId: shares?.shareChannel?.id,
                          message: `Failed to send Email`
                        });
                        console.log("Error while sending email:", e);
                      }
                    }
                  }
                  // Process mobile contacts
                  if (mobileContacts.length > 0) {
                    for (const shares of whatsapp) {
                      try {
                        const result = await $Fetch.put(`${domain}/v3/channels/${shares?.shareChannel?.id}`, {
                          survey_id: args["survey_id"],
                          variables: args["variables"],
                          contacts: mobileContacts.map((contact) => {
                            return {
                              mobile: contact.mobile
                            }
                          })
                        }, {
                          headers: {
                            Authorization: "Bearer <%=iparams.surveysparrow_api_key%>"
                          },
                          isOAuth: false,
                          maxAttempts: 5
                        });

                        if (result.status == 200) {
                          results.push({
                            channelType: 'WhatsApp',
                            channelId: shares?.shareChannel?.id,
                            message: 'WhatsApp message sent successfully!'
                          })
                        } else if (result.status == 404) {
                          results.push({
                            channelType: 'WhatsApp',
                            channelId: shares?.shareChannel?.id,
                            message: 'The channel is deleted, please update the channel in the app!'
                          })
                        }
                        else {
                          results.push({
                            channelType: 'WhatsApp',
                            channelId: shares?.shareChannel?.id,
                            message: `Failed to send WhatsApp message for the survey with status ${result.status}`
                          })
                        }
                      } catch (e) {
                        results.push({
                          channelType: 'WhatsApp',
                          channelId: shares?.shareChannel?.id,
                          message: `Failed to send WhatsApp message`
                        });
                        console.log("Error while sending mobile contact:", e);
                      }
                    }

                    for (const shares of sms) {
                      try {
                        const result = await $Fetch.put(`${domain}/v3/channels/${shares?.shareChannel?.id}`, {
                          survey_id: args["survey_id"],
                          contacts: mobileContacts,
                          variables: args["variables"],
                          sms: {
                            twilio_consent_agreed: true
                          }
                        }, {
                          headers: {
                            Authorization: "Bearer <%=iparams.surveysparrow_api_key%>"
                          },
                          isOAuth: false,
                          maxAttempts: 5
                        });
                        if (result.status == 200) {
                          results.push({
                            channelType: 'SMS',
                            channelId: shares?.shareChannel?.id,
                            message: 'SMS message sent successfully!'
                          });
                        } else if (result.status == 404) {
                          results.push({
                            channelType: 'SMS',
                            channelId: shares?.shareChannel?.id,
                            message: 'The channel is deleted, please update the channel in the app!'
                          })
                        }
                        else {
                          results.push({
                            channelType: 'SMS',
                            channelId: shares?.shareChannel?.id,
                            message: `Failed to send SMS message for the survey with status ${result.status}`
                          })
                        }
                      } catch (e) {
                        results.push({
                          channelType: 'SMS',
                          channelId: shares?.shareChannel?.id,
                          message: `Failed to send SMS message`
                        });
                        console.log("Error while sending mobile contact:", e);
                      }
                    }
                  }
                  data.push({
                    trigger: element.trigger_name,
                    surveyId: element?.survey?.id,
                    data: results
                  });
                }
                catch (e) {
                  console.log("Error while processing contacts:", e);
                  throw e;
                }
              }
              else {
                data.push({
                  trigger: element.trigger_name,
                  surveyId: element?.survey?.id,
                  data: {
                    message: `condition was not satisfied with the payload`
                  }
                });
              }
            }
            else {
              data.push({
                trigger: element.trigger_name,
                surveyId: element?.survey?.id,
                data: {
                  message: `getting data for survey condition failed`
                }
              });
            }
          }
          else {
            console.log(`trigger ${element.trigger_name} is inactive or different survey`);
          }
        }
        if(data.length === 0){
          data.push({
            data: {
              message: `no triggers found for the survey condition`
            }
          })
        }
        return {
          data: data
        };
      }
      else {
        return {
          data: {
            message: 'No triggers are stored for the account'
          }
        };
      }
    } catch (e) {
      console.log("Error in onExternalEvent function:", e);
      throw e;
    }
  }
}

function checkAllConditions(allConditions, data, allConditionsOperator) {
  try {

    if (allConditionsOperator === "AND") {
      return allConditions.every(condition => checkSingleCondition(condition, data));
    } else if (allConditionsOperator === "OR") {
      return allConditions.some(condition => checkSingleCondition(condition, data));
    }
    return false;
  } catch (e) {
    console.log("Error while checking all conditions:", e);
    return false;
  }
}

function checkSingleCondition(condition, data) {
  try {
    if (condition?.comparator === "OR") {
      return condition?.subConditions.some(subCondition => {
        return evaluateSubCondition(subCondition, data);
      });
    } else if (condition?.comparator === "AND") {

      return condition?.subConditions.every(subCondition => {
        return evaluateSubCondition(subCondition, data);
      });
    }
    return false;
  } catch (e) {
    console.log("Error while checking single condition:", e);
    return false;
  }
}


function evaluateSubCondition(subCondition, data) {
  try {
    const { field, operator, value } = subCondition;

    if (operator?.parent?.value == 'DATE_TIME') {

      const formattedDate = data[field?.label]?.replace(/(\d{2})-(\w{3})-(\d{2})/, (match, day, month, year) => {
        return `${month.charAt(0).toUpperCase() + month.slice(1).toLowerCase()} ${day}, 20${year}`;
      });

      const targetDate = value.split('•')[0].trim();

      const formattedDateObject = new Date(formattedDate);

      const targetDateObject = new Date(targetDate);

      if(!formattedDate){
        return false;
      }

      if (operator?.label === "at" || operator?.label === "from") {
        return formattedDateObject.toDateString() === targetDateObject.toDateString();
      }

      else if (operator?.label === "after") {
        return targetDateObject.toDateString() < formattedDateObject.toDateString();
      }

      else if (operator?.label === "before") {
        return targetDateObject.toDateString() > formattedDateObject.toDateString();
      }

    }


    else if (operator?.value == 'BOOLEAN') {
      return data[field?.label] === (value?.label === "True") ? true : false;  
    }


    else if (operator?.parent?.value == 'STRING') {

      if (operator?.label === "is equals to") {
        return data[field?.label] === value;
      }
      else if (operator?.label === "is not equals to") {
        return data[field?.label] !== value;
      }
      else if (operator?.label === "contains") {
        return data[field?.label].includes(value);
      }
      else if (operator?.label === "not contains") {
        return !data[field?.label].includes(value);
      }
      else if (operator?.label === "has no value") {
        return data[field?.label] === null;
      }
    }

    else if (operator?.parent?.value == 'NUMBER') {

      console.log("AM I HERE", data[field?.label], value, data[field?.label] === value)
      if (operator?.label === "is equals to") {
        return data[field?.label] === Number(value);
      }
      else if (operator?.label === "is not equals to") {
        return data[field?.label] !== Number(value);
      }
      else if (operator?.label === "contains") {
        return data[field?.label].toString().includes(value.toString());
      }
      else if (operator?.label === "not contains") {
        return !data[field?.label].toString().includes(value.toString());
      }
      else if (operator?.label === "has no value") {
        return data[field?.label] === null;
      }

    }
    else if (operator?.value == 'NO_PREFERENCE') {
      return data[field?.label] == value;
    }
    return false;
  } catch (e) {
    console.log("Error while evaluating sub condition:", e);
    return false;
  }
}








