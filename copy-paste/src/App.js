import React from "react";
import SurveyBuilder from "./pages/survey-builder";
import { ThemeProvider, Toastr } from "@sparrowengg/twigs-react";
import { ContextProvider } from "./context";

const App = () => {
  return (
    <ThemeProvider
      theme={{
        fonts: {
          body: "'DM sans', sans-serif"
        },
        colors: {
          lightBorder: "#E7E7E7"
        }
      }}
    >
      <Toastr duration={1000} />
      <ContextProvider>
        <SurveyBuilder />
      </ContextProvider>
    </ThemeProvider>
  );
};

export default App;
