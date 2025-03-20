import React from "react";
import { Flex, Text, Select } from "@sparrowengg/twigs-react";
import { EmailSVG, WhatsAppSVG, SMSSVG } from "../../icons";
import { generateRandomId } from "../../helpers/generateRandomId";
const Option = (props) => {
  const { data, innerProps, selectProps } = props;
  const { surveyDetails, value } = selectProps;
  const iconMapping = {
    Email: EmailSVG,
    WhatsApp: WhatsAppSVG,
    SMS: SMSSVG,
  };
  const Icon = iconMapping[data.label];
  const selectedShareChannels = surveyDetails?.shareConfig?.map(
    (item) => item?.shareChannel?.id,
  );
  const disabled = data.id !== value?.id && selectedShareChannels.includes(data.id);

  return (
    <Flex
      alignItems="center"
      gap="$4"
      {...innerProps}
      css={{
        padding: "$3 $6",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        "&:hover": {
          backgroundColor: !disabled && data.id !== value?.id && "$neutral50",
        },
        backgroundColor: data.id === value?.id && "$primary100",
      }}
      {...(disabled && { onClick: null })}
      key={data.id}
    >
      {Icon && <Icon size="24" color="#6A6A6A" />}
      <Text size="sm" css={{ color: "$neutral900" }}>
        {data.label}
      </Text>
    </Flex>
  );
};

const CustomSelect = ({
  placeholder,
  label,
  options,
  surveyDetails,
  setSurveyDetails,
  type,
  isDisabled,
  shareId,
  shareType,
  customStyles,
  value,
  setChannelOptions,
  isLoading,
  setLoading,
}) => {
  const handleSelectChange = (value, shareId) => {
    switch (type) {
      case "SURVEY":
        setSurveyDetails({
          survey: value,
          shareConfig: [
            {
              id: generateRandomId(),
              shareType: null,
              shareChannel: null,
            },
          ],
        });
        setChannelOptions({
          EMAIL: null,
          WHATSAPP: null,
          SMS: null,
        });
        setLoading((prev) => ({ ...prev, channel: true }));
        break;
      case "SHARE":
        const updatedShareConfig = surveyDetails?.shareConfig?.map((item) => {
          if (shareType === "shareType" && item.id === shareId) {
            return {
              ...item,
              shareChannel: null,
              [shareType]: value,
            };
          }
          if (item.id === shareId) {
            return {
              ...item,
              [shareType]: value,
            };
          }
          return item;
        });
        setSurveyDetails((prev) => ({
          ...prev,
          shareConfig: updatedShareConfig,
        }));
        setLoading((prev) => ({ ...prev, channel: true }));
        break;
    }
  };
  return (
    <Select
      size="lg"
      placeholder={placeholder}
      label={label}
      options={options}
      surveyDetails={surveyDetails}
      setSurveyDetails={setSurveyDetails}
      components={{
        Option,
      }}
      css={{
        ...customStyles,
        ".twigs-select__control": {
          cursor: "pointer",
          borderRadius: "$xl",
          ".twigs-select__value-container, .twigs-select__placeholder": {
            fontSize: "$sm",
          },
          ".twigs-select__indicators": {
            ".twigs-select__loading-indicator": {
              display: "none",
            },
          },
        },
      }}
      value={value}
      onChange={(option) => handleSelectChange(option, shareId)}
      isDisabled={isDisabled}
      isLoading={isLoading}
    />
  );
};

export default CustomSelect;
