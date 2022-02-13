import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import { Button, Flex, Text, Textarea } from "@chakra-ui/react";
import AuthContext from "../../contexts/AuthContext";
import {
  CreateCommentResponse,
  CREATE_COMMMENT,
} from "../../APIClients/mutations/CommentMutations";
import { CommentResponse } from "../../APIClients/queries/CommentQueries";
import { insertSortedComments } from "../../utils/Utils";

export type WIPCommentProps = {
  comments: CommentResponse[];
  isReply: boolean;
  setCommentLine: (line: number) => void;
  setComments: (comments: CommentResponse[]) => void;
  storyTranslationContentId: number;
  updateThreadHeadMap: (cmts: CommentResponse[]) => void;
  WIPLineIndex: number;
};

const WIPComment = ({
  comments,
  isReply,
  setCommentLine,
  setComments,
  storyTranslationContentId,
  WIPLineIndex,
  updateThreadHeadMap,
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
        content: text,
      };
      const result = await createComment({
        variables: { commentData },
      });
      if (result.data?.createComment.ok) {
        setText("");
        setCommentLine(0);
        const newComments = insertSortedComments(
          comments,
          result.data.createComment.comment,
        );
        setComments(newComments);
        updateThreadHeadMap(newComments);
      }
    } catch (err) {
      if (typeof err === "string") {
        handleError(err);
      } else {
        handleError("Error occurred, please try again.");
      }
    }
  };
  const isAdmin = authenticatedUser!!.role === "Admin";
  const name = isAdmin
    ? "Admin"
    : `${authenticatedUser!!.firstName}
                ${authenticatedUser!!.lastName}`;
  return (
    <Flex
      backgroundColor="white"
      border="1px solid"
      borderColor="blue.50"
      borderRadius={8}
      direction="column"
      padding="14px 14px"
      width="300px"
    >
      <Text fontWeight="bold" marginBottom="10px">
        {isReply && "Replying to"} Line {WIPLineIndex}
      </Text>
      <Text marginBottom="10px">{name}</Text>
      <Textarea
        margin="10px 0"
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment"
        value={text}
      />
      <Flex direction="row">
        <Button
          colorScheme="blue"
          isDisabled={text.length < 1}
          marginRight="10px"
          onClick={createNewComment}
          size="secondary"
        >
          Comment
        </Button>
        <Button
          onClick={() => setCommentLine(-1)}
          size="secondary"
          variant="blueOutline"
        >
          Cancel
        </Button>
      </Flex>
    </Flex>
  );
};

export default WIPComment;
