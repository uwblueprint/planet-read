import React from "react";
import { Progress } from "@chakra-ui/react";
import "./ProgressBar.css";

type ProgressBarProps = {
  percentageComplete: number;
};

const ProgressBar = ({ percentageComplete }: ProgressBarProps) => {
  return (
    <div className="progress-bar-container">
      <p className="progress-label">
        Translation Progress: {percentageComplete}%
      </p>
      <div>
        <Progress value={percentageComplete} size="xs" />
      </div>
    </div>
  );
};

export default ProgressBar;
