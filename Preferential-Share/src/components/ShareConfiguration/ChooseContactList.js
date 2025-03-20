import React, { useEffect, useState } from "react";
import { Button, Checkbox, Flex, Text, Select, Chip } from "@sparrowengg/twigs-react";
import { components } from "react-select";

const MenuList = (props) => {
  const { children, selectProps } = props;
  const { contactList, setShowMenu, isAllContacts } = selectProps;
  return (
    <>
      <Flex
        css={{ height: "55px", borderBottom: "$borderWidths$xs solid $neutral100", padding: "0 $6", cursor: "pointer" }}
        alignItems="center"
        gap="$4"
        onClick={(e)=>selectProps.handleAllContactList(e)}
      >
        <Checkbox
          checked={isAllContacts}
          size="md"
          css={{ cursor: "pointer" }}
        />
        <Text size="md" css={{ color: "$neutral900" }}>
          All Contacts
        </Text>
      </Flex>
      <components.MenuList {...props}>{children}</components.MenuList>
      <Flex
        css={{ height: "55px", borderTop: "$borderWidths$xs solid $neutral100", padding: "0 $6" }}
        alignItems="center"
        justifyContent="end"
        gap="$4"
      >
        <Button
          variant="ghost"
          color="secondary"
          size="md"
          onClick={() => {
            setShowMenu(false);
          }}
        >
          Cancel
        </Button>
        <Button
          variant="ghost"
          size="md"
          onClick={() => {
            setShowMenu(false);
          }}
        >
          Apply
        </Button>
      </Flex>
    </>
  );
};

const Option = ({ data, selectProps, innerProps }) => {
  return (
    <Flex
      {...innerProps}
      css={{ padding: "$4 $6", cursor: "pointer" }}
      alignItems="center"
      gap="$4"
      key={data.id}
      onClick={(e) => selectProps.handleAddOption(data, e)}
    >
      <Checkbox
        size="md"
        css={{ cursor: "pointer" }}
        checked={data.isChecked}
      />
      <Text size="md" css={{ color: "$neutral900" }}>
        {data.label}
      </Text>
    </Flex>
  );
};

const ChooseContactList = ({ setIsConfigurable, setContactList, contactList, isAllContacts, setIsAllContacts }) => {
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setIsConfigurable(contactList.some((item) => item.isChecked) || isAllContacts);
  }, [contactList, isAllContacts]);


  const handleAddOption = (data,e) => {
    e.preventDefault();
    e.stopPropagation();
   const updatedContactList = contactList.map((item) => {
        if (item.id === data.id) {
          return { ...item, isChecked: !item.isChecked };
        }
        return item;
      }
    );
    setContactList(updatedContactList);
  }

  const handleAllContactList = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsAllContacts(!isAllContacts)
  };

  const handleDeleteChip = (id) => {
    const updatedContactList = contactList.map((item) => {
      if (item.id === id) {
        return { ...item, isChecked: false };
      }
      return item;
    }
  );
    setContactList(updatedContactList);
  };

  return (
    <Flex css={{ width: "100%" }} justifyContent="center">
      <Flex css={{ width: "680px" }} flexDirection="column">
        <Flex flexDirection="column" gap="$4" css={{ marginBottom: "$12" }}>
          <Text weight="bold" css={{ color: "$neutral900", fontSize: "$xl" }}>
            Send To
          </Text>
          <Text size="md" css={{ color: "$neutral800" }}>
            Select the contact lists you want to send this survey to
          </Text>
        </Flex>
        <Select
          isMulti
          menuIsOpen={showMenu}
          isClearable={false}
          hideSelectedOptions={false}
          controlShouldRenderValue={false}
          size="xl"
          placeholder="Choose contact list"
          options={[{ label: "Smart Lists", options: contactList }]}
          contactList={contactList}
          setContactList={setContactList}
          isAllContacts={isAllContacts}
          handleAddOption={handleAddOption}
          handleAllContactList={handleAllContactList}
          setShowMenu={setShowMenu}
          backspaceRemovesValue={false}
          onMenuOpen={() => setShowMenu(true)}
          value={contactList.filter((item) => item.isChecked===true)}
          onBlur={() => {
            setShowMenu(false);
          }}
          css={{
            ".twigs-select__control": {
              borderRadius: "$xl",
            },
          }}
          components={{
            MenuList,
            Option,
          }}
        />
        <Flex alignItems="center" gap="$4" css={{ marginTop: "$6", flexWrap: "wrap" }}>
          {contactList?.filter((contactList)=>contactList.isChecked).map((contact) => {
            return (
              <Chip
               key={contact.id}
                closable
                size="md"
                color="default"
                onClose={() => handleDeleteChip(contact.id)}
                css={{ padding: "$3 $6", borderRadius: "$xl", fontWeight: "500" }}
              >
                {contact.label}
              </Chip>
            );
          })}
          {isAllContacts &&
            <Chip
              key={0}
              closable
              size="md"
              color="default"
              onClose={(e) => handleAllContactList(e)}
              css={{ padding: "$3 $6", borderRadius: "$xl", fontWeight: "500" }}
            >
              All Contacts
            </Chip>}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default ChooseContactList;
