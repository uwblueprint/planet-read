import React from "react";

import "./TranslationTable.css";
import { Badge, Box, Button, Flex } from "@chakra-ui/react";
import Cell from "./Cell";
import EditableCell from "./EditableCell";
import { StoryLine } from "./Autosave";

export type TranslationTableProps = {
  translatedStoryLines: StoryLine[];
  disabled?: boolean;
  onUserInput?: (
    newContent: string,
    lineIndex: number,
    maxChars: number,
  ) => Promise<void>;
};

const TranslationTable = ({
  translatedStoryLines,
  disabled = false,
  onUserInput,
}: TranslationTableProps) => {
  const storyCells = translatedStoryLines.map((storyLine: StoryLine) => {
    const displayLineNumber = storyLine.lineIndex + 1;
    return (
      <Box className="row-translation" key={`row-${storyLine.lineIndex}`}>
        <p className="line-index">{displayLineNumber}</p>
        <Cell text={storyLine.originalContent} />
        {disabled ? (
          <Cell text={storyLine.translatedContent!!} />
        ) : (
          <EditableCell
            text={storyLine.translatedContent!!}
            storyTranslationContentId={storyLine.storyTranslationContentId!!}
            lineIndex={storyLine.lineIndex}
            maxChars={storyLine.originalContent.length * 2}
            onChange={onUserInput!!}
          />
        )}
        <Flex direction="column">
          <Badge>{storyLine.status}</Badge>
          <Button size="xs">Comment</Button>
        </Flex>
      </Box>
    );
  });
  return <div>{storyCells}</div>;
};

export default TranslationTable;
