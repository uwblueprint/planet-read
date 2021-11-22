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
}: ExistingCommentProps) => {
  const {
    id,
    resolved,
    content,
    time,
    lineIndex: storyContentId,
    commentIndex,
    storyTranslationContentId: stcId,
  } = comment;
  const handleError = (errorMessage: string) => {
    // eslint-disable-next-line no-alert
    alert(errorMessage);
  };

  const [reply, setReply] = useState(-1);
  const [storyTranslationContentId, setStoryTranslationContentId] =
    useState(stcId);

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

  const handleReply = () => {
    setStoryTranslationContentId(storyTranslationContentId);
    setReply(storyContentId);
  };

  const newDate = new Date(time);

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
        <p>
          {newDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </p>
      </Flex>
      <Text fontSize="sm" marginBottom="5px">
        {content}
      </Text>
      <Flex>
        {!commentIndex && (
          <Button onClick={() => handleReply()} variant="commentLabel">
            Reply
          </Button>
        )}
        <Button onClick={resolveExistingComment} variant="commentLabel">
          Resolve
        </Button>
      </Flex>
      {reply > -1 && (
        <WIPComment
          WIPLineIndex={reply + 1}
          storyTranslationContentId={storyTranslationContentId}
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