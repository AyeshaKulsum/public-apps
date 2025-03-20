import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import StatusPage from "./components/StatusPage";
import { initilaizeClient } from "./helpers/fetch";
import { ThemeProvider } from "@sparrowengg/twigs-react";
import Loader from "./components/Loader";
import { commonConstants } from "./constants/commonConstants";

const root = ReactDOM.createRoot(document.getElementById("root"));

const Home = () => {

  const [page, setPage] = useState();
  const [accountData, setAccountData] = useState();
  const [location, setLocation] = useState();
  const [isHistoryPresent, setIsHistoryPresent] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let location;
    let accountData;
    try {
      await initilaizeClient();
      location = await window.client.data.get("getSurveyId");
      accountData = JSON.parse(await window.client.db.get("data"));
    } catch (error) {
      console.log(error);
    }
    if (location) {
      setLocation(location);
    }
    if (accountData) {
      setAccountData(accountData);
      if(accountData["uploading"]) {
        setPage(commonConstants.status);
        return;
      }
      if (location) {
        if (accountData[location]) {
          setPage(commonConstants.status);
        }
        else {
          setPage(commonConstants.import);
          setIsHistoryPresent(false);
        }
      }
      else {
        setPage(commonConstants.status);
      }
    }
    else {
      setPage(commonConstants.import);
      setIsHistoryPresent(false);
    }
  }

  return (
    <ThemeProvider
      theme={{
        fonts: {
          body: "'DM sans', sans-serif"
        },
        colors: {
          link: "#457FFD"
        }
      }}
    >
      <>
        {page ? page === commonConstants.status ?
          <StatusPage
            setPage={setPage}
            accountData={accountData}
            setAccountData={setAccountData}
            location={location}
            isHistoryPresent={isHistoryPresent}
            setIsHistoryPresent={setIsHistoryPresent}
          /> :
          <App
            setPage={setPage}
            setAccountData={setAccountData}
            location={location}
            isHistoryPresent={isHistoryPresent}
          />:
        <Loader/>}
      </>
    </ThemeProvider>
  )
}

root.render(
  <Home />
);