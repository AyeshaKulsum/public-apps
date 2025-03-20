import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Flex,
  Text,
  Accordion,
  toast,
} from "@sparrowengg/twigs-react";
import { PlusIcon } from "@sparrowengg/twigs-react-icons";
import TriggerCard from "./TriggerCard";
import { routerConstants } from "../../constants/common";
import NoTriggerState from "./NoTriggerState";
import {
  getTriggersFromDB,
  getTriggerConditionFromDB,
  deleteTriggersFromDB,
} from "../../helpers/storageFunctions";
import { Spinner } from "../utils/Spinner";

const Triggers = ({
  router,
  setRouter,
  surveyDetails,
  setSurveyDetails,
  filters,
  setFilters,
  triggers,
  setTriggers,
  isEdit,
  setIsEdit,
  props,
}) => {
  const [accordionOpen, setAccordionOpen] = useState(null);
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTriggers = async () => {
    const result = await getTriggersFromDB(props);
    setTriggers(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchTriggers();
  }, []);

  return (
    loading ?
      <Flex alignItems="center" justifyContent="center" css={{ width: '100%', height: '100vh' }}><Spinner /></Flex> :
      <>
        {triggers?.length > 0 ? (
          <Flex
            alignItems="center"
            justifyContent="center"
            css={{
              width: "100%",
              backgroundColor: "$white900",
              padding: "$40 0",
            }}
          >
            <Box css={{ width: "1120px" }}>
              <Flex
                justifyContent="space-between"
                css={{ width: "100%", marginBottom: "$20" }}
              >
                <Flex flexDirection="column" gap="$3">
                  <Text
                    weight="bold"
                    css={{ fontSize: "$xl", color: "$neutral900" }}
                  >
                    TriggerHub
                  </Text>
                  <Text css={{ color: "$neutral600" }}>
                    Easily set up and manage your survey triggers.
                  </Text>
                </Flex>
                <Button
                  size="lg"
                  leftIcon={<PlusIcon />}
                  css={{ span: { path: { strokeWidth: "2" } } }}
                  onClick={() => setRouter(routerConstants.CONFIGURATION)}
                >
                  New Trigger
                </Button>
              </Flex>
              <Accordion
                type="multiple"
                onValueChange={async (value) => {
                  const list = await Promise.all(
                    triggers.map(async (item, index) => {
                      if (conditions[index] !== undefined) {
                        if (Object.keys(conditions[index]).length !== 0)
                          return conditions[index];
                      }

                      if (value.includes(item?.trigger_id)) {
                        if (conditions[index] === undefined) {
                          const condition = await getTriggerConditionFromDB(
                            props,
                            item.trigger_id
                          );
                          if (Object.keys(condition).length !== 0) {
                            return condition;
                          } else {
                            toast({
                              variant: "error",
                              description: "Failed to fetch conditions",
                            });
                            return {};
                          }
                        } else if (Object.keys(conditions[index]).length === 0) {
                          const condition = await getTriggerConditionFromDB(
                            props,
                            item.trigger_id
                          );
                          if (Object.keys(condition).length !== 0) {
                            return condition;
                          } else {
                            toast({
                              variant: "error",
                              description: "Failed to fetch conditions",
                            });
                            return {};
                          }
                        }
                      }

                      return {};
                    })
                  );
                  if (list) setConditions(list);
                  setAccordionOpen(value);
                }}
              >
                {triggers?.map((item, index) => {
                  return (
                    <TriggerCard
                      item={item}
                      accordionOpen={accordionOpen}
                      // handleEditTrigger={() => handleEditTrigger(item, index)}
                      trigger={triggers}
                      setTrigger={setTriggers}
                      props={props}
                      conditions={conditions}
                      setConditions={setConditions}
                      index={index}
                      setFilters={setFilters}
                      setSurveyDetails={setSurveyDetails}
                      isEdit={isEdit}
                      setIsEdit={setIsEdit}
                      setRouter={setRouter}
                    />
                  );
                })}
              </Accordion>
            </Box>
          </Flex>
        ) : (
          <NoTriggerState router={router} setRouter={setRouter} />
        )}
      </>
  );
};

export default Triggers;
