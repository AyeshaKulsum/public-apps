import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Calendar,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  Flex,
  Input,
  Text,
  Tooltip,
  IconButton,
} from "@sparrowengg/twigs-react";
import { parseAbsoluteToLocal } from "@internationalized/date";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
  SearchIcon,
} from "@sparrowengg/twigs-react-icons";
import { booleanOptions, noPreferenceOptions, surveyVariables } from "../../constants/common";
import dayjs from "dayjs";
import { addFieldsToDb, removeFieldsFromDb } from "../../helpers/storageFunctions";
import CustomAlertModal from "./CustomAlertModal";

const RenderDropdownContent = ({
  type,
  options,
  props,
  setAllOptions,
  openFilter,
  setOpenFilter,
  condition,
  filters,
  setFilters,
  field,
  subCondition,
}) => {
  const updateConditionInFilter = (updatedSubConditions) => {
    return {
      ...filters,
      conditions: filters.conditions.map((cond) => {
        if (cond.id === condition.id) {
          return updatedSubConditions;
        }
        return cond;
      }),
    };
  };

  const updateSubCondition = (item) => {
    return {
      ...condition,
      subConditions: condition.subConditions.map((subCond) => {
        if (subCond.id === subCondition.id) {
          return {
            ...subCond,
            [field.value]: item,
          };
        }
        return subCond;
      }),
    };
  };

  const handleOptionClick = (item) => {
    const updatedSubConditions = updateSubCondition(item);
    const updatedFilters = updateConditionInFilter(updatedSubConditions);
    setFilters(updatedFilters);
    setOpenFilter(false);
  };

  switch (type) {
    case "DROPDOWN":
      const [filteredOptions, setFilteredOptions] = useState(options);
      const [searchValue, setSearchValue] = useState("");
      const [openAlertModal, setOpenAlertModal] = useState(false);

      const onSearchChange = (e) => {
        setSearchValue(e.target.value);
        setFilteredOptions(
          options?.filter((item) =>
            item.label?.toLowerCase().includes(e.target.value.toLowerCase())
          )
        );
      };

      const handleDeleteField = async (id) => {
        setAllOptions(options.filter((item) => item.id !== id));
        await removeFieldsFromDb(props, id);
      };

      useEffect(() => {
        setFilteredOptions(options);
      }, [options]);

      return (
        <>
          <Input
            size="lg"
            variant="filled"
            placeholder="Search"
            leftIcon={<SearchIcon />}
            css={{ margin: "$4" }}
            onChange={onSearchChange}
          />
          <Box
            css={{
              maxHeight: "280px",
              marginBottom: "$6",
              overflowY: "auto",
            }}
          >
            {filteredOptions?.length > 0 ? (
              filteredOptions?.map((item) => (
                <>
                  <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    css={{
                      color: '$neutral900',
                      padding: '$3 $6',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColorOpacity: ['secondary500', '0.08'],
                      },
                    }}
                    onClick={() => handleOptionClick(item)}
                  >
                    <Text>{item.label}</Text>
                    {item?.type !== surveyVariables.name && (
                      <IconButton
                        icon={<DeleteIcon />}
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenAlertModal(item.id);
                        }}
                      />
                    )}
                  </Flex>
                  <CustomAlertModal
                    openAlertModal={openAlertModal === item.id}
                    setOpenAlertModal={setOpenAlertModal}
                    title="Confirm Delete"
                    description="Are you sure you want to delete this field? This action cannot be undone."
                    actionButtonText="Delete"
                    handleAction={()=>handleDeleteField(item.id)}
                  />
                </>
              ))
            ) : (
              <Tooltip
                content={ searchValue?.length < 1 ? 'Type above to add a new field' : null }
                side="right"
              >
                <Text
                  css={{
                    color: '$neutral900',
                    cursor: searchValue?.length < 1 ? 'not-allowed' : 'pointer',
                    padding: '$3 $6',
                    wordBreak: 'break-all',
                    '&:hover': {
                      backgroundColorOpacity: ['secondary500', '0.08'],
                    },
                    opacity: searchValue?.length < 1 ? 0.5 : 1,
                  }}
                  onClick={
                    searchValue?.length < 1
                      ? () => {}
                      : async () => {
                          const item = {
                            id: Math.random().toString(36).substring(2, 13),
                            label: searchValue,
                            value: searchValue.replace(/ /g, '_').toUpperCase(),
                          };
                          handleOptionClick(item);
                          setAllOptions([item, ...(options || [])]);
                          await addFieldsToDb(props, item);
                        }
                  }
                >
                  Add "{searchValue}"
                </Text>
              </Tooltip>
            )}
          </Box>
        </>
      );
    case "NESTED_DROPDOWN":
      const [stepValue, setStepValue] = useState({
        step: 0,
        parent: null,
        nestedOptions: null,
      });
      return (
        <>
          {stepValue.step === 0 ? (
            <>
              <Box>
                <Text
                  css={{
                    color: "$neutral900",
                    padding: "$3 $6",
                    margin: "$6 0 $4 0",
                    "&:hover": {
                      backgroundColorOpacity: ["secondary500", "0.08"],
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => handleOptionClick(noPreferenceOptions)}
                >
                  No Preference
                </Text>
                <DropdownMenuSeparator />
                <DropdownMenuLabel css={{ color: "$neutral600" }}>
                  SELECT DATA TYPE
                </DropdownMenuLabel>
                {options?.map((item) => (
                  <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    css={{
                      width: "100%",
                      cursor: "pointer",
                      ".rightArrow": { visibility: "hidden" },
                      "&:hover": {
                        backgroundColorOpacity: ["secondary500", "0.08"],
                        ".rightArrow": { visibility: "visible" },
                      },
                      color: "$neutral900",
                      padding: "$3 $6",
                    }}
                    onClick={() => {
                      if (item.value === "BOOLEAN") {
                        handleOptionClick({
                          id: item.id,
                          label: item.label,
                          value: item.value,
                        });
                        setOpenFilter(false);
                        return;
                      }
                      if (item.nestedOptions) {
                        setStepValue({
                          step: 1,
                          parent: { label: item.label, value: item.value },
                          nestedOptions: item.nestedOptions,
                        });
                      }
                    }}
                  >
                    <Box>
                      <Text css={{ color: "$neutral900" }}>{item.label}</Text>
                      <Text size="xs" css={{ color: "$neutral700" }}>
                        {item.subLabel}
                      </Text>
                    </Box>
                    <ChevronRightIcon size="20" className="rightArrow" />
                  </Flex>
                ))}
              </Box>
              <Text
                size="xs"
                css={{
                  color: "$neutral600",
                  backgroundColorOpacity: ["$secondary500", 0.04],
                  padding: "$6 $8",
                }}
              >
                Select the right data type for the mapping to prevent errors
                when sharing value.
              </Text>
            </>
          ) : (
            <>
              <Flex
                alignItems="center"
                gap="$2"
                css={{
                  padding: "$5 $6 $5 $4",
                  backgroundColorOpacity: ["secondary500", "0.06"],
                  borderBottom: "$borderWidths$xs solid #64748B14",
                  borderTopLeftRadius: "$xl",
                  borderTopRightRadius: "$xl",
                }}
              >
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  css={{ cursor: "pointer" }}
                  onClick={() =>
                    setStepValue({
                      step: 0,
                      parent: null,
                      nestedOptions: null,
                    })
                  }
                >
                  <ChevronLeftIcon size="20" strokeWidth="2" color="#76859A" />
                </Flex>
                <Box
                  css={{
                    height: "$4",
                    borderRight: "$borderWidths$xs solid $secondary100",
                  }}
                />
                <Text
                  css={{
                    display: "inline-flex",
                    gap: "$2",
                    marginLeft: "$2",
                    color: "$secondary400",
                  }}
                >
                  <Text>{stepValue.parent?.label}</Text>
                  <Text>&gt;</Text>
                  <Text weight="medium" css={{ color: "$secondary600" }}>
                    Choose
                  </Text>
                </Text>
              </Flex>
              <Box css={{ padding: "$4 0" }}>
                {stepValue.nestedOptions?.map((item) => (
                  <Text
                    css={{
                      color: "$neutral900",
                      padding: "$3 $6",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColorOpacity: ["secondary500", "0.08"],
                      },
                    }}
                    onClick={() =>
                      handleOptionClick({
                        ...item,
                        parent: stepValue.parent,
                      })
                    }
                  >
                    {item.label}
                  </Text>
                ))}
              </Box>
            </>
          )}
        </>
      );
    case "TEXT":
      const [value, setValue] = useState(null);
      const [dateValue, setDateValue] = useState(
        parseAbsoluteToLocal(dayjs().toISOString())
      );
      return (
        <>
          {subCondition?.operator?.value === "BOOLEAN" ? (
            <Box css={{ margin: "$6 0" }}>
              {booleanOptions?.map((item) => (
                <Text
                  css={{
                    color: "$neutral900",
                    padding: "$3 $6",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColorOpacity: ["secondary500", "0.08"],
                    },
                  }}
                  onClick={() => handleOptionClick(item)}
                >
                  {item.label}
                </Text>
              ))}
            </Box>
          ) : subCondition?.operator?.parent?.value === "DATE_TIME" ? (
            <>
              <Calendar
                size="md"
                footerActionText="Apply"
                value={dateValue}
                showTimePicker
                footerAction={() =>
                  handleOptionClick(
                    dayjs(dateValue.toDate()).format("MMM D, YYYY • h:mm A")
                  )
                }
                containerCSS={{ border: "0" }}
                onChange={(date) =>
                  setDateValue(
                    parseAbsoluteToLocal(date.toDate().toISOString())
                  )
                }
              />
            </>
          ) : (
            <>
              <Box css={{ margin: "$4" }}>
                <Input
                  size="lg"
                  placeholder="Enter a value"
                  onChange={(e) => setValue(e.target.value)}
                />
              </Box>
              <Flex
                alignItems="center"
                justifyContent="space-between"
                css={{
                  width: "100%",
                  borderTop: "$borderWidths$xs solid $neutral100",
                  padding: "$4 $6",
                }}
              >
                <Button
                  size="md"
                  variant="ghost"
                  color="secondary"
                  onClick={() => setOpenFilter(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="md"
                  variant="ghost"
                  onClick={() => handleOptionClick(value)}
                  disabled={!value}
                >
                  Apply
                </Button>
              </Flex>
            </>
          )}
        </>
      );
  }
};

