import React, { useState, useRef, useEffect } from "react";

import { Textarea } from "@chakra-ui/react";

export type EditableCellProps = {
  text: string;
  storyTranslationContentId: number;
  lineIndex: number;
  fontSize: string;
  maxChars: number;
  onChange: (newContent: string, lineIndex: number, maxChars: number) => void;
};

const EditableCell = ({
  text,
  lineIndex,
  fontSize,
  maxChars,
  onChange,
}: EditableCellProps) => {
  const textareaRef = useRef<any>(null);
  const [height, setHeight] = useState<string>("auto");

  useEffect(() => {
    const { scrollHeight, clientHeight } = textareaRef.current;
    if (scrollHeight > clientHeight) setHeight(`${scrollHeight}px`);
    else setHeight("auto");
  });

  return (
    <Textarea
      ref={textareaRef}
      variant={
        text?.length === maxChars ? "maxCharsReached" : "translationEditable"
      }
      value={text}
      fontSize={fontSize}
      height={height}
      flexGrow={1}
      overflow="hidden"
      onChange={(event) => onChange(event.target.value, lineIndex, maxChars)}
    />
  );
};

export default EditableCell;
