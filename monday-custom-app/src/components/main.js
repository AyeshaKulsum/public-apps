import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Switch,
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
  toast,
  Select
} from "@sparrowengg/twigs-react";
import { EVENTS } from "../commons/constants";
import { Spinner } from "../commons/components/spinner";
import { components } from "react-select";

const Main = ({
  client,
  events,
  setEvents,
  currentBoard,
  setCurrentBoard,
  setCurrentColumn,
  currentColumn
}) => {
  const [boards, setBoards] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loader, setLoader] = useState(true);
  const [btnLoader, setBtnLoader] = useState(false);

  const handleEventChange = (status, property) => {
    setEvents((prev) => ({ ...prev, [property]: status }));
  };

  const getAllBoards = async () => {
    try {
      let query =
        "query { boards { id name state permissions items_page { items { id name }} columns { id title }}}";

      const response = await client.request.post(
        "https://api.monday.com/v2",
        {
          options: {
            headers: {
              Authorization: "Bearer <%=access_token%>",
              "Content-Type": "application/json"
            },
            isOAuth: true,
            maxAttempts: 5
          }
        },
        JSON.stringify({
          query: query
        })
      );
      const boards = JSON.parse(response)?.body?.data?.boards;
      setBoards(
        boards.map((board) => ({
          ...board,
          label: board.name,
          value: board.id
        }))
      );
    } catch (error) {
      console.log(error);
      toast({
        variant: "error",
        description: "Error when fetching the boards"
      });
    } finally {
      if (currentBoard.length) {
        handleColumns(currentBoard)
      }
      setLoader(false);
    }
  };

  const saveEventMapping = async () => {
    setBtnLoader(true);
    try {
      await client?.request?.invoke("saveEventMapping", {
        events,
        board: currentBoard,
        column: currentColumn
      });
      toast({
        variant: "success",
        description: "Events has been updated successfully"
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "error",
        description: "Error when saving the event configuration"
      });
    } finally {
      setBtnLoader(false);
    }
  };

  const handleColumns = boards => {
    const columnsValue = [];
    boards.forEach((item) => {
      const columns = item.columns;
      columns.forEach((column) => {
        columnsValue.push({
          id: column.id,
          label: `${column.title} (${item.label})`,
          value: `${column.title} (${item.label})-${column.id}`
        });
      });
    });
    setColumns(columnsValue ?? []);
  }

  useEffect(() => {
    getAllBoards();
  }, []);
  return (
    <Box css={{ width: "100%", height: "100vh" }}>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        css={{
          padding: "$8 $12",
          borderBottom: "$borderWidths$xs solid $neutral200"
        }}
      >
        <Heading css={{ color: "$neutral900" }} weight="semibold" size="h5">
        ContactSync Pro
        </Heading>
        <Button
          size="lg"
          disabled={!currentColumn?.length || !currentBoard?.length || btnLoader}
          onClick={saveEventMapping}
          loading={btnLoader}
        >
          Save
        </Button>
      </Flex>
      <Box css={{ padding: "$12 $16" }}>
        <Text size="md" weight="regular" css={{ color: "$neutral900" }}>
          When a contact update event is triggered, select the essential
          properties that need to be updated on monday.com
        </Text>
        <Flex
          css={{ width: "100%", marginTop: "$6" }}
          gap="$6"
          alignItems="center"
        >
          <Select
            size="xl"
            placeholder="Choose Board"
            isDisabled={loader}
            options={boards}
            isMulti
            value={currentBoard}
            css={{
              maxWidth: 600,
              width: "100%",
              "& .twigs-select__control": {
                overflow: "auto"
              }
            }}
            onChange={(boards) => {
              if (!boards?.length) {
                setCurrentBoard([]);
                setCurrentColumn([]);
                return;
              }
              setCurrentBoard(boards);
              handleColumns(boards);
            }}
          />
          <Select
            size="xl"
            isDisabled={!currentBoard?.length}  
            placeholder="Choose Column"
            value={currentColumn}
            options={columns}
            isMulti
            getOptionLabel={option => option.label}
            getOptionValue={option => option.value}
            css={{
              maxWidth: 600,
              width: "100%",
              "& .twigs-select__control": {
                overflow: "auto"
              }
            }}   
            onChange={(column) => setCurrentColumn(column)}
            components={{
              Option: CustomOption
            }}
          />
        </Flex>
        <Flex
          alignItems="center"
          justifyContent="center"
          css={{ width: "100%", marginTop: "$12" }}
        >
          <Flex
            flexDirection="column"
            gap="$12"
            css={{ width: "100%" }}
            alignItems="center"
          >
            {loader ? (
              <Flex alignItems="center" css={{ height: 400 }}>
                <Spinner />
              </Flex>
            ) : (
              <Table
                css={{
                  width: "100%",
                  borderCollapse: "collapse",
                  border: "$borderWidths$xs solid $neutral200"
                }}
              >
                <Thead>
                  <Th>Events</Th>
                  <Th>Status</Th>
                </Thead>
                <Tbody>
                  {EVENTS.map((event) => (
                    <Tr
                      gap="$6"
                      justifyContent="space-between"
                      css={{ width: "100%" }}
                      key={event.id}
                    >
                      <Td>
                        <Text weight="medium" size="md">
                          {event.text}
                        </Text>
                      </Td>
                      <Td>
                        <Flex
                          alignItems="center"
                          justifyContent="center"
                          css={{ padding: "$5" }}
                        >
                          <Switch
                            size="md"
                            onChange={(status) =>
                              handleEventChange(status, event.value)
                            }
                            checked={events[event.value]}
                          />
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};


const CustomOption = (props) => {
  return (
    <components.Option key={props.data.id} {...props}>
      {props.children}
    </components.Option>
  )
}

export default Main;
