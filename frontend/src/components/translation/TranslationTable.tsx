import React from "react";
import { Badge, Button, Flex, Text, Tooltip } from "@chakra-ui/react";
import EditableCell from "./EditableCell";
import { StoryLine } from "./Autosave";
import StatusBadge from "../review/StatusBadge";
import { getStatusVariant } from "../../utils/StatusUtils";
import { TRANSLATION_PAGE_TOOL_TIP_COPY } from "../../utils/Copy";

export type TranslationTableProps = {
  translatedStoryLines: StoryLine[];
  editable?: boolean;
  translator: boolean;
  onUserInput?: (
    newContent: string,
    lineIndex: number,
    maxChars: number,
  ) => Promise<void>;
  fontSize: string;
  translatedLanguage: string;
  originalLanguage: string;
  setTranslatedStoryLines: (storyLines: StoryLine[]) => void;
  commentLine: number;
  setCommentLine: (line: number) => void;
  setCommentStoryTranslationContentId: (id: number) => void;
  numApprovedLines?: number;
  setNumApprovedLines?: (numLines: number) => void;
  changedStoryLines?: number;
};

const TranslationTable = ({
  translatedStoryLines,
  editable = false,
  onUserInput,
  fontSize,
  translatedLanguage,
  originalLanguage,
  setTranslatedStoryLines,
  commentLine,
  setCommentLine,
  setCommentStoryTranslationContentId,
  translator,
  numApprovedLines,
  setNumApprovedLines,
  changedStoryLines,
}: TranslationTableProps) => {
  const handleCommentButton = (
    displayLineNumber: number,
    storyTranslationContentId: number,
  ) => {
    setCommentLine(displayLineNumber);
    setCommentStoryTranslationContentId(storyTranslationContentId);
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
        <Flex flex={1} height="100%">
          <Text variant="cell" fontSize={fontSize}>
            {storyLine.originalContent}
          </Text>
        </Flex>
        {editable ? (
          <Flex flex={1} height="100%">
            <EditableCell
              text={storyLine.translatedContent!!}
              storyTranslationContentId={storyLine.storyTranslationContentId!!}
              lineIndex={storyLine.lineIndex}
              maxChars={storyLine.originalContent.length * 2}
              onChange={onUserInput!!}
              fontSize={fontSize}
            />
          </Flex>
        ) : (
          <Tooltip
            hasArrow
            label={TRANSLATION_PAGE_TOOL_TIP_COPY}
            isDisabled={!translator}
          >
            <Flex flex={1} height="100%">
              <Text variant="cell" flexGrow={1} fontSize={fontSize}>
                {storyLine.translatedContent!!}
              </Text>
            </Flex>
          </Tooltip>
        )}
        <Flex direction="column" width="140px" margin="5px">
          {!editable ? (
            <StatusBadge
              translatedStoryLines={translatedStoryLines}
              setTranslatedStoryLines={setTranslatedStoryLines}
              storyLine={storyLine}
              numApprovedLines={numApprovedLines!!}
              setNumApprovedLines={setNumApprovedLines!!}
            />
          ) : (
            <Badge
              textTransform="capitalize"
              variant={getStatusVariant(storyLine.status)}
              marginBottom="10px"
            >
              {storyLine.status}
            </Badge>
          )}
          {commentLine > -1 && (
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
    <Flex direction="column">
      <Flex alignItems="flex-start" direction="row">
        <Text variant="lineIndex">Line</Text>
        <Flex flex={1}>
          <Text variant="cellHeader">
            Translate from <strong>{originalLanguage}</strong>
          </Text>
        </Flex>
        <Flex flex={1}>
          <Text variant="cellHeader">
            Translate to <strong>{translatedLanguage}</strong>
            {editable && (
              <Text as="span" variant="saveStatus">
                {changedStoryLines === 0
                  ? "(Progress Saved)"
                  : "(Progress Saving...)"}
              </Text>
            )}
          </Text>
        </Flex>
        <Text variant="statusHeader">Status</Text>
      </Flex>
      {storyCells}
    </Flex>
  );
};

export default TranslationTable;
