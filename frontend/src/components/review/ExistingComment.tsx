import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Text, Flex, Button } from "@chakra-ui/react";
import WIPComment from "./WIPComment";
import {
  UPDATE_COMMENT_BY_ID,
  UpdateCommentResponse,
} from "../../APIClients/mutations/CommentMutations";
import { CommentResponse } from "../../APIClients/queries/CommentQueries";
import { StoryLine } from "../translation/Autosave";

export type ExistingCommentProps = {
  commentsStateIdx: number;
  userName: string;
  comment: CommentResponse;
  updateCommentsAsResolved: (index: number) => void;
  comments: CommentResponse[];
  setComments: (comments: CommentResponse[]) => void;
  translatedStoryLines: StoryLine[];
  setTranslatedStoryLines: (storyLines: StoryLine[]) => void;
  WIPLineIndex: number;
  threadHeadMap: boolean[];
  updateThreadHeadMap: (cmts: CommentResponse[]) => void;
};

const ExistingComment = ({
  commentsStateIdx,
  userName,
  comment,
  updateCommentsAsResolved,
  setComments,
  setTranslatedStoryLines,
  comments,
  translatedStoryLines,
  threadHeadMap,
  updateThreadHeadMap,
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
      if (typeof err === "string") {
        handleError(err);
      } else {
        console.log(err);
        handleError("Error occurred, please try again.");
      }
    }
  };

  const handleReply = () => {
    setStoryTranslationContentId(storyTranslationContentId);
    setReply(storyContentId);
  };

  const newTime = new Date(time);
  const displayTime = new Date(
    newTime.getTime() - newTime.getTimezoneOffset() * 60000,
  );

  const isThreadHead = commentIndex === 0 || threadHeadMap[commentsStateIdx];
  const isFirstReply =
    !threadHeadMap[commentsStateIdx] &&
    threadHeadMap[commentsStateIdx - 1] &&
    comments[commentsStateIdx - 1].storyTranslationContentId ===
      storyTranslationContentId;
  const isLive = !resolved && isThreadHead;

  return (
    <Flex
      backgroundColor="transparent"
      borderRadius="8"
      direction="column"
      padding="14px 14px"
      width={`${!isThreadHead ? 300 : 320}px`}
      margin={`${!isThreadHead ? 20 : 0}px`}
    >
      {(isThreadHead || isFirstReply) && (
        <Text fontWeight="bold" marginBottom="15px">
          {isFirstReply && "Replies to "}
          Line {storyContentId + 1}
        </Text>
      )}
      <Flex justify="space-between" marginBottom="10px">
        <p>{userName}</p>
        <p>
          {displayTime.toLocaleDateString("en-US", {
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
        {isThreadHead && isLive && (
          <>
            <Button onClick={() => handleReply()} variant="commentLabel">
              Reply
            </Button>
            <Button onClick={resolveExistingComment} variant="commentLabel">
              Resolve
            </Button>
          </>
        )}
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
          updateThreadHeadMap={updateThreadHeadMap}
        />
      )}
    </Flex>
  );
};

export default ExistingComment;
