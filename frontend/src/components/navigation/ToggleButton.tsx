import React from "react";
import "./ToggleButton.css";

export type ToggleButtonProps = {
  currentState: boolean;
  trueStateName: string;
  falseStateName: string;
  onToggle: (newState: boolean) => void;
};

const ToggleButton = ({
  currentState,
  trueStateName,
  falseStateName,
  onToggle,
}: ToggleButtonProps) => {
  /**
   * How can we make it super visible that the true state is always displayed on the left
   * Or do we want this to change?
   * Right now, just specified in logic / className
   *
   * Left = checked = true
   * Right = unchecked = false
   */

  return (
    <div
      onClick={() => onToggle(!currentState)}
      onKeyUp={() => onToggle(!currentState)}
      role="checkbox"
      aria-label={`Check for ${trueStateName} and uncheck to show ${falseStateName}`}
      aria-checked={currentState}
      tabIndex={0}
    >
      <div className="toggle-button">
        <div
          className={`left-checked-option 
          ${currentState ? "selected" : "unselected"}
          `}
        >
          <span>{trueStateName}</span>
        </div>
        <div
          className={`right-unchecked-option 
            ${!currentState ? "selected" : "unselected"}
          `}
        >
          <span>{falseStateName}</span>
        </div>
      </div>
    </div>
  );
};

export default ToggleButton;
