import React, { useEffect, useState } from "react";

import SharePreference from "./SharePreference";
import ShareConfiguration from "./ShareConfiguration";

const Main = (props) => {
  const [location, setLocation] = useState(null);
  const { client } = props;

  async function getCurrentLocation() {
    const loc = await client.interface.getLocation();
    setLocation(loc);
  }

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <>
      {location === "contact_import" && <SharePreference client={client} />}
      {location === "new_survey_shares" && (
        <ShareConfiguration client={client} />
      )}
    </>
  );
};

export default Main;
