import React from "react";

import { Textarea } from "@chakra-ui/react";

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
    <Textarea
      variant={
        text.length === maxChars ? "maxCharsReached" : "translationEditable"
      }
      value={text}
      onChange={(event) => onChange(event.target.value, lineIndex, maxChars)}
    />
  );
};

export default EditableCell;
