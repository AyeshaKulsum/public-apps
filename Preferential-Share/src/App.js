import React, { useState, useEffect } from 'react';
import './App.css';
import Main from './components/main';
import { ThemeProvider , Toastr, TooltipProvider} from '@sparrowengg/twigs-react';

const App = () => {
  const [loaded, setLoaded] = useState(false);
  const [child, setChild] = useState(<h3 style={{ textAlign: "center", marginTop: "100px" }}>App is loading...</h3>);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const client = window.app.initialized();
    setChild(<Main client={client} />);
  }, [loaded]);

  return (
    <ThemeProvider theme={{
      fonts: {
        body: "'DM sans', sans-serif",
      },
    }}>
       <Toastr duration={2000}/> 
      <TooltipProvider delayDuration={10}>
        {child}
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default App;
