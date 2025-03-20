import React, { useState, useEffect } from "react";
import Main from "./components/main";
import Spinner from "./components/Spinner";
import { ThemeProvider, Flex, Toastr } from "@sparrowengg/twigs-react";

const App = () => {
  const [loaded, setLoaded] = useState(false);
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (client) {
      setLoaded(true);
    }
  }, [client]);

  useEffect(() => {
    const client = window.app.initialized();
    setClient(client);
  }, []);
  return (
    <ThemeProvider
      theme={{
        fonts: {
          body: "DM Sans, sans-serif"
        },
      }}
    >  
    <Toastr duration={2000}/> 
      {!loaded ? (
        <Flex
          alignItems="center"
          justifyContent="center"
          css={{ width: "100%", height: "100vh" }}
        >
          <Spinner />
        </Flex>
      ) : (
        <Main client={client} />
      )}
    </ThemeProvider>
  );
};

export default App;
