import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Box, Button, Flex, Select, Text, Tooltip } from "@chakra-ui/react";
import {
  CommentResponse,
  buildCommentsQuery,
} from "../../APIClients/queries/CommentQueries";
import WIPComment from "./WIPComment";
import TRANSLATION_PAGE_TOOL_TIP_COPY from "../../utils/Copy";

export type CommentPanelProps = {
  storyTranslationId: number;
  commentLine: number;
  setCommentLine: (line: number) => void;
  commentStoryTranslationContentId: number;
  disabled: boolean;
};

const CommentsPanel = ({
  storyTranslationId,
  commentLine,
  commentStoryTranslationContentId,
  setCommentLine,
  disabled,
}: CommentPanelProps) => {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [filterIndex, setFilterIndex] = useState(0);

  const filterOptions = ["All", "Resolved", "Unresolved"];
  const filterToResolved = [null, true, false];
  const commentsQuery = buildCommentsQuery(
    storyTranslationId,
    filterToResolved[filterIndex],
  );
  useQuery(commentsQuery.string, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setComments(data.commentsByStoryTranslation);
    },
  });

  const handleCommentFilterSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setFilterIndex(event.target.selectedIndex);
  };

  const CommentsList = () => {
    if (comments.length > 0) {
      return (
        <Box>
          {/* TODO: show correct placement of the WIPComment component once existing comment is displayed */}
          {comments.map((comment: CommentResponse) => (
            // TODO: replace with actual comment component
            <Text key={comment.id} variant="comment">
              {JSON.stringify(comment.content)}
            </Text>
          ))}
        </Box>
      );
    }
    return (
      <Text variant="comment">
        Looks like there aren`&apos;`t any comments yet! Select the Comment
        button above to begin leaving comments.
      </Text>
    );
  };

  const filterOptionsComponent = filterOptions.map((op) => (
    <option key={op} value={op}>
      {op}
    </option>
  ));

  const handleCommentButton = () => {
    if (commentLine === -1) setCommentLine(0);
    else setCommentLine(-1);
  };

  return (
    <Box backgroundColor="gray.100" float="right" width="350px" padding="20px">
      <Flex marginBottom="50px">
        <Tooltip
          hasArrow
          label={TRANSLATION_PAGE_TOOL_TIP_COPY}
          isDisabled={!disabled}
        >
          <Box>
            <Button
              colorScheme="blue"
              size="secondary"
              marginRight="10px"
              onClick={handleCommentButton}
              disabled={disabled}
            >
              Comment
            </Button>
          </Box>
        </Tooltip>
        <Select
          name="comment filter"
          id="comment filter"
          value={filterOptions[filterIndex]}
          variant="commentsFilter"
          onChange={handleCommentFilterSelectChange}
          width="160px"
          disabled={disabled}
        >
          {filterOptionsComponent}
        </Select>
      </Flex>
      {commentLine > 0 && (
        <WIPComment
          lineIndex={commentLine}
          commentStoryTranslationContentId={commentStoryTranslationContentId}
          setCommentLine={setCommentLine}
        />
      )}
      <CommentsList />
    </Box>
  );
};

export default CommentsPanel;
