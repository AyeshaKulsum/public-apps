import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Heading,
  Select,
  Text,
  toast
} from "@sparrowengg/twigs-react";
import { API_BASE_URL, HEADER } from "../commons/constants";
import { Spinner } from "../commons/components/spinner";
import DownloadCSV from "../components/download-csv";
import { CSV_COLUMN_ORDER } from "../commons/constants";

const Main = ({ client }) => {
  const [loading, setLoading] = useState(true);
  const [contactList, setContactLists] = useState([]);
  const [surveyList, setSurveyList] = useState([]);
  const [channelList, setChannelList] = useState([]);
  const [channelLoader, setChannelLoader] = useState(false);
  const [contactProperties, setContactProperties] = useState([]);
  const [generateLoader, setGenerateLoader] = useState(false);
  const [navigateDownload, setNavigateDownload] = useState(false);

  const [payload, setPayload] = useState({
    contactListId: null,
    surveyListId: null,
    channelListId: null
  });

  const getAllContactList = async () => {
    try {
      const response = await client.request.get(
        `${API_BASE_URL}/contact_lists`,
        HEADER
      );
      const data = JSON.parse(response).body.data;
      setContactLists(data.map((val) => ({ label: val.name, value: val.id })));
    } catch (err) {
      console.log(err);
    }
  };

  const getAllSurveys = async () => {
    try {
      const response = await client.request.get(
        `${API_BASE_URL}/surveys`,
        HEADER
      );
      const data = JSON.parse(response).body.data;
      setSurveyList(data.map((val) => ({ label: val.name, value: val.id })));
    } catch (err) {
      console.log(err);
      toast({
        variant: 'error',
        description: 'Error in fetching all surveys'
      })
    } finally {
      setLoading(false);
    }
  };

  const getChannelList = async (id) => {
    setChannelLoader(true);
    try {
      const response = await client.request.get(
        `${API_BASE_URL}/channels?survey_id=${id}`,
        HEADER
      );
      const data = JSON.parse(response).body.data;
      setChannelList(
        data
          .filter((channel) => channel.type === "EMAIL")
          ?.map((val) => ({ label: val.name, value: val.id }))
      );
    } catch (err) {
      console.log(err);
      toast({
        variant: 'error',
        description: 'Error in fetching Channel List'
      })
    } finally {
      setChannelLoader(false);
    }
  };

  const uniqueLinksHandler = (data, contacts) => {
    const updatedData = contacts.map((contact) => {
      const linkedData = data.find((link) => link.contact_id === contact.id);
      if (linkedData) {
        return {
          ...contact,
          uniqueLink: linkedData.survey_link,
          short_url: linkedData.short_url
        };
      } else {
        return contact;
      }
    });
    const reorderedData = updatedData.map((row) => {
      let updatedRow = {};
      const key = Object.keys(row).find(
        (row) => !CSV_COLUMN_ORDER.includes(row)
      );
      CSV_COLUMN_ORDER.forEach((column) => {
        updatedRow[column] = row[column];
      });
      delete updatedRow["surveyId"];
      updatedRow.contact_property = row[key] ?? "";
      return updatedRow;
    });
    setContactProperties(reorderedData);
    setGenerateLoader(false);
    setNavigateDownload(true);
  };

  const createSurveyLinks = async (contacts) => {
    try {
      const response = await client.request.post(
        `${API_BASE_URL}/channels/create_unique_links`,
        HEADER,
        {
          survey_id: payload.surveyListId.value,
          channel_id: payload.channelListId.value,
          contact_list_ids: [payload.contactListId.value],
          short_url : true
        }
      );
      const data = JSON.parse(response).body.data;
      uniqueLinksHandler(data, contacts);
    } catch (err) {
      console.log(err);
      toast({
        variant: 'error',
        description: 'Error in Creating Unique Survey Links'
      })
    }
  };

  const getContactProperties = async (id) => {
    setGenerateLoader(true);
    try {
      let contacts = [],
        hasNextPage = true,
        pageNo = 1;
        let count = 0;
        while(hasNextPage){
          const response = await client.request.get(
            `${API_BASE_URL}/contacts?contact_list_id=${id}&page=${pageNo}`,
            HEADER
          ); 
          const responseData = JSON.parse(response).body;
          contacts = [ ...contacts, ...responseData.data ]
          count = count + responseData.data.length;
          hasNextPage = responseData.has_next_page;
          pageNo = pageNo + 1;
        };
      createSurveyLinks(contacts);
    } catch (err) {
      console.log(err);
      toast({
        variant: 'error',
        description: 'Error in Fetching Contact Properties'
      })
    }
  };

  useEffect(() => {
    getAllContactList();
    getAllSurveys();
  }, []);

  return (
    <>
      {loading ? (
        <Flex
          alignItems="center"
          justifyContent="center"
          css={{ height: "100vh" }}
        >
          <Spinner />
        </Flex>
      ) : (
        <>
          {navigateDownload ? (
            <DownloadCSV
              contactProperties={contactProperties}
              contactLabel={payload.contactListId.label}
              navigateBack={() => setNavigateDownload(false)}
              contactCount={contactProperties.length}
            />
          ) : (
            <Flex
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              css={{ height: "100vh" }}
            >
              <Heading size="h3">Unique Survey Link Generator</Heading>
              <Text
                size="lg"
                css={{
                  color: "$neutral800",
                  textAlign: "center",
                  marginTop: "$6"
                }}
              >
                Effortlessly generate unique survey links for personalized data
                collection
              </Text>
              <Box
                css={{
                  marginTop: "$12",
                  width: 650,
                  border: "$borderWidths$xs solid $neutral300",
                  boxShadow: "$sm",
                  padding: "$12",
                  paddingBottom: "$16",
                  borderRadius: "$lg"
                }}
              >
                <Heading
                  size="h5"
                  weight="medium"
                  css={{ color: "$neutral900" }}
                >
                  Generate Unique Links
                </Heading>
                <Box css={{ marginTop: "$8" }}>
                  <FormLabel css={{ marginBlock: "$2", fontSize: "$md" }}>
                    Contact List
                  </FormLabel>
                  <Select
                    size="lg"
                    options={contactList}
                    value={payload.contactListId}
                    onChange={(list) => {
                      setPayload((prev) => ({ ...prev, contactListId: list }));
                    }}
                  />
                </Box>
                <Box css={{ marginTop: "$8" }}>
                  <FormLabel css={{ marginBlock: "$2", fontSize: "$md" }}>
                    Survey
                  </FormLabel>
                  <Select
                    size="lg"
                    options={surveyList}
                    value={payload.surveyListId}
                    onChange={(list) => {
                      setPayload((prev) => ({
                        ...prev,
                        surveyListId: list,
                        channelListId: null
                      }));
                      getChannelList(list.value);
                    }}
                  />
                </Box>
                <Box css={{ marginTop: "$8" }}>
                  <FormLabel css={{ marginBlock: "$2", fontSize: "$md" }}>
                    Channel
                  </FormLabel>
                  <Select
                    size="lg"
                    isLoading={channelLoader}
                    noOptionsMessage={() => "No email shares were found."}
                    value={payload.channelListId}
                    options={channelList}
                    onChange={(val) =>
                      setPayload((prev) => ({ ...prev, channelListId: val }))
                    }
                  />
                </Box>
              </Box>
              <Button
                size="xl"
                css={{ marginTop: "$16" }}
                disabled={
                  !payload.contactListId ||
                  !payload.surveyListId ||
                  !payload.channelListId
                }
                loading={generateLoader}
                onClick={() => {
                  getContactProperties(payload.contactListId.value);
                }}
              >
                Generate
              </Button>
            </Flex>
          )}
        </>
      )}
    </>
  );
};

export default Main;
