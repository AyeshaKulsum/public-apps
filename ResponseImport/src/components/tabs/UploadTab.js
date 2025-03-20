import React from "react";
import {
  Box,
  Button,
  IconButton,
  Text,
  Flex,
  Link
} from "@sparrowengg/twigs-react";
import { FileUploader } from "react-drag-drop-files";
import { DownloadIcon, FileUploadIcon } from "@sparrowengg/twigs-react-icons";
import { commonConstants } from "../../constants/commonConstants";
import Loader from "../Loader";

export const UploadTab = ({
  loading,
  handleChange,
  fileTypes,
  uploadedFile
}) => {
  const uploadZone = (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      css={{
        border: "1px dashed black",
        borderRadius: "10px",
        padding: "$15 150px $20 150px",
        backgroundColor: "#F6F6F6"
      }}
    >
      <FileUploadIcon />

      <Text size={"sm"} css={{ marginTop: "$10" }}>
        {commonConstants.dragAndDropOrChooseYourFile}
      </Text>
      <Text size={"sm"} css={{ marginTop: "$6" }}>
        {commonConstants.onlyCsvSupported}
      </Text>
    </Flex>
  );

  return loading ? (
    <Loader />
  ) : (
    <Flex alignItems="center" flexDirection="column" justifyContent="center">
      <Text size={"lg"} weight="bold">
        {commonConstants.uploadYourFile}
      </Text>
      <Flex
        css={{
          marginTop: "$5",
          alignItems: "center"
        }}
      >
        <Text
          css={{
            color: "$neutral300"
          }}
        >
          {commonConstants.beforeUploadCheckIfCSV}
        </Text>
        <Text
          onClick={() =>
            window.open(commonConstants.seeGuidelinesLink, "_blank")
          }
          css={{ cursor: "pointer", marginLeft: "$2", color: "$link" }}
        >
          See Guidelines
        </Text>
      </Flex>
      <Flex
        justifyContent="center"
        alignItems="center"
        css={{
          marginTop: "$10"
        }}
      >
        <Button
          onClick={() => window.open(commonConstants.sampleCSVLink)}
          css={{
            padding: "20px"
          }}
          iconLeft={<DownloadIcon />}
          variant="default"
          size="sm"
        >
          Download Sample CSV
        </Button>
      </Flex>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        css={{
          marginTop: "$10"
        }}
      >
        <FileUploader
          handleChange={handleChange}
          name="file"
          types={fileTypes}
          children={uploadZone}
          multiple={false}
        />
        <Text size={"md"} css={{ marginTop: "$10" }}>
          {uploadedFile
            ? `File name: ${uploadedFile.name}`
            : "No files uploaded yet"}
        </Text>
      </Flex>
    </Flex>
  );
};
