import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import { Flex, Button, Textarea } from "@chakra-ui/react";
import AuthContext from "../../contexts/AuthContext";
import {
  CreateCommentResponse,
  CREATE_COMMMENT,
} from "../../APIClients/mutations/CommentMutations";

export type WIPCommentProps = {
  storyTranslationContentId: number;
  lineIndex: number;
};

const WIPComment = ({
  storyTranslationContentId,
  lineIndex,
}: WIPCommentProps) => {
  const handleError = (errorMessage: string) => {
    // eslint-disable-next-line no-alert
    alert(errorMessage);
  };

  const { authenticatedUser } = useContext(AuthContext);
  const [text, setText] = useState("");

  const [createComment] = useMutation<{
    createComment: CreateCommentResponse;
  }>(CREATE_COMMMENT);

  const createNewComment = async () => {
    try {
      const commentData = {
        storyTranslationContentId,
        userId: authenticatedUser!!.id,
        content: text,
      };
      const result = await createComment({
        variables: { commentData },
      });
      if (result.data?.createComment.ok) {
        setText("");
      }
    } catch (err) {
      handleError(err ?? "Error occurred, please try again.");
    }
  };
  const name = `${authenticatedUser!!.firstName} 
                ${authenticatedUser!!.lastName}`;
  return (
    <Flex
      direction="column"
      style={{
        boxShadow: "0px 2px 8px 4px rgba(0, 0, 0, 0.05)",
        padding: "14px 15px",
        borderRadius: 3,
        width: "320px",
      }}
    >
      <b>Line {lineIndex}</b>
      <p>{name}</p>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ margin: "8px 0" }}
        placeholder="Comment or add others with @"
      />
      <Flex direction="row">
        <Button
          size="md"
          colorScheme="blue"
          onClick={createNewComment}
          isDisabled={text.length < 1}
        >
          Comment
        </Button>
        <Button size="md">Cancel</Button>
      </Flex>
    </Flex>
  );
};

export default WIPComment;
