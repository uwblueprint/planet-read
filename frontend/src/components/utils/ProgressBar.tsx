import React from "react";
import { Box, Progress, Text } from "@chakra-ui/react";
import { truncate } from "../../utils/Utils";

type ProgressBarProps = {
  percentageComplete: number;
  type: string;
  fontSize: string;
};

const ProgressBar = ({
  percentageComplete,
  type,
  fontSize,
}: ProgressBarProps) => {
  let progressFontSize;
  let progressWidth;
  let progressMargin;
  switch (fontSize) {
    case "12px":
      progressFontSize = "10px";
      progressWidth = "130px";
      progressMargin = "10px";
      break;
    case "16px":
      progressFontSize = "12px";
      progressWidth = "155px";
      progressMargin = "15px";
      break;
    case "24px":
      progressFontSize = "16px";
      progressWidth = "210px";
      progressMargin = "20px";
      break;
    default:
      break;
  }

  return (
    <Box maxWidth="230px">
      <Text color="gray.400" fontSize={progressFontSize} marginBottom="8px">
        {type} Progress: {truncate(percentageComplete, 2)}%
      </Text>
      <Box>
        <Progress
          value={percentageComplete}
          size="xs"
          width={progressWidth}
          marginRight={progressMargin}
        />
      </Box>
    </Box>
  );
};

export default ProgressBar;
