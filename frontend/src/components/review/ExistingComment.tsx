import React, { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { Text, Flex, Button } from "@chakra-ui/react";
import AuthContext from "../../contexts/AuthContext";
import WIPComment from "./WIPComment";
import {
  UPDATE_COMMENT_BY_ID,
  UpdateCommentResponse,
} from "../../APIClients/mutations/CommentMutations";
import { CommentResponse } from "../../APIClients/queries/CommentQueries";
import { StoryLine } from "../translation/Autosave";

export type ExistingCommentProps = {
  comment: CommentResponse;
  updateCommentsAsResolved: (index: number) => void;
  comments: CommentResponse[];
  setComments: (comments: CommentResponse[]) => void;
  translatedStoryLines: StoryLine[];
  setTranslatedStoryLines: (storyLines: StoryLine[]) => void;
  WIPLineIndex: number;
};

const ExistingComment = ({
  comment,
  updateCommentsAsResolved,
  setComments,
  setTranslatedStoryLines,
  comments,
  translatedStoryLines,
  WIPLineIndex,
}: ExistingCommentProps) => {
  const {
    id,
    resolved,
    content,
    time,
    lineIndex: storyContentId,
    commentIndex,
  } = comment;
  const handleError = (errorMessage: string) => {
    // eslint-disable-next-line no-alert
    alert(errorMessage);
  };

  const [reply, setReply] = useState(0);

  const { authenticatedUser } = useContext(AuthContext);
  const [updateComment] = useMutation<{
    updateCommentById: UpdateCommentResponse;
  }>(UPDATE_COMMENT_BY_ID);

  const resolveExistingComment = async () => {
    try {
      if (!resolved) {
        const commentData = {
          id,
          resolved: true,
          content,
        };

        const result = await updateComment({
          variables: { commentData },
        });
        if (result.data?.updateCommentById.ok) {
          updateCommentsAsResolved(id);
        }
      }
    } catch (err) {
      handleError(err ?? "Error occurred, please try again.");
    }
  };

  const name = `
    ${authenticatedUser!!.firstName}
    ${authenticatedUser!!.lastName}`;

  return (
    <Flex
      backgroundColor="transparent"
      borderRadius="8"
      direction="column"
      padding="14px 14px"
      width={`${commentIndex ? 300 : 320}px`}
      margin={`${commentIndex ? 20 : 0}px`}
    >
      {commentIndex < 2 && (
        <Text fontWeight="bold" marginBottom="15px">
          {commentIndex === 1 && "Replies to "}
          Line {storyContentId + 1}
        </Text>
      )}
      <Flex justify="space-between" marginBottom="10px">
        <p>{name}</p>
        <p>{time}</p>
      </Flex>
      <Text fontSize="sm" marginBottom="5px">
        {content}
      </Text>
      <Flex>
        <Button onClick={() => setReply(1)} variant="commentLabel">
          Reply
        </Button>
        <Button onClick={resolveExistingComment} variant="commentLabel">
          Resolve
        </Button>
      </Flex>
      {reply > 0 && WIPLineIndex > -1 && (
        <WIPComment
          WIPLineIndex={WIPLineIndex}
          storyTranslationContentId={storyContentId}
          setCommentLine={setReply}
          comments={comments}
          setComments={setComments}
          setTranslatedStoryLines={setTranslatedStoryLines}
          translatedStoryLines={translatedStoryLines}
        />
      )}
    </Flex>
  );
};

export default ExistingComment;
