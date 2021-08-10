import React from "react";
import "./EditableCell.css";

export type EditableCellProps = {
  text: string;
  storyTranslationContentId: number;
  lineIndex: number;
  maxChars: number;
  onChange: (newContent: string, lineIndex: number, maxChars: number) => void;
};

const EditableCell = ({
  text,
  lineIndex,
  maxChars,
  onChange,
}: EditableCellProps) => {
  return (
    <textarea
      className={
        text.length === maxChars ? "max-char-reached" : "input-translation"
      }
      value={text}
      onChange={(event) => onChange(event.target.value, lineIndex, maxChars)}
    />
  );
};

export default EditableCell;
