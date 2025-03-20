import React, { useEffect, useState } from "react";
import { Flex, ThemeProvider, TooltipProvider } from "@sparrowengg/twigs-react";
import GoogleCalendar from "./components/google-calendar";
import { Spinner } from "./commons/components/spinner";

const App = () => {
  const [loaded, setLoaded] = useState(true);
  const [client, setClient] = useState(null);

  useEffect(() => {
    const client = window.app.initialized();
    setClient(client);
    setLoaded(false);
  }, []);

  return (
    <ThemeProvider
      theme={{
        fonts: {
          body: "'DM sans', sans-serif"
        },
      }}
    >
      <TooltipProvider delayDuration={0}>
      {loaded ? (
        <Flex
          alignItems="center"
          justifyContent="center"
          css={{ width: "100%", height: "100vh" }}
        >
          <Spinner />
        </Flex>
      ) : (
        <GoogleCalendar client={client} />
      )}
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default App;
