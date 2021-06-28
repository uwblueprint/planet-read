import React from "react";
import "./PrimaryButton.css";

type PrimaryButtonProps = {
  displayText: string;
  onClick: () => void;
};

const PrimaryButton = ({ displayText, onClick }: PrimaryButtonProps) => {
  return (
    <button
      type="button"
      className="btn btn-dark primary-button"
      onClick={onClick}
    >
      {displayText}
    </button>
  );
};

export default PrimaryButton;
