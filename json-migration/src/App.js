import React from 'react';
import { useEffect, useState } from 'react';
import {ThemeProvider, ToastProvider, Flex} from '@sparrowengg/twigs-react';
import JsonMigration from './JsonMigration';
import Loader from './components/Loader';
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
          css={{ width: '100%', height: '100vh' }}
        >
          <Loader />
        </Flex>
       ) : (
        <ToastProvider duration={5000} position="bottom-center">
          <JsonMigration client={client} />
        </ToastProvider>
       )}
    </ThemeProvider>
  );
};
export default App;