import React from "react";
import "./EditableCell.css";

export type EditableCellProps = {
  text: string;
  storyTranslationContentId: number;
  lineIndex: number;
  onChange: (newContent: string, lineIndex: number) => void;
  fontSize: string;
};

const EditableCell = ({
  text,
  lineIndex,
  onChange,
  fontSize,
}: EditableCellProps) => {
  return (
    <textarea
      className="input-translation"
      value={text}
      onChange={(event) => onChange(event.target.value, lineIndex)}
      style={{ fontSize }}
    />
  );
};

export default EditableCell;
