import React from "react";
import { DownloadIcon } from "@sparrowengg/twigs-react-icons";
import { CsvUploadSVG } from "./icons/index";
import {
  Box,
  Text,
  Flex,
  Input,
} from "@sparrowengg/twigs-react";

const Upload = ({ fileRef, handleFileUpload, isAuthenticated, triggerToastr }) => {

  return (
    <Flex
      flexDirection="column"
      css={{
        width: "100%",
        height: "100%",
        padding: "$16 $28 0 $28",
      }}
    >
      <Box>
        <Text
          as="span"
          weight="bold"
          css={{ color: "$neutral900", fontSize: "23px" }}
        >
          Upload Document
        </Text>
        <Text
          size="md"
          css={{
            color: "$neutral800",
            marginTop: "$4",
            display: "flex",
            alignItems: "center",
            flexWrap:'wrap'
          }}
        >
          <Text as='span' size='md'>
            Please upload your .qsf file to convert it to SurveySparrow Survey, ensuring that the placeholder structure is properly maintained.
          </Text>
        </Text>
      </Box>
      <Flex
        alignItems="center"
        justifyContent="center"
        css={{
          width: "100%",
          height: "100%",
          marginTop: "$12",
          border: "$borderWidths$xs dashed $neutral300",
          borderRadius: "$xl",
          cursor: "pointer",
          height:'75vh' 
        }}
        onClick={() => isAuthenticated ? fileRef?.current?.click() : triggerToastr({
          data : {title : "Bad Token", description : "Please authenticate again with valid token."}
        })}
      >
        <Flex
          flexDirection="column"
          alignItems="center"
        >
          <CsvUploadSVG />
          <Input
            type="file"
            id="upload"
            hidden
            ref={fileRef}
            accept=".qsf"
            onChange={(files) => handleFileUpload(files)}
          />
          <Text
            size="md"
            weight="regular"
            css={{ color: "$neutral700", marginTop: "$10" }}
          >
            Upload your .qsf file here
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Upload;
