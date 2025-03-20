import React,{ useRef } from "react";
import { useEffect, useState } from "react";
import {
  UploadIcon
} from "@sparrowengg/twigs-react-icons";
import StatusTable from "./components/StatusTable";
import Loader from "./components/Loader";
import JumpToSurveyBuilder from "./components/JumpToBuilderPage";
import {postQuestion} from './functions/postQuestion'
import jsonData from './file/data.json'
import { postSurvey } from './functions/postSurvey';
import { notificationConstants } from './constants/notificationConstants';
import { message } from './constants/commonConstants';
import {
  Box,
  Button,
  Text,
  Dialog,
  Flex
} from "@sparrowengg/twigs-react";

function JsonMigration(props) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(jsonData));
  const [loader, setLoader] = useState(false);
  const [file, setFile] = useState();
  const [surveyId, setSurveyId] = useState();
  const [questionList, setQuestionList] = useState([]);
  const [fileName, setFileName] = useState('No File chosen');
  const [hasUploaded, setHasUploaded] = useState(false);
  const [uploadButton, setHasUploadButton] = useState(true);
  const ref = useRef();

  async function handleSubmit(file) {
    if (file) {
      if (file.type !== 'application/json') {
      props.client.interface.alertMessage(notificationConstants.wrongFile, { type: message.error });
      } else {
        setLoader(true);
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = async function (event) {
          try {
            const jsonData = JSON.parse(event.target.result);
            const sid = await postSurvey(jsonData['survey']);
            setSurveyId(sid);
            delete jsonData.survey;
            const newQuestionList = [];               
            for (const key in jsonData) {
              const obj = {
                id:key,
                ...jsonData[key]
              };
              try {
                const res = await postQuestion(sid, jsonData[key]); 
                if (res === 'success') {
                  obj.status = true;
                  newQuestionList.push(obj);
                } else {
                  obj.status = false;
                  newQuestionList.push(obj);
                }  
              } catch (err) {
                console.log(err);
              }     
            }  
            setQuestionList(newQuestionList);
            setLoader(false);
            setHasUploaded(true);
            props.client.interface.alertMessage(notificationConstants.success, { type: message.success });

          } catch (error) {
            console.log(error);
            props.client.interface.alertMessage(notificationConstants.errorProcessing, { type: message.failure });
            return; 
          }
        };    
      };    
    } else {
      props.client.interface.alertMessage(notificationConstants.noFile, { type: 'failure' });
    }   
  }

  return (
    <Box
      css={{
        overflowY: "auto"
      }}
    >
      <Flex
        alignItems="center"
        justifyContent="center"
        css={{
          marginTop: "$15",
          padding: "$5"
        }}
      >
        <Flex
          flexDirection="column"
          css={{
            border: "1px solid #a3a3a3",
            borderRadius: "$lg",
            padding: "$15",
            boxShadow: "$sm"
          }}
        >
          <Text
            css={{
              color: "$neutral900",
              textAlign: "center"
            }}
            size={"lg"}
            weight={"medium"}
          >Json Migration
          </Text>
          <Text
            css={{
              color: "$neutral700",
              paddingInline: "$10",
              marginTop: "$4",
              textAlign: "center"
            }}
            size={"sm"}
          >
           **Upload your .json file to get it converted into SurveySparrow
                survey**<br></br><br></br>
            Download <a href={dataStr} download="data.json">sample.json</a>
          </Text>
          <Flex
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            gap="$5"
            css={{
              marginTop: "$12"
            }}
          >
            <Flex
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              gap="$5"
            
              onClick={() => ref?.current?.click()}
              css={{
                border: "1px dashed gray",
                width: 155,
                height: 125,
                borderRadius: "$xl",
                cursor: "pointer"
              }}
            >
              <input
                type="file"
                id="upload"
                hidden
                ref={ref}
                accept=".json"
                onChange={({ target: { files } }) => {
                  files[0] && setFileName(files[0].name);
                  setFile(files[0]);
                  setHasUploadButton(false);
                }}
              />
              <UploadIcon />
              <Text size="sm" css={{ color: "$neutral700" }}>
                Choose File
              </Text>
            </Flex>
            <Text
              size={"xs"}
              css={{
                color: "#63686F"
              }}
            >
              {fileName}
            </Text>
          </Flex>
          <Flex
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            css={{
              marginBlock: "$10"
            }}
          >
            <Dialog>
    
                <Button
                  isDisabled={uploadButton}
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    handleSubmit(file);
                  }}
                >
                  Upload
                </Button>
             
            </Dialog>
          </Flex>
        </Flex>
      </Flex>
      {(hasUploaded) && <JumpToSurveyBuilder SurveyId={surveyId} /> }
      {loader && <Loader /> }
      {hasUploaded && <StatusTable Questiondata={questionList} />}
    </Box>
  );
   
    }

export default JsonMigration;
