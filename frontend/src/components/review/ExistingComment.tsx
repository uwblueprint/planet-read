import React, { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { Flex, Box, Button } from "@chakra-ui/react";
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
  storyTranslationContentId: number;
  lineIndex: number;
};

const ExistingComment = ({
  id,
  resolved,
  content,
  storyTranslationContentId,
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
    <Flex>
      <Box backgroundColor="gray.300" float="right" width="250px">
        <p>{name}</p>
        {content}
        <Button onClick={() => setReply(true)}>Reply</Button>
        <Button onClick={resolveExistingComment}>Resolve</Button>
      </Box>
      {reply === true && (
        <WIPComment
          storyTranslationContentId={storyTranslationContentId}
          lineIndex={lineIndex}
        />
      )}
    </Flex>
  );
};

export default ExistingComment;
