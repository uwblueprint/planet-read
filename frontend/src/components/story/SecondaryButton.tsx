import React from "react";
import "./SecondaryButton.css";

type SecondaryButtonProps = {
  displayText: string;
  onClick: () => void;
};

const SecondaryButton = ({ displayText, onClick }: SecondaryButtonProps) => {
  return (
    <button
      type="button"
      className="btn btn-outline-dark secondary-button"
      onClick={onClick}
    >
      {displayText}
    </button>
  );
};

export default SecondaryButton;
