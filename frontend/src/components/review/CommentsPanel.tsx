import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Box, Button, Flex, Select, Text } from "@chakra-ui/react";
import {
  CommentResponse,
  buildCommentsQuery,
} from "../../APIClients/queries/CommentQueries";
import WIPComment from "./WIPComment";
import { StoryLine } from "../translation/Autosave";
import ExistingComment from "./ExistingComment";

export type CommentPanelProps = {
  storyTranslationId: number;
  commentLine: number;
  setCommentLine: (line: number) => void;
  storyTranslationContentId: number;
  setTranslatedStoryLines: (storyLines: StoryLine[]) => void;
  translatedStoryLines: StoryLine[];
};

const CommentsPanel = ({
  storyTranslationId,
  commentLine,
  storyTranslationContentId,
  setCommentLine,
  setTranslatedStoryLines,
  translatedStoryLines,
}: CommentPanelProps) => {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [filterIndex, setFilterIndex] = useState(2);

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

  const updateCommentsAsResolved = (index: number) => {
    const newComments = [...comments];
    const updatedComment = { ...newComments[index - 1] };
    updatedComment.resolved = true;
    newComments[index - 1] = updatedComment;
    setComments(newComments);
  };

  const CommentsList = () => {
    if (comments.length > 0) {
      return (
        <Box>
          {/* TODO: show correct placement of the WIPComment component once existing comment is displayed */}
          {comments.map((comment: CommentResponse) => (
            <ExistingComment
              key={comment.id}
              comment={comment}
              WIPLineIndex={commentLine}
              updateCommentsAsResolved={updateCommentsAsResolved}
              comments={comments}
              setComments={setComments}
              setTranslatedStoryLines={setTranslatedStoryLines}
              translatedStoryLines={translatedStoryLines}
            />
          ))}
        </Box>
      );
    }
    return (
      <Text variant="comment">
        Looks like there aren&apos;t any comments yet! Select the Comment button
        above to begin leaving comments.
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
    <Box
      backgroundColor="gray.100"
      float="right"
      overflow="auto"
      padding="20px"
      width="450px"
    >
      <Flex marginBottom="50px">
        <Box>
          <Button
            colorScheme="blue"
            size="secondary"
            marginRight="10px"
            onClick={handleCommentButton}
          >
            Comment
          </Button>
        </Box>
        <Select
          name="comment filter"
          id="comment filter"
          value={filterOptions[filterIndex]}
          variant="commentsFilter"
          onChange={handleCommentFilterSelectChange}
          width="160px"
        >
          {filterOptionsComponent}
        </Select>
      </Flex>
      {commentLine > 0 && (
        <WIPComment
          WIPLineIndex={commentLine}
          storyTranslationContentId={storyTranslationContentId}
          setCommentLine={setCommentLine}
          comments={comments}
          setComments={setComments}
          setTranslatedStoryLines={setTranslatedStoryLines}
          translatedStoryLines={translatedStoryLines}
        />
      )}
      <CommentsList />
    </Box>
  );
};

export default CommentsPanel;
