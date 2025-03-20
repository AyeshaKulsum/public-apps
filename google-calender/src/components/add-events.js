import {
  Box,
  Button,
  Flex,
  FormInput,
  FormLabel,
  Heading,
  Text,
  styled
} from "@sparrowengg/twigs-react";
import React, { useState } from "react";
import dayjs from "dayjs";
import { CloseIcon } from "@sparrowengg/twigs-react-icons";
import { DatePicker } from "./date-picker";
import { parseDate } from "@internationalized/date";
import { CustomInput } from "../commons/components/custom-input"
import { calendarConstants, EMAIL_REGEX, importDialog as importDialogConstants } from "../commons/constants";

const AddEvents = ({
  register,
  errors,
  handleSubmit,
  setValue,
  getValues,
  resetEventDetails,
  client
}) => {
  const [showModal, setShowModal] = useState({ show: false, type: "" });
  const [emailValue, setEmailValue] = useState("");
  const [userEmail, setUserEmail] = useState([]);
  const { SEARCH_PLACEHOLDERS  } = importDialogConstants;

  const addUserEmail = (email) => {
    if (userEmail.includes(email)) return;
    setUserEmail((prev) => [...prev, email]);
  };

  const removeUserEmail = (email) => {
    const filteredEmail = userEmail.filter((user) => user !== email);
    setUserEmail(filteredEmail);
  };

  const getSurveyId = async () => {
    const response = await client?.data?.get(calendarConstants.getSurveyId);
    return response;
  };
  const { calendarDateTypes } = calendarConstants;
  const submitHandler = async (value) => {
    try {
      if(dayjs(value.end.dateTime).diff(value.start.dateTime) > 0) {
        client?.interface.alertMessage("Event Added Successfully", {
          type: "success"
        });
      } else {
        client?.interface.alertMessage("From time must be earlier than To time. Please adjust the event's time range.", {
          type: "failure"
        });
        return;
      }
      await client?.request.post(
        calendarConstants.BASE_URL,
        calendarConstants.HEADERS,
        value
      );
      client?.interface.alertMessage("Event Added Successfully", {
        type: "success"
      });
    } catch (err) {
      console.log(err);
      client?.interface.alertMessage("Error in setting the event", {
        type: "failure",
      });
    } finally {
      resetEventDetails();
    }
  };

  const onSubmit = async (value) => {
    const response = await getSurveyId();
    const formattedEmails = userEmail.map(email => {
      return { email: email };
    });
    setEmailValue("");
    setUserEmail([]);
    const updatedDetails = {
      ...value,
      description: value.description + " " + response,
      start: { dateTime: value.start },
      end: { dateTime: value.end },
      attendees: formattedEmails
    };
    submitHandler(updatedDetails);
  };
  const resetModal = () => setShowModal({ show: false, type: "" });

  const handleSaveData = (value, type) => {
    if (type === calendarDateTypes.START) {
      setValue(calendarDateTypes.start, value);
    } else {
      setValue(calendarDateTypes.end, value);
    }
    resetModal();
  };
  const getCurrentDateTime = () => dayjs(getValues(showModal.type.includes(calendarDateTypes.START) ? calendarDateTypes.start : calendarDateTypes.end));

  return (
    <Flex alignItems="center" justifyContent="center">
      <Box css={{ maxWidth: "740px", width: "100%" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Heading
            size="h5"
            css={{
              marginBlock: "$20",
              textTransform: "capitalize"
            }}
          >
            Add this survey to your calendar
          </Heading>
          <FormInput
            maxLength={40}
            size="lg"
            label={<CustomFormLabel label="Event title" />}
            {...register("summary", { required: "Event Title is required" })}
            error={errors?.summary?.message}
            showCount
          />
          <Text size="md" css={{ marginBlock: "$12 $6" }} weight="medium">
            Choose the event date & time
          </Text>
          <Flex alignItems="center" gap="$12" css={{ marginBottom: "$12" }}>
            <Box>
              <FormLabel css={{ marginBottom: "$2" }}>From </FormLabel>
              <Button
                color="default"
                onClick={() => setShowModal({ show: true, type: "Start" })}
                type="button"
                size="md"
              >
                {dayjs(getValues("start")).format("YYYY-MM-DD hh:mm a")}
              </Button>
            </Box>
            <Box css={{ marginLeft: "$3" }}>
              <FormLabel css={{ marginBottom: "$2" }}>To </FormLabel>
              <Button
                color="default"
                onClick={() => setShowModal({ show: true, type: "End" })}
                type="button"
                size="md"
              >
                {dayjs(getValues("end")).format("YYYY-MM-DD hh:mm a")}
              </Button>
            </Box>
          </Flex>
          
          <FormLabel css={{ marginTop: "$8", lineHeight: "$md" }}>Participants To Add</FormLabel>
              <Flex css={{ alignItems: "center", gap: "$3", marginTop:"$2" }}>
                <Box
                css={{ 
                  maxWidth: "740px",
                  width: "100%"
                }}
                >
                  <CustomInput
                    disabled={userEmail.length >= 10}
                    value={emailValue}
                    onChangeHandler={(e) => {setEmailValue(e.target.value)}}
                    placeholder={ userEmail?.length >=10 ? SEARCH_PLACEHOLDERS.EMAIL_LIMIT : SEARCH_PLACEHOLDERS.INFO }
                  />
                </Box>
                <Button
                size="lg"
                css={{ marginRight: "$4" }}
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  if (
                    EMAIL_REGEX.test(emailValue)
                      && userEmail.length < 10
                  ) {
                    addUserEmail(emailValue);
                  }else{
                    client.interface.alertMessage("Enter a valid email address", {
                      type: "failure"
                    } )
                  }
                  setEmailValue("");
                }}
                disabled={emailValue.length<1}
              >
                <Text  weight="medium" size="md">Add</Text>
              </Button>
              </Flex>
            <Flex css={{ marginTop: "$4", flexWrap: "wrap", rowGap: "$3" }}>
              {userEmail?.map((email) => (
                <Flex
                 key={email}
                  css={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "$custom_gray_250",
                    borderRadius: "$xl",
                    padding: "$2 $4 $2 $2",
                    marginRight: "$4",
                    cursor: "pointer",
                    position: "relative",
                    "& svg": {
                      background: "$neutral600",
                      width: "$3",
                      height: "$3",
                      marginLeft: "$6",
                      borderRadius: "$pill",
                    },
                    "&:hover .closeIcon": {
                      opacity: 1,
                      color: "white",
                    },
                  }}
                >
                  <Text
                    css={{
                      width: "$4",
                      height: "$4",
                      borderRadius: "$pill",
                      background: "#7D84B2",
                      textAlign: "center",
                      paddingTop: "3px",
                      marginRight: "$2",
                      color: "$white900",
                      textTransform:"uppercase"
                    }}
                    size="xs"
                  >
                    {email.charAt(0)}
                  </Text>
                  <Text >{email}</Text>
                  <Box
                    css={{
                      opacity: 0,
                      position: "absolute",
                      top: "22%",
                      right: "3%",
                      width: "$6",
                      height: "$4",
                      transition: "all .4s ease",
                      background:
                        "linear-gradient(270deg, $custom_gray_250 48.12%, rgba(232, 232, 232, 0) 100%)",
                    }}
                    className="closeIcon"
                    onClick={() => removeUserEmail(email)}
                  >
                    <CloseIcon />
                  </Box>
                </Flex>
              ))}
            </Flex>
            
          <FormInput
            size="lg"
            as="textarea"
            {...register("description", {
              required: "Description is required"
            })}
            label={<CustomFormLabel
              label="Description"
              css={{ marginTop: "$8", lineHeight: "$md" }}
            />}
            css={{ resize: "none", height: "160px" }}
            error={errors?.description?.message}
          />
          <Box css={{ marginBlock: "$12" }}>
            <FormLabel css={{ marginTop: "$8", lineHeight: "$md" }}>Where</FormLabel>
            <FormInput
              size="lg"
              placeholder="Eg. London, United Kingdom"
              {...register("location")}
            />
          </Box>
          <Button
            variant="solid"
            size="lg"
            color="primary"
            type="submit"
          >
            Create Event
          </Button>
        </form>
        {showModal.show && (
          <DatePicker
            minValue={parseDate(
              dayjs(
                getValues(
                  showModal.type.includes(calendarDateTypes.END)
                    ? calendarDateTypes.start
                    : ""
                )
              ).format("YYYY-MM-DD")
            )}
            isOpen={showModal.show}
            resetModal={resetModal}
            isDateTime
            handleSaveData={handleSaveData}
            type={showModal.type}
            date={getCurrentDateTime().format("YYYY-MM-DD")}
            time={getCurrentDateTime().format("HH:mm")}
          />
        )}
      </Box>
    </Flex>
  );
};

export default AddEvents;

const CustomFormLabel = ({ label, css }) => {
  const StyledSpan = styled("span", {
    color: "$negative400",
    marginLeft: "$1"
  });

  return (
    <FormLabel css={css}>
      {label}
      <StyledSpan>*</StyledSpan>
    </FormLabel>
  );
};
