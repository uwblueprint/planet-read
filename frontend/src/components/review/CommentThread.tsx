import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import ExistingComment from "./ExistingComment";
import WIPComment from "./WIPComment";
import { CommentResponse } from "../../APIClients/queries/CommentQueries";
import {
  UPDATE_COMMENT_BY_ID,
  UpdateCommentResponse,
} from "../../APIClients/mutations/CommentMutations";

export type CommentThreadProps = {
  comment: CommentResponse;
  comments: CommentResponse[];
  setComments: (comments: CommentResponse[]) => void;
  threadReplies: CommentResponse[];
  updateCommentsAsResolved: (index: number) => void;
  updateThreadHeadMap: (cmts: CommentResponse[]) => void;
  userName: string;
};

const CommentThread = ({
  comment,
  comments,
  setComments,
  threadReplies,
  updateCommentsAsResolved,
  updateThreadHeadMap,
  userName,
}: CommentThreadProps) => {
  const {
    content,
    id,
    lineIndex: storyContentId,
    resolved,
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

  return (
    <>
      <ExistingComment
        comment={comment}
        handleReply={handleReply}
        isFirstReply={false}
        isThreadHead
        resolveExistingComment={resolveExistingComment}
        userName={userName}
      />
      {threadReplies.map(function (threadReply: CommentResponse, i: number) {
        return (
          <ExistingComment
            comment={threadReply}
            handleReply={handleReply}
            isFirstReply={i === 0}
            isThreadHead={false}
            key={threadReply.id}
            resolveExistingComment={resolveExistingComment}
            userName={userName}
          />
        );
      })}
      {reply > -1 && (
        <WIPComment
          comments={comments}
          isReply
          setCommentLine={setReply}
          setComments={setComments}
          storyTranslationContentId={storyTranslationContentId}
          updateThreadHeadMap={updateThreadHeadMap}
          WIPLineIndex={reply + 1}
        />
      )}
    </>
  );
};

export default CommentThread;
