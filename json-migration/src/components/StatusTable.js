import React from "react";
import {
  Table,
  Tbody,
  Thead,
  Th,
  Tr,
  Td,
  Flex
} from "@sparrowengg/twigs-react";
import { TickCircleIcon, AlertIcon } from "@sparrowengg/twigs-react-icons";
const StatusTable = ({ Questiondata }) => {
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      css={{
        paddingTop: "$15"
      }}
    >
      <Table
        css={{
          border: "transparent",
          width: "100%",
          paddingInline: "$20"
        }}
      >
        <Thead
          css={{
            border: "transparent",
            backgroundColor: "transparent",
            "& th": {
              border: "transparent",
              borderBottom: "1px solid $neutral300",
              textAlign: "left",
            }
          }}
        >
          <Th>Question No</Th>
          <Th>Question</Th>
          <Th>Type</Th>
          <Th>Status</Th>
        </Thead>
        <Tbody>
          {Questiondata.map((item) => {
            return (
              <Tr
                key={item.id}
                css={{
                  "& td": {
                    border: "transparent",
                    borderBottom: "1px solid $neutral300",
                    textAlign: "left"
                  }
                }}
              >
                <Td>{item.id}</Td>
                <Td>{item.question}</Td>
                <Td>{item.type}</Td>
                <Td>
                  {item.status ? (
                    <TickCircleIcon color="green" size={24} />
                  ) : (
                    <AlertIcon color="red" size={24} />
                  )}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Flex>
  );
};
export default StatusTable;