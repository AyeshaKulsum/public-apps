import React, { useEffect, useState } from "react";
import { Flex, Alert, Text, Button , Tooltip, toast } from "@sparrowengg/twigs-react";
import CircleLoader from "../HelperComponents/CircleLoader";
import PreferenceDropdown from "./PreferenceDropdown";
import { defaultPreferences } from "../../constants";
import _ from 'lodash';
const SharePreference = ({ client }) => {
  const [loader, setLoader] = useState(true);
  const [storedPreferences, setStoredPreferences]=useState(defaultPreferences);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [isUnique, setIsUnique]=useState(false);
  const [isUpdated, setIsUpdated]=useState(false);

  useEffect(() => {
    getSharePreferences();
  }, []);

  useEffect(() => {
    if (preferences) {
      const values = Object.values(preferences).map((item) => item.value);
      const uniqueValues = new Set(values);
      setIsUnique(uniqueValues.size === values.length);
      let isDataUpdated=false;
      for(const key of Object.keys(preferences)){
        const value1 = preferences[key];
        const value2=storedPreferences[key]
        if(!(_.isEqual(value1,value2))){
            isDataUpdated=true;
            break;
        }
      };
      setIsUpdated(isDataUpdated);
    }
  }, [preferences]);

  const handleUpdatePreferences = async () => {
    try {
        await client.db.set("sharePreferences", preferences);
        toast({
            status:"default",
            title:"Preferences updated successfully"
        });
    } catch (e) {
        console.log(e);
        toast({
            status:"error",
            title:"Failed to update preferences"
        });
    }
};

  const getSharePreferences = async () => {
    try {
      const result = await client.db.get("sharePreferences");
      if (result) {
        const jsonResult = JSON.parse(result);
        setStoredPreferences(jsonResult);
        setPreferences(jsonResult);
        setLoader(false);
      } else {
        setLoader(false);
      }
    } catch (e) {
      console.log(e);
      setLoader(false);
    }
  };

  return loader ? (
    <Flex
      alignItems="center"
      justifyContent="center"
      css={{ width: "100%", height: "100vh" }}
    >
      <CircleLoader />
    </Flex>
  ) : (
    <Flex
      flexDirection="column"
      gap="$12"
      css={{
        padding: "$12",
        marginTop: "$4",
      }}
    >
      <Alert status="info">
        Update the preferences for the sharing channels in the order of
        preference number. Preferences cannot be repeated.
      </Alert>
      <Flex flexDirection="column" gap="$12">
        <Text size="lg" weight="bold">
          {" "}
          Set Preference
        </Text>
        <Flex flexDirection="column">
          {Object.keys(preferences).map((key, index) => {
            return (
              <Flex
                key={key}
                css={{
                  paddingLeft: "$12",
                  borderBottom: "$borderWidths$xs solid $neutral200",
                  height: "$16",
                }}
              >
                <Flex alignItems="center" justifyContent="center">
                  <Text size="md">{index + 1}</Text>
                  <Flex
                    css={{
                      padding: "0 $6",
                      borderRight: "$borderWidths$xs solid $primary200",
                      height: "$10",
                    }}
                  ></Flex>
                  <PreferenceDropdown
                    preference={preferences[key]}
                    setPreferences={setPreferences}
                    preferences={preferences}
                    index={index}
                  />
                </Flex>
              </Flex>
            );
          })}
        </Flex>
      </Flex>
      <Flex
        alignItems="right"
        justifyContent="right"
        css={{ marginTop: "$10" }}
      >
        <Tooltip side="bottom" content={!isUpdated ? "Change the preference order to update" : isUnique ? "" : "Preferences should be unique"}>
        <Button size="lg" css={{ width: "120px" }} disabled={!isUpdated || !isUnique} onClick={()=>handleUpdatePreferences()}>
        <Text size="md" weight="bold">
            Update
          </Text>
          </Button>
        </Tooltip>
      </Flex>
    </Flex>
  );
};
export default SharePreference;
