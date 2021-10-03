import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import { Flex, Button, Textarea } from "@chakra-ui/react";
import AuthContext from "../../contexts/AuthContext";
import {
  CreateCommentResponse,
  CREATE_COMMMENT,
} from "../../APIClients/mutations/CommentMutations";
import { GET_STORY_AND_TRANSLATION_CONTENTS } from "../../APIClients/queries/StoryQueries";

export type WIPCommentProps = {
  commentStoryTranslationContentId: number;
  lineIndex: number;
  setCommentLine: (line: number) => void;
  commentsQuery: any;
  storyId: number;
  storyTranslationId: number;
};

const WIPComment = ({
  commentStoryTranslationContentId,
  lineIndex,
  setCommentLine,
  commentsQuery,
  storyId,
  storyTranslationId,
}: WIPCommentProps) => {
  const handleError = (errorMessage: string) => {
    // eslint-disable-next-line no-alert
    alert(errorMessage);
  };

  const { authenticatedUser } = useContext(AuthContext);
  const [text, setText] = useState("");

  const [createComment] = useMutation<{
    createComment: CreateCommentResponse;
  }>(CREATE_COMMMENT, {
    refetchQueries: [
      { query: commentsQuery.string },
      {
        query: GET_STORY_AND_TRANSLATION_CONTENTS(storyId, storyTranslationId),
      },
    ],
  });

  const createNewComment = async () => {
    try {
      const commentData = {
        storyTranslationContentId: commentStoryTranslationContentId,
        content: text,
      };
      const result = await createComment({
        variables: { commentData },
      });
      if (result.data?.createComment.ok) {
        setText("");
        setCommentLine(0);
      }
    } catch (err) {
      handleError(err ?? "Error occurred, please try again.");
    }
  };
  const name = `${authenticatedUser!!.firstName} 
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
      <p>{name}</p>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ margin: "8px 0" }}
        placeholder="Comment or add others with @"
      />
      <Flex direction="row">
        <Button
          size="secondary"
          colorScheme="blue"
          onClick={createNewComment}
          isDisabled={text.length < 1}
        >
          Comment
        </Button>
        <Button
          size="secondary"
          variant="outline"
          onClick={() => setCommentLine(0)}
        >
          Cancel
        </Button>
      </Flex>
    </Flex>
  );
};

export default WIPComment;
