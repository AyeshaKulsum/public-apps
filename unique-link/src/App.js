import React, { useEffect, useState } from "react";
import { Flex, ThemeProvider, Toastr } from "@sparrowengg/twigs-react";
import Main from "./components/main";
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
        }
      }}
    >
      <Toastr duration={2000} />
      {loaded ? (
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
