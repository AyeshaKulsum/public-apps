import React, { createContext, useState } from "react";

export const GlobalContext = createContext(null);

export const ContextProvider = ({ children }) => {
  const [surveyType, setSurveyType] = useState(false);
  const [surveyId, setSurveyId] = useState(null);

  const handleSurveyType = (value) => setSurveyType(value);
  const handleSurveyId = (id) => setSurveyId(id);

  return (
    <GlobalContext.Provider value={{ surveyType, handleSurveyType, surveyId, handleSurveyId }}>
      {children}
    </GlobalContext.Provider>
  );
};