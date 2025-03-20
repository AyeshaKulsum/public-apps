import React from "react";
import { Select } from "@sparrowengg/twigs-react";
import { defaultPreferences } from "../../constants";
const PreferenceDropdown = ({
  preference,
  setPreferences,
  preferences,
  index,
}) => {
  return (
    <Select
      size="lg"
      defaultValue={preference}
      value={preference}
      onChange={(e) => {
        const updatedPreferences = { ...preferences, [index]: e };
        setPreferences(updatedPreferences);
      }}
      css={{
        width: "460px",
        marginLeft: "$12",
        "& .twigs-select__control, & .twigs-select__control:hover": {
          border: "none",
          borderRadius: "$lg",
          ".twigs-select__value-container": {
            fontSize: "$sm",
          },
          ".twigs-select__placeholder": {
            fontSize: "$sm",
          },
        },
      }}
      options={Object.values(defaultPreferences)}
    />
  );
};
export default PreferenceDropdown;