const Filter = ({
  options,
  props,
  setAllOptions,
  type,
  field,
  condition,
  filters,
  setFilters,
  subCondition,
}) => {
  const [openFilter, setOpenFilter] = useState(
    subCondition[field.value] ? false : true
  );
  const hasError =
    field.value === "value" && !subCondition[field.value] && !openFilter;

  const getSubConditionLabel = (subCondition) => {
    switch (subCondition?.value) {
      case "BOOLEAN":
        return "is";
      case "NO_PREFERENCE":
        return "";
      default:
        return subCondition?.label || subCondition;
    }
  };

  return (
    <DropdownMenu open={openFilter} size="sm">
      <DropdownMenuTrigger asChild>
        {subCondition[field.value] ? (
          <Text
            weight="medium"
            css={{
              color: field.value === "operator" ? "$neutral600" : "$neutral800",
              maxWidth: "180px",
            }}
            truncate
          >
            {getSubConditionLabel(subCondition[field.value])}
          </Text>
        ) : (
          <Box onClick={() => setOpenFilter(true)}>
            <Tooltip
              side="right"
              content={hasError ? "Enter Value to complete the condition" : ""}
            >
              <Text
                weight="medium"
                css={{
                  color: hasError ? "$negative600" : "$primary700",
                  backgroundColorOpacity: hasError
                    ? ["$negative500", "0.1"]
                    : ["$primary500", "0.2"],
                  padding: "$1 $3",
                  borderRadius: "$sm",
                  cursor: "pointer",
                }}
              >
                {field.label}
              </Text>
            </Tooltip>
          </Box>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
        onPointerDownOutside={() => setOpenFilter(false)}
        css={{
          padding: "0",
          width: "260px",
          borderRadius: "$xl",
        }}
        sideOffset={5}
        align="start"
      >
        <RenderDropdownContent
          type={type}
          options={options}
          props={props}
          setAllOptions={setAllOptions}
          openFilter={openFilter}
          setOpenFilter={setOpenFilter}
          condition={condition}
          filters={filters}
          setFilters={setFilters}
          field={field}
          subCondition={subCondition}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Filter;
