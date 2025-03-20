import React, { useEffect, useState } from "react";
import {
  Flex,
  ThemeProvider,
  Toastr,
  TooltipProvider
} from "@sparrowengg/twigs-react";
import { Spinner } from "./commons/components/spinner";
import Main from "./components/main";

const defaultEventConfig = {
  subscribed: false,
  unsubscribed: false,
  bounced: false,
  deactivated: false
};

const App = () => {
  const [loaded, setLoaded] = useState(true);
  const [client, setClient] = useState(null);
  const [events, setEvents] = useState(defaultEventConfig);
  const [currentBoard, setCurrentBoard] = useState([]);
  const [currentColumn, setCurrentColumn] = useState([]);

  const fetchIntialData = async (client) => {
    try {
      const response = await client?.db.get("mapping");
      const formattedResponse = JSON.parse(response);
      setEvents(formattedResponse?.events ?? defaultEventConfig);
      setCurrentBoard(formattedResponse?.board ?? []);
      setCurrentColumn(formattedResponse?.column ?? []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoaded(false);
    }
  };

  useEffect(() => {
    const client = window.app.initialized();
    setClient(client);
    fetchIntialData(client);
  }, []);

  return (
    <ThemeProvider
      theme={{
        fonts: {
          body: "'DM sans', sans-serif"
        }
      }}
    >
      <Toastr duration={1000} />
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
          <Main
            events={events}
            setEvents={setEvents}
            client={client}
            currentBoard={currentBoard}
            currentColumn={currentColumn}
            setCurrentBoard={setCurrentBoard}
            setCurrentColumn={setCurrentColumn}
          />
        )}
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default App;
