import React, { useState } from "react";
import Header from "./utils/Header";
import Configuration from "./configuration";
import Triggers from "./triggers";
import { generateRandomId } from "../helpers/generateRandomId";
import { routerConstants, topLevelCondition } from "../constants/common";

const Main = (client) => {
  const [router, setRouter] = useState(routerConstants.TRIGGERS);
  const [triggers, setTriggers] = useState([]);
  const [isEdit, setIsEdit] = useState({ status: false, id: null });
  const [surveyDetails, setSurveyDetails] = useState({
    survey: null,
    shareConfig: [
      {
        id: generateRandomId(),
        shareType: null,
        shareChannel: null,
      },
    ],
  });
  const [filters, setFilters] = useState({
    parentComparator: topLevelCondition[0],
    conditions: [],
    mainCondition: true
  });

  const routeMapping = {
    CONFIGURATION: Configuration,
    TRIGGERS: Triggers,
  };
  const ComponentToRender = routeMapping[router];

  return (
    <>
      {router === routerConstants.CONFIGURATION && (
        <Header
          router={router}
          setRouter={setRouter}
          triggers={triggers}
          setTriggers={setTriggers}
          surveyDetails={surveyDetails}
          setSurveyDetails={setSurveyDetails}
          filters={filters}
          setFilters={setFilters}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          props={client}
        />
      )}
      {ComponentToRender && (
        <ComponentToRender
          router={router}
          setRouter={setRouter}
          surveyDetails={surveyDetails}
          setSurveyDetails={setSurveyDetails}
          filters={filters}
          setFilters={setFilters}
          triggers={triggers}
          setTriggers={setTriggers}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          props={client}
        />
      )}
    </>
  );
};

export default Main;
