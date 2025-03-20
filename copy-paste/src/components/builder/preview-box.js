import React from "react";
import { Box, Flex, Input, Slider, Text } from "@sparrowengg/twigs-react";
import {
  CalendarIcon,
  GripDotsVerticalIcon
} from "@sparrowengg/twigs-react-icons";
import { Camera, Star, Like, Pen, FileUpload } from "../icons";
import { commonConstants } from "../../constants/common-constants";

const PreviewBox = ({ currentQuestionType }) => {
  const _checkCurrentType = (expectedType) =>
    currentQuestionType?.includes(expectedType);
  const { questionType } = commonConstants;
  switch (currentQuestionType) {
    case questionType.textInput:
    case questionType.emailInput:
    case questionType.urlInput:
      return (
        <TextComponent
          _checkCurrentType={_checkCurrentType}
        />
      );
    case questionType.phoneNumber:
    case questionType.numberInput:
    case questionType.dateTime:
      return (
        <NumberComponent
          _checkCurrentType={_checkCurrentType}
        />
      );
    case questionType.rating:
    case questionType.slider:
    case questionType.opinionScale:
    case questionType.yesNo:
      return (
        <RatingComponent
          _checkCurrentType={_checkCurrentType}
        />
      );
    case questionType.signature:
    case questionType.cameraInput:
    case questionType.fileInput:
      return (
        <UploadComponent
          _checkCurrentType={_checkCurrentType}
        />
      );
    default:
      return null;
  }
};

const TextComponent = ({ _checkCurrentType }) => {
  const { questionType } = commonConstants;
  const isURLType = _checkCurrentType(questionType.urlInput);
  const placeholder = isURLType
    ? "Enter URL"
    : _checkCurrentType(questionType.textInput)
    ? "Type here"
    : "Enter Email";
  return (
    <Box css={{ marginTop: "$8", "& input": { cursor: "initial !important" } }}>
      <Input disabled placeholder={placeholder} />
    </Box>
  );
};

const NumberComponent = ({ _checkCurrentType }) => {
  const { questionType } = commonConstants;

  const isPhoneNumberType = _checkCurrentType(questionType.phoneNumber);
  const isDateTimeType = _checkCurrentType(questionType.dateTime);

  return (
    <Box css={{ marginTop: "$8", "& input": { cursor: "initial !important" } }}>
      {!isPhoneNumberType ? (
        <Input
          disabled
          placeholder={isDateTimeType ? "DD/MM/YYYY" : "Enter Number"}
          rightIcon={isDateTimeType ? <CalendarIcon /> : <></>}
        />
      ) : (
        <Flex gap="$4" alignItems="center">
          <Input placeholder="+1" disabled css={{ width: "$8" }} />
          <Input placeholder="Phone Number" disabled css={{ width: "100%" }} />
        </Flex>
      )}
    </Box>
  );
};

const RatingComponent = ({ _checkCurrentType }) => {
  const { questionType } = commonConstants;

  const isRatingType = _checkCurrentType(questionType.rating);
  const isSliderType = _checkCurrentType(questionType.slider);
  const isOpinionScale = _checkCurrentType(questionType.opinionScale);
  const isYesNoQuestion = _checkCurrentType(questionType.yesNo);
  return (
    <>
      {isRatingType ? (
        <Flex alignItems="center" gap="$1" css={{ marginTop: "$6" }}>
          {commonConstants.iconStarsCount.map((_, idx) => (
            <Star key={idx} />
          ))}
          <Star />
        </Flex>
      ) : null}
      {isSliderType ? (
        <Slider
          defaultValue={[50]}
          min={0}
          max={100}
          labelPlacement="bottom"
          labels={{
            left: "0",
            right: "100"
          }}
          css={{ marginTop: "$8" }}
          disabled
          components={{
            Thumb: () => (
              <Slider.Thumb
                css={{
                  backgroundColor: "$neutral500",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "initial",
                  "&:hover": {
                    background: "$neutral500",
                    boxShadow: "none"
                  }
                }}
              >
                <GripDotsVerticalIcon color="#fff" />
              </Slider.Thumb>
            ),
            Track: ({ children }) => (
              <Box
                css={{
                  width: "100%",
                  height: "$3",
                  position: "absolute",
                  backgroundColor: "$neutral200",
                  borderRadius: "30px",
                  "& > span": {
                    backgroundColor: "$neutral500"
                  }
                }}
              >
                {children}
              </Box>
            )
          }}
        >
        </Slider>
      ) : null}
      {isOpinionScale ? (
        <Flex
          alignItems="center"
          css={{
            background: "$neutral50",
            border: "1.2px solid $neutral200",
            borderRadius: "8px",
            marginTop: "$8"
          }}
        >
          {commonConstants.opinionScaleCount.map((_, idx) => (
            <Flex
              alignItems="center"
              justifyContent="center"
              css={{
                textAlign: "center",
                width: "37.6px",
                height: "$8",
                color: "$neutral400",
                fontSize: "$xs",
                borderLeft: "1.2px solid $neutral200",
                "&:first-child": {
                  borderLeft: "none"
                }
              }}
              key={idx}
            >
              {idx + 1}
            </Flex>
          ))}
        </Flex>
      ) : null}
      {isYesNoQuestion ? (
        <Flex alignItems="center" gap="$8" css={{ marginTop: "$8" }}>
          <Flex
            flexDirection="column"
            gap="$2"
            css={{
              borderRadius: "8px",
              border: "1.2px solid $neutral200",
              padding: "7px $2 11px $2",
              height: "$14",
              textAlign: "center",
              background: "$neutral50"
            }}
          >
            <Box
              as="span"
              css={{
                width: "$12"
              }}
            >
              <Like />
            </Box>
            <Text size="xs" css={{ color: "$neutral500" }}>
              Yes
            </Text>
          </Flex>
          <Flex
            flexDirection="column"
            gap="$2"
            css={{
              borderRadius: "8px",
              textAlign: "center",
              border: "1.2px solid $neutral200",
              padding: "7px $2 11px $2",
              height: "$14",
              background: "$neutral50"
            }}
          >
            <Box as="span" css={{ transform: "scaleY(-1)", width: "$12" }}>
              <Like />
            </Box>
            <Text size="xs" css={{ color: "$neutral500" }}>
              No
            </Text>
          </Flex>
        </Flex>
      ) : null}
    </>
  );
};

const UploadComponent = ({ _checkCurrentType }) => {
  const { questionType } = commonConstants;
  const isSignatureType = _checkCurrentType(questionType.signature);
  const isFileUpload = _checkCurrentType(questionType.fileInput);
  const data = isSignatureType
    ? { icon: <Pen />, text: "Sign here" }
    : isFileUpload
    ? { icon: <FileUpload />, text: "Upload your file here" }
    : { icon: <Camera />, text: "Take a Photo" };

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      css={{
        width: "100%",
        background: "$neutral50",
        borderRadius: "8px",
        border: "1.2px dashed $neutral200",
        marginTop: "$8",
        paddingBlock: "$6"
      }}
      gap="$2"
    >
      {data.icon}
      <Text
        weight="medium"
        size="xs"
        css={{ lineHeight: "$xs", color: "$neutral400" }}
      >
       {data.text}
      </Text>
    </Flex>
  );
};

export default PreviewBox;
