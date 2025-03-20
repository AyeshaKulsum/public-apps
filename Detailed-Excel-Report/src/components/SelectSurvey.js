import React, { useState } from "react";
import { Text, Select, Button, Flex, toast, ToastDescription } from "@sparrowengg/twigs-react";
import StyledFlex from "./StyledFlex";
import { EXCEL_SHEET_ROWS_LIMIT, displayMessages , resultTypes } from "../constants";
import { DownloadIcon, ChevronDownIcon } from "@sparrowengg/twigs-react-icons";
import { components } from "react-select";
import FilledInfoSVG from './FilledInfoSVG';

const groupStyles = {
  borderBottom: `1px solid #F1F1F1`,
  borderRadius: "1px",
};

const SelectSurvey = ({ groupedSurveyOptions = [], props }) => {
  const [filteredGroups, setFilteredGroups] = useState(groupedSurveyOptions);
  const [lastGroup, setLastGroup] = useState(groupedSurveyOptions[groupedSurveyOptions.length - 1]?.label || null);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDownloadInProgress, setIsDownloadInProgress] = useState(false);

  const Group = (props) => (
    <div style={props.data.label!==lastGroup?groupStyles:{}}>
      <components.Group {...props} />
    </div>
  );

  const getGroupHeader = (label, options) => {
    const count = options.length;
    return (
      <Flex alignItems="center">
        <Text css={{ color: "$neutral700", fontWeight:"$7" }} size="xs">
          {label}
        </Text>{" "}
        <Text
          css={{
            margin: "$2",
            marginRight: "0",
            color: "$neutral600",
          }}
          size="xs"
        >
          ({count})
        </Text>
      </Flex>
    );
  };

  const handleSurveysFiltering = (searchTerm) => {
    const filteredGroups = groupedSurveyOptions
      .filter((group) =>
        group.options.some((option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .map((group) => ({
        ...group,
        options: group.options.filter((option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }));
    setLastGroup(filteredGroups[filteredGroups.length - 1]?.label || null);
    setFilteredGroups(filteredGroups);
  };

  const getCurrentDateTime = () => {
    const date = new Date();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}-${month}-${year}_${hours}${minutes}${seconds}`;
  };

  const handleDownloadFile = async (survey) => {
    try {
      const response = await props.client.request.invoke("getXlsxData", {
        surveyId: survey.value,
      });
      if (!response) {
        toast({
          variant: resultTypes.ERROR,
          title: displayMessages.ERROR_MESSAGE,
          description: displayMessages.SOMETHING_WENT_WRONG,
        });
      }
      const jsonResponse = JSON.parse(response)?.body;
      if (!jsonResponse?.data) {
        toast({
          variant: resultTypes.ERROR,
          title: displayMessages.ERROR_MESSAGE,
          description: displayMessages.INVALID_RESPONSE_FROM_SERVER,
        });
      } else if (jsonResponse.data.status !== 200 || !jsonResponse.data.reportData) {
        toast({
          variant: resultTypes.ERROR,
          title: displayMessages.ERROR_MESSAGE,
          description: jsonResponse.body?.error || displayMessages.SOMETHING_WENT_WRONG,
        });
      } else {
        const data = jsonResponse.data.reportData;
        const wb = XLSX.utils.book_new();
        let sheetCount = 1;
        for (let i = 0; i < data.length; i += EXCEL_SHEET_ROWS_LIMIT) {
          const newData = data.slice(i, i + EXCEL_SHEET_ROWS_LIMIT);
          const ws = XLSX.utils.aoa_to_sheet(newData);
          XLSX.utils.book_append_sheet(wb, ws, `Sheet${sheetCount++}`);
        }
        const wbout = XLSX.write(wb, { type: "binary", bookType: "xlsx" });
        const arrayBuffer = new ArrayBuffer(wbout.length);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < wbout.length; i++) {
          view[i] = wbout.charCodeAt(i) & 0xff;
        }
        const blob = new Blob([arrayBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
        });
        const formattedTime = getCurrentDateTime();
        const formattedSurveyName = survey.label.replace(/[^a-zA-Z0-9]/g, "_");

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(
            blob,
            `${survey.label}.${formattedTime}`
          );
        } else {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${formattedSurveyName}_${formattedTime}`);
          document.body.appendChild(link);
          link.click();
        }
        toast({
          variant: resultTypes.DEFAULT,
          description: 
          (<ToastDescription css={{
            color:'$black900',
            fontWeight:'$7',
          }}>
            {displayMessages.SUCCESSFULLY_DOWNLOADED}
          </ToastDescription>)
        });
      }
    } catch (error) {
      console.error(`${displayMessages.ERROR_MESSAGE} : `, error);
      toast({
        variant: resultTypes.ERROR,
        title: displayMessages.ERROR_MESSAGE,
        description: displayMessages.SOMETHING_WENT_WRONG,
      });
    } finally {
      setIsDownloadInProgress(false);
    }
  };

  return (
    <StyledFlex
      css={{
        marginTop: "$40",
        fontWeight: "$4",
        color: "$neutral800",
      }}
    >
      <Flex
        alignItems="center"
        gap="$2"
        css={{
          height: "$6",
          width: "552px",
        }}
      >
        <FilledInfoSVG size={24}/>
        <Text size="$sm">
          Select a survey and download the report in .xlsx format
        </Text>
      </Flex>
      <Select
        inputValue={searchTerm}
        options={filteredGroups}
        setSelectedSurvey={setSelectedSurvey}
        selectedSurvey={selectedSurvey}
        setIsDropdownOpen={setIsDropdownOpen}
        size="xl"
        css={{
          marginTop: "$8",
          width: "552px",
          height: "$12",
          borderRadius: "$lg",
          borderColor: "$neutral200",
          color: "$neutral900",
          mt: "$2",
          color: "$custom_black_100",
          cursor:"pointer",
          "& .twigs-select__menu": {
            "& .twigs-select__option":{
              color: "$neutral900",
            "&.twigs-select__option--is-selected": {
              background: "$primary100 !important",
            }
          }
          }
        }}
        isClearable={true}
        backspaceRemovesValue={true}
        menuIsOpen={isDropdownOpen}
        onMenuOpen={() => setIsDropdownOpen(true)}
        onMenuClose={() => setIsDropdownOpen(false)}
        dropdownIndicatorIcon={<ChevronDownIcon style={{ height: '20px', width: '20px' }} color="#919191"/>}
        dropdownIndicatorPosition="right"
        placeholder={"Choose a survey"}
        onChange={(selectedOption) => {
          setSearchTerm("");
          selectedSurvey?.value !== selectedOption?.value && setSelectedSurvey(selectedOption);
          setIsDropdownOpen(false);
        }}
        onInputChange={(e, any) => {
          if (any.action === "input-change") {
            setSearchTerm(e);
            handleSurveysFiltering(e);
          }
        }}
        filterOption={() => true}
        formatGroupLabel={({ label, options }) => (
          <div>{getGroupHeader(label, options)}</div>
        )}
        components={{
          Group,
        }}
        noOptionsMessage={() => (
          <Text css={{ padding: "$2" }}>No surveys found</Text>
        )}
      />
        <Button
          size="xl"
          css={{
            marginTop: "$12",
            width: "552px",
            height: "$12",
            borderRadius: "$lg",
            backgroundColor: "$primary400",
            color: "$white900",
            cursor: "pointer",
          }}
          loading={isDownloadInProgress}
          disabled={!selectedSurvey || isDownloadInProgress}
          onClick={() => {
            setIsDownloadInProgress(true);
            handleDownloadFile(selectedSurvey);
          }}
        >
            <StyledFlex
              css={{
                flexDirection: "row",
                gap: "$2",
              }}
            >
              
              <DownloadIcon size={24} />
              <Text size="lg" css={{fontWeight:"$7"}}>
                Download Report
              </Text>
            </StyledFlex>
        </Button>
    </StyledFlex>
  );
};

export default SelectSurvey;
