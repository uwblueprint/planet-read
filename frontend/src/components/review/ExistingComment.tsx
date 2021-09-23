import React, { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { Flex, Button } from "@chakra-ui/react";
import AuthContext from "../../contexts/AuthContext";
import WIPComment from "./WIPComment";
import {
  UPDATE_COMMENT_BY_ID,
  UpdateCommentResponse,
} from "../../APIClients/mutations/CommentMutations";

export type ExistingCommentProps = {
  id: number;
  resolved: boolean;
  content: string;
  time: string;
  commentStoryTranslationContentId: number;
  setCommentLine: (line: number) => void;
  lineIndex: number;
};

const ExistingComment = ({
  id,
  resolved,
  content,
  time,
  commentStoryTranslationContentId,
  setCommentLine,
  lineIndex,
}: ExistingCommentProps) => {
  const handleError = (errorMessage: string) => {
    // eslint-disable-next-line no-alert
    alert(errorMessage);
  };

  const [reply, setReply] = useState(false);

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

        await updateComment({
          variables: { commentData },
        });
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
      border="1px solid"
      borderColor="blue.50"
      padding="14px 15px"
      direction="column"
      style={{
        borderRadius: 8,
        width: "320px",
      }}
      backgroundColor="white"
    >
      <b>Line {lineIndex}</b>
      <Flex justify="space-between">
        <p>{name}</p>
        <p>{time}</p>
      </Flex>
      {content}
      <Flex>
        <Button onClick={() => setReply(true)} variant="text">
          Reply
        </Button>
        <Button onClick={resolveExistingComment} variant="text">
          Resolve
        </Button>
      </Flex>
      {reply && lineIndex > 0 && (
        <WIPComment
          commentStoryTranslationContentId={commentStoryTranslationContentId}
          lineIndex={lineIndex}
          setCommentLine={setCommentLine}
        />
      )}
    </Flex>
  );
};

export default ExistingComment;
