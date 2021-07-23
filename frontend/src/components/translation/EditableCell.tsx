import React from "react";
import "./EditableCell.css";

export type EditableCellProps = {
  text: string;
  storyTranslationContentId: number;
  lineIndex: number;
  onChange: (newContent: string, lineIndex: number) => void;
};

const EditableCell = ({ text, lineIndex, onChange }: EditableCellProps) => {
  return (
    <textarea
      className="input-translation"
      value={text}
      onChange={(event) => onChange(event.target.value, lineIndex)}
    />
  );
};

export default EditableCell;
