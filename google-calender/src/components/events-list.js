import {
  Box,
  Flex,
  Heading,
  IconButton,
  Text,
  Tooltip,
  Button
} from "@sparrowengg/twigs-react";
import React, { useEffect, useState } from "react";
import { Spinner } from "../commons/components/spinner";
import DescriptionIcon from "../commons/icons/description";
import LocationIcon from "../commons/icons/location";
import dayjs from "dayjs";
import { DeleteIcon, UserIcon } from "@sparrowengg/twigs-react-icons";
import { calendarConstants } from "../commons/constants";

const EventsList = ({ client }) => {
  const [eventList, setEventList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { daysNames, monthNames } = calendarConstants;

  const getEventList = async () => {
    setLoading(true);
    try {
      const surveyId = await client?.data.get(calendarConstants.getSurveyId);
      const data = await client?.request.get(
        `${calendarConstants.BASE_URL}?q=${surveyId}`,
        calendarConstants.HEADERS
      );
      setEventList(JSON.parse(data).body.items);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getEventList();
  }, [client]);

  const getDateTime = (startDate, endDate) => {
    const startEventDay = daysNames[dayjs(startDate).day()];
    const startEventMonth = monthNames[dayjs(startDate).month()];
    const endEventMonth = monthNames[dayjs(endDate).month()];
    return dayjs(startDate).day() === dayjs(endDate).day()
      ? `${startEventDay}, ${startEventMonth} ${dayjs(startDate).format(
          "DD ·"
        )} ${dayjs(startDate).format("hh:mm a")} - ${dayjs(endDate).format(
          "hh:mm a"
        )}`
      : `${startEventMonth} ${dayjs(startDate).format(
          "DD · hh:mm a"
        )} - ${endEventMonth} ${dayjs(endDate).format("DD · hh:mm a")}`;
  };

  const eventDeleteHandler = async (id) => {
    try {
      await client?.request.delete(
        `${calendarConstants.BASE_URL}/${id}`,
        calendarConstants.HEADERS
      );
      const updatedList = eventList.filter((event) => event.id !== id);
      setEventList(updatedList);
      client?.interface.alertMessage("Event Deleted Successfully", {
        type: "success"
      });
    } catch (err) {
      console.log(err);
      client?.interface.alertMessage("Error in deleting the event", {
        type: "failure"
      });
    }
  };

  return (
    <>
      {loading ? (
        <Flex
          alignItems="center"
          justifyContent="center"
          css={{ height: "calc( 100vh - 183px )" }}
        >
          <Spinner />
        </Flex>
      ) : (
        <Flex
          alignItems="center"
          justifyContent="center"
          css={{ marginTop: "$20" }}
        >
          {eventList.length > 0 ? (
            <Flex
              flexDirection="column"
              css={{
                maxWidth: "740px",
                width: "100%",
                rowGap: "$16",
                height: "100%",
                overflowY: "auto"
              }}
            >
              {eventList.map((event) => {
                return (
                  <Flex
                    justifyContent="space-between"
                    key={event.id}
                    css={{
                      padding: "$10",
                      border: "$borderWidths$xs solid $neutral200",
                      borderRadius: "$xl",
                      cursor: "pointer",
                      position: "relative",
                      "&:hover": {
                        borderColor: "$neutral300",
                        boxShadow: "0px 4px 8px 0px rgba(0, 0, 0, 0.05)",
                        "& .deleteBtn": {
                          opacity: 1
                        }
                      }
                    }}
                  >
                    <Box>
                      <Text
                        size="lg"
                        weight="medium"
                        css={{
                          marginBottom: "$2",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          maxWidth: "403px",
                          textOverflow: "ellipsis"
                        }}
                      >
                        {event?.summary}
                      </Text>
                      <Text size="sm" css={{ color: "$neutral600" }}>
                        {getDateTime(
                          event?.start.dateTime,
                          event?.end.dateTime
                        )}
                      </Text>
                      <Flex alignItems="center" css={{ marginTop: "$8" }}>
                        <DescriptionIcon />
                        <Text
                          size="sm"
                          css={{
                            color: "$neutral800",
                            marginLeft: "$6",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            maxWidth: "558px",
                            textOverflow: "ellipsis"
                          }}
                        >
                          {event?.description.split(" ").slice(0, -1).join(" ")}
                        </Text>
                      </Flex>
                      <Flex alignItems="center" css={{ marginTop: "$6" }}>
                        <LocationIcon />
                        <Text
                          size="sm"
                          css={{
                            color: "$neutral800",
                            marginLeft: "$6",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            maxWidth: "558px",
                            textOverflow: "ellipsis"
                          }}
                        >
                          {event?.location ||  "N/A"}
                        </Text>
                      </Flex>
                      {event?.attendees?.length ? (
                        <Flex
                          alignItems="center"
                          css={{
                            marginTop: "$6",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: "$3"
                          }}
                        >
                          <UserIcon size={24} color="#6A6A6A" />
                          {event?.attendees?.slice(0, 5).map((attendee) => (
                            <Text
                              key={attendee?.email}
                              size="sm"
                              css={{ color: "$neutral800" }}
                            >
                              {attendee?.email}
                            </Text>
                          ))}
                          {event?.attendees?.length > 5 ? (
                            <Tooltip
                              side="right"
                              size="lg"
                              content={event.attendees?.map(attendee => <Text key={attendee?.email} css={{marginLeft: "$3"}}>{attendee?.email}</Text> )}
                            >
                              <Button variant="ghost" color="bright">
                                ...
                              </Button>
                            </Tooltip>
                          ) : null}
                        </Flex>
                      ) : null}
                    </Box>
                    <IconButton
                      size="md"
                      icon={<DeleteIcon size={24} />}
                      color="default"
                      className="deleteBtn"
                      onClick={() => eventDeleteHandler(event.id)}
                      css={{ opacity: 0, position: "absolute", right: "$10" }}
                    />
                  </Flex>
                );
              })}
            </Flex>
          ) : (
            <Flex css={{ height: "calc(100vh - 200px)" }} alignItems="center">
              <Heading css={{ textAlign: "center" }} weight="medium" size="h5">
                Oops No Events are added here
              </Heading>
            </Flex>
          )}
        </Flex>
      )}
    </>
  );
};

export default EventsList;
