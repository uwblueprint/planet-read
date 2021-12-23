import React from "react";
import { Progress } from "@chakra-ui/react";
import "./ProgressBar.css";
import { truncate } from "../../utils/Utils";

type ProgressBarProps = {
  percentageComplete: number;
  type: string;
};

const ProgressBar = ({ percentageComplete, type }: ProgressBarProps) => {
  return (
    <div className="progress-bar-container">
      <p className="progress-label">
        {type} Progress: {truncate(percentageComplete, 2)}%
      </p>
      <div>
        <Progress
          value={percentageComplete}
          size="xs"
          width="130px"
          marginRight="10px"
        />
      </div>
    </div>
  );
};

export default ProgressBar;
