import React from "react";
import { Badge, Button, Flex, Text } from "@chakra-ui/react";
import EditableCell from "./EditableCell";
import { StoryLine } from "./Autosave";
import { getStatusVariant } from "../../utils/StatusUtils";

export type TranslationTableProps = {
  translatedStoryLines: StoryLine[];
  editable?: boolean;
  onUserInput?: (
    newContent: string,
    lineIndex: number,
    maxChars: number,
  ) => Promise<void>;
  fontSize: string;
  translatedLanguage: string;
  originalLanguage?: string;
  isCommenting: boolean;
  setCommentLine: (line: number) => void;
  setStoryTranslationContentId: (id: number) => void;
};

const TranslationTable = ({
  translatedStoryLines,
  editable = false,
  onUserInput,
  fontSize,
  translatedLanguage,
  originalLanguage,
  isCommenting,
  setCommentLine,
  setStoryTranslationContentId,
}: TranslationTableProps) => {
  const handleCommentButton = (
    displayLineNumber: number,
    contentId: number,
  ) => {
    setCommentLine(displayLineNumber);
    setStoryTranslationContentId(contentId);
  };
  const storyCells = translatedStoryLines.map((storyLine: StoryLine) => {
    const displayLineNumber = storyLine.lineIndex + 1;
    return (
      <Flex
        alignItems="flex-start"
        direction="row"
        key={`row-${storyLine.lineIndex}`}
      >
        <Text variant="lineIndex">{displayLineNumber}</Text>
        <Text variant="cell" fontSize={fontSize}>
          {storyLine.originalContent}
        </Text>
        {editable ? (
          <EditableCell
            text={storyLine.translatedContent!!}
            storyTranslationContentId={storyLine.storyTranslationContentId!!}
            lineIndex={storyLine.lineIndex}
            maxChars={storyLine.originalContent.length * 2}
            onChange={onUserInput!!}
            fontSize={fontSize}
          />
        ) : (
          <Text variant="cell" fontSize={fontSize}>
            {" "}
            {storyLine.translatedContent!!}{" "}
          </Text>
        )}
        <Flex direction="column" width="130px" margin="10px">
          <Badge
            textTransform="capitalize"
            variant={getStatusVariant(storyLine.status)}
            marginBottom="10px"
          >
            {storyLine.status}
          </Badge>
          {isCommenting && (
            <Button
              variant="addComment"
              onClick={() =>
                handleCommentButton(
                  displayLineNumber,
                  storyLine.storyTranslationContentId!!,
                )
              }
            >
              Comment
            </Button>
          )}
        </Flex>
      </Flex>
    );
  });
  return (
    <Flex direction="column" paddingRight="30px">
      <Flex alignItems="flex-start" direction="row">
        <Text variant="lineIndex">Line</Text>
        <Flex direction="row" width="100%">
          <Text variant="cellHeader">
            Translate from <strong>{originalLanguage}</strong>
          </Text>
          <Text variant="cellHeader">
            Translate to <strong>{translatedLanguage}</strong>
          </Text>
        </Flex>
        <Text variant="statusHeader">Status</Text>
      </Flex>
      {storyCells}
    </Flex>
  );
};

export default TranslationTable;
