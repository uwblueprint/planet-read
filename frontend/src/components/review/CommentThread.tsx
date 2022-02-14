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
  comments: CommentResponse[];
  commentsIdx: number;
  setComments: (comments: CommentResponse[]) => void;
  updateCommentsAsResolved: (index: number) => void;
  updateThreadHeadMap: (cmts: CommentResponse[]) => void;
  threadHeadMap: boolean[];
  translatorId: number;
  translatorName: string;
  reviewerId: number | null;
  reviewerName: string;
};

const CommentThread = ({
  comments,
  commentsIdx,
  reviewerId,
  reviewerName,
  setComments,
  updateCommentsAsResolved,
  updateThreadHeadMap,
  threadHeadMap,
  translatorId,
  translatorName,
}: CommentThreadProps) => {
  const comment = comments[commentsIdx];
  const {
    content,
    id,
    lineIndex: storyContentId,
    resolved,
    storyTranslationContentId: stcId,
  } = comment;

  const threadReplies = [];
  for (
    let i = commentsIdx + 1;
    i < comments.length && !threadHeadMap[i];
    i += 1
  ) {
    threadReplies.push(comments[i]);
  }

  const [reply, setReply] = useState(-1);
  const [storyTranslationContentId, setStoryTranslationContentId] =
    useState(stcId);

  const [updateComment] = useMutation<{
    updateCommentById: UpdateCommentResponse;
  }>(UPDATE_COMMENT_BY_ID);

  const handleReply = () => {
    setStoryTranslationContentId(storyTranslationContentId);
    setReply(storyContentId);
  };

  const handleError = (errorMessage: string) => {
    // eslint-disable-next-line no-alert
    alert(errorMessage);
  };

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
        // eslint-disable-next-line no-alert
        window.alert(err);
        handleError("Error occurred, please try again.");
      }
    }
  };

  const getCommentAuthor = (userId: number) => {
    if (translatorId === userId) {
      return translatorName;
    }
    if (reviewerId === userId) {
      return reviewerName;
    }
    return "Admin";
  };

  return (
    <>
      <ExistingComment
        comment={comment}
        handleReply={handleReply}
        isFirstReply={false}
        isThreadHead
        resolveExistingComment={resolveExistingComment}
        userName={getCommentAuthor(comment.userId)}
      />
      {
        // eslint-disable-next-line func-names
        threadReplies.map(function (threadReply: CommentResponse, i: number) {
          return (
            <ExistingComment
              comment={threadReply}
              isFirstReply={i === 0}
              isThreadHead={false}
              key={threadReply.id}
              userName={getCommentAuthor(threadReply.userId)}
            />
          );
        })
      }
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
