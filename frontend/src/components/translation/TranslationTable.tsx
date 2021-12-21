import React from "react";
import { Badge, Button, Flex, Text, Tooltip } from "@chakra-ui/react";
import EditableCell from "./EditableCell";
import { StoryLine } from "./Autosave";
import StatusBadge from "../review/StatusBadge";
import ApproveAll from "../review/ApproveAll";
import { getStatusVariant } from "../../utils/StatusUtils";
import { isRtlLanguage } from "../../utils/LanguageUtils";
import {
  TRANSLATION_PAGE_TOOL_TIP_COPY,
  REVIEW_PAGE_TOOL_TIP_COPY,
} from "../../utils/Copy";

export type TranslationTableProps = {
  storyTranslationId: number;
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
  commentLine?: number;
  setCommentLine?: (line: number) => void;
  setStoryTranslationContentId?: (id: number) => void;
  numApprovedLines?: number;
  setNumApprovedLines?: (numLines: number) => void;
  changedStoryLines?: number;
  isReviewable?: boolean;
  reviewPage?: boolean;
  isTest?: boolean;
};

const TranslationTable = ({
  storyTranslationId,
  translatedStoryLines,
  editable = false,
  onUserInput,
  fontSize,
  translatedLanguage,
  originalLanguage,
  setTranslatedStoryLines,
  commentLine,
  setCommentLine,
  setStoryTranslationContentId,
  translator,
  numApprovedLines,
  setNumApprovedLines,
  changedStoryLines,
  isReviewable = false,
  reviewPage = false,
  isTest = false,
}: TranslationTableProps) => {
  const handleCommentButton = (
    displayLineNumber: number,
    storyTranslationContentId: number,
  ) => {
    setCommentLine!!(displayLineNumber);
    setStoryTranslationContentId!!(storyTranslationContentId);
  };

  const showStatusColumn = !isTest || isReviewable;

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
              isRtl={isRtlLanguage(translatedLanguage)}
            />
          </Flex>
        ) : (
          <Tooltip
            hasArrow
            label={TRANSLATION_PAGE_TOOL_TIP_COPY}
            isDisabled={!translator}
          >
            <Flex flex={1} height="100%">
              <Text
                textAlign={isRtlLanguage(translatedLanguage) ? "right" : "left"}
                flexGrow={1}
                fontSize={fontSize}
                variant="cell"
              >
                {storyLine.translatedContent!!}
              </Text>
            </Flex>
          </Tooltip>
        )}
        {showStatusColumn && (
          <Flex direction="column" width="140px" margin="5px">
            {isReviewable ? (
              <StatusBadge
                translatedStoryLines={translatedStoryLines}
                setTranslatedStoryLines={setTranslatedStoryLines}
                storyLine={storyLine}
                numApprovedLines={numApprovedLines!!}
                setNumApprovedLines={setNumApprovedLines!!}
              />
            ) : (
              <Tooltip
                hasArrow
                label={REVIEW_PAGE_TOOL_TIP_COPY}
                isDisabled={editable || !reviewPage}
              >
                <Badge
                  textTransform="capitalize"
                  variant={getStatusVariant(storyLine.status)}
                  marginBottom="10px"
                >
                  {storyLine.status}
                </Badge>
              </Tooltip>
            )}
            {commentLine! > -1 && (
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
        )}
      </Flex>
    );
  });

  const StatusHeader = () =>
    isReviewable ? (
      <ApproveAll
        numApprovedLines={numApprovedLines!}
        setNumApprovedLines={setNumApprovedLines!!}
        totalLines={translatedStoryLines.length} // eslint-disable-line
        storyTranslationId={storyTranslationId}
      />
    ) : (
      <Text variant="statusHeader">Status</Text>
    );

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
        {showStatusColumn && <StatusHeader />}
      </Flex>
      {storyCells}
    </Flex>
  );
};

export default TranslationTable;
