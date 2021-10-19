import React, { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { Text, Flex, Button } from "@chakra-ui/react";
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
  lineIndex: number;
};

const ExistingComment = ({
  id,
  resolved,
  content,
  time,
  commentStoryTranslationContentId,
  lineIndex,
}: ExistingCommentProps) => {
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
      backgroundColor="transparent"
    >
      <Text fontWeight="bold" marginBottom="15px">
        Line {lineIndex}
      </Text>
      <Flex justify="space-between" marginBottom="10px">
        <p>{name}</p>
        <p>{time}</p>
      </Flex>
      <Text fontSize="sm" marginBottom="5px">
        {content}
      </Text>
      <Flex>
        <Button onClick={() => setReply(1)} variant="label">
          Reply
        </Button>
        <Button onClick={resolveExistingComment} variant="label">
          Resolve
        </Button>
      </Flex>
      {reply > 0 && lineIndex > -1 && (
        <WIPComment
          commentStoryTranslationContentId={commentStoryTranslationContentId}
          lineIndex={lineIndex}
          setCommentLine={setReply}
        />
      )}
    </Flex>
  );
};

export default ExistingComment;
