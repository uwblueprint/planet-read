import React from "react";
import { ProgressBar } from "react-bootstrap";
import "./TranslationProgressBar.css";

type TranslationProgressBarProps = {
  percentageComplete: number;
};

const TranslationProgressBar = ({
  percentageComplete,
}: TranslationProgressBarProps) => {
  return (
    <div className="progress-bar-container">
      <p className="progress-label">
        Translation Progress: {percentageComplete}%
      </p>
      <div>
        <ProgressBar now={percentageComplete} />
      </div>
    </div>
  );
};

export default TranslationProgressBar;
