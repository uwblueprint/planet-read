import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import { Box, Flex, Button, Textarea } from "@chakra-ui/react";
import AuthContext from "../../contexts/AuthContext";
import PlaceholderUserIcon from "../../assets/user-icon.svg";
import {
  CreateCommentResponse,
  CREATE_COMMMENT,
} from "../../APIClients/mutations/CommentMutations";

export type WIPCommentProps = {
  storyTranslationContentId: number;
  lineIndex: number;
  fontSize: string;
};

const WIPComment = ({
  storyTranslationContentId,
  lineIndex,
  fontSize,
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
    <Box style={{ width: "320px" }}>
      <p>Commenting on: Line {lineIndex}</p>
      <Flex
        direction="column"
        style={{
          boxShadow: "0px 2px 8px 4px rgba(0, 0, 0, 0.05)",
          padding: "14px 15px",
          borderRadius: 3,
        }}
      >
        <Flex align="center">
          <img
            id="header-user-icon"
            src={PlaceholderUserIcon}
            alt="User icon"
            style={{ width: "25px", margin: "0 10px 0 0 " }}
          />
          <p>{name}</p>
        </Flex>
        <Textarea
          value={text}
          style={{ fontSize }}
          onChange={(e) => setText(e.target.value)}
        />
        <Flex direction="row">
          <Button size="md" colorScheme="blue" onClick={createNewComment}>
            Comment
          </Button>
          <Button size="md">Cancel</Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default WIPComment;
