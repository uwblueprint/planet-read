import React from "react";
import "./ToggleButton.css";

export type ToggleButtonProps = {
  leftStateIsSelected: boolean;
  leftStateLabel: string;
  rightStateLabel: string;
  onToggle: (newState: boolean) => void;
};

const ToggleButton = ({
  leftStateIsSelected,
  leftStateLabel,
  rightStateLabel,
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
      onClick={() => onToggle(!leftStateIsSelected)}
      onKeyUp={() => onToggle(!leftStateIsSelected)}
      role="checkbox"
      aria-label={`Check for ${leftStateLabel} and uncheck to show ${rightStateLabel}`}
      aria-checked={leftStateIsSelected}
      tabIndex={0}
    >
      <div className="toggle-button">
        <div
          className={`left-checked-option 
          ${leftStateIsSelected ? "selected" : "unselected"}
          `}
        >
          <span>{leftStateLabel}</span>
        </div>
        <div
          className={`right-unchecked-option 
            ${!leftStateIsSelected ? "selected" : "unselected"}
          `}
        >
          <span>{rightStateLabel}</span>
        </div>
      </div>
    </div>
  );
};

export default ToggleButton;
