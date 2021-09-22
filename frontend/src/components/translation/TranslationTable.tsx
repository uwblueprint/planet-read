import React from "react";
import {
  Badge,
  Button,
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { ChevronDownIcon } from "@chakra-ui/icons";
import EditableCell from "./EditableCell";
import { StoryLine } from "./Autosave";
import {
  getStatusVariant,
  convertStatusTitleCase,
} from "../../utils/StatusUtils";
import {
  UPDATE_STORY_TRANSLATION_CONTENT_STATUS,
  UpdateStoryTranslationContentStatusResponse,
} from "../../APIClients/mutations/StoryMutations";

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
  setTranslatedStoryLines?: (storyLines: StoryLine[]) => void;
  commentLine: number;
  setCommentLine: (line: number) => void;
  setCommentStoryTranslationContentId: (id: number) => void;
  numApprovedLines?: number;
  setNumApprovedLines?: (numLines: number) => void;
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
  numApprovedLines,
  setNumApprovedLines,
}: TranslationTableProps) => {
  const handleCommentButton = (
    displayLineNumber: number,
    storyTranslationContentId: number,
  ) => {
    setCommentLine(displayLineNumber);
    setCommentStoryTranslationContentId(storyTranslationContentId);
  };
  const [updateStatus] = useMutation<{
    response: UpdateStoryTranslationContentStatusResponse;
  }>(UPDATE_STORY_TRANSLATION_CONTENT_STATUS);

  const handleStatusChange = async (storyLine: StoryLine, newState: string) => {
    const result = updateStatus({
      variables: {
        storyTranslationId: storyLine.storyTranslationContentId!!,
        status: newState,
      },
    });
    if (result) {
      const prevState = translatedStoryLines[storyLine.lineIndex].status;

      const updatedStatusArray = [...translatedStoryLines!];
      updatedStatusArray[storyLine.lineIndex].status = convertStatusTitleCase(
        newState,
      );

      await setTranslatedStoryLines!!(updatedStatusArray);

      if (
        prevState !== convertStatusTitleCase("APPROVED") &&
        newState === "APPROVED"
      ) {
        setNumApprovedLines!!(numApprovedLines!! + 1);
      } else if (
        prevState === convertStatusTitleCase("APPROVED") &&
        newState !== "APPROVED"
      ) {
        setNumApprovedLines!!(numApprovedLines!! - 1);
      }
    }
  };

  const storyCells = translatedStoryLines.map((storyLine: StoryLine) => {
    const displayLineNumber = storyLine.lineIndex + 1;

    console.log(storyLine);
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
          {!editable ? (
            <Menu>
              <MenuButton
                as={Badge}
                textTransform="capitalize"
                variant={getStatusVariant(storyLine.status)}
                marginBottom="10px"
              >
                {storyLine.status}
                <ChevronDownIcon />
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={async () => {
                    handleStatusChange(storyLine, "APPROVED");
                  }}
                >
                  Approve
                </MenuItem>
                <MenuItem
                  onClick={async () => {
                    handleStatusChange(storyLine, "ACTION_REQUIRED");
                  }}
                >
                  Action Required
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Badge
              textTransform="capitalize"
              variant={getStatusVariant(storyLine.status)}
              marginBottom="10px"
            >
              {storyLine.status}
            </Badge>
          )}
          <Button variant="addComment">Comment</Button>
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
