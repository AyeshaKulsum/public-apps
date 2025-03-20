import React, { useEffect, useState } from "react";
import { Flex, ThemeProvider, TooltipProvider, Toastr } from "@sparrowengg/twigs-react";
import { Spinner } from "./commons/components/spinner";
import Main from "./components/main";

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
      {loaded ? (
        <Flex
          alignItems="center"
          justifyContent="center"
          css={{ width: "100%", height: "100vh" }}
        >
          <Spinner />
        </Flex>
      ) : (
          <TooltipProvider delayDuration={0}>
            <Toastr duration={2000}/> 
          <Main client={client} />
          </TooltipProvider>
      )}
    </ThemeProvider>
  );
};

export default App;
