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
      css={{
        paddingBottom:"$24",
        overflowY: "auto"
      }}
    >
      <Table
        css={{
          border: "transparent",
          width: "100%",
        }}
      >
        <Thead
          css={{
            border: "transparent",
            backgroundColor: "transparent",
            borderBottom: '$borderWidths$xs solid $neutral200',
            position: 'sticky',
            top:'0',
            background: 'white',
            "& th": {
              border: "transparent",
              borderBottom: "none",
              textAlign: "left",
            }
          }}
        >
          <Th>Question No</Th>
          <Th>Question</Th>
          <Th>Status</Th>
        </Thead>
        <Tbody>
          {Questiondata.filter((item)=>!item.status).map((item) => {
            return (
              <Tr
                key={item.qId}
                css={{
                  "& td": {
                    border: "transparent",
                    borderBottom: "1px solid $neutral300",
                    textAlign: "left"
                  }
                }}
              >
                <Td>{item.qId}</Td>
                <Td>{item.question}</Td>
                <Td>
                  {item.status ? (
                    <TickCircleIcon color="#56B0BB" size={24} />
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
