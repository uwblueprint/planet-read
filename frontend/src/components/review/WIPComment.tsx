import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import { Flex, Button, Textarea } from "@chakra-ui/react";
import AuthContext from "../../contexts/AuthContext";
import {
  CreateCommentResponse,
  CREATE_COMMMENT,
} from "../../APIClients/mutations/CommentMutations";
import { CommentResponse } from "../../APIClients/queries/CommentQueries";
import { StoryLine } from "../translation/Autosave";
import { convertStatusTitleCase } from "../../utils/StatusUtils";

export type WIPCommentProps = {
  commentStoryTranslationContentId: number;
  lineIndex: number;
  setCommentLine: (line: number) => void;
  comments: CommentResponse[];
  setComments: (comments: CommentResponse[]) => void;
  translatedStoryLines: StoryLine[];
  setTranslatedStoryLines: (storyLines: StoryLine[]) => void;
};

const WIPComment = ({
  commentStoryTranslationContentId,
  lineIndex,
  setCommentLine,
  setComments,
  setTranslatedStoryLines,
  comments,
  translatedStoryLines,
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
        storyTranslationContentId: commentStoryTranslationContentId,
        content: text,
      };
      const result = await createComment({
        variables: { commentData },
      });
      if (result.data?.createComment.ok) {
        setText("");
        setCommentLine(0);

        setComments([...comments, result.data.createComment.comment]);
        const updatedStoryLines = [...translatedStoryLines];
        updatedStoryLines[lineIndex - 1].status = convertStatusTitleCase(
          "ACTION_REQUIRED",
        );
        setTranslatedStoryLines(updatedStoryLines);
      }
    } catch (err) {
      handleError(err ?? "Error occurred, please try again.");
    }
  };
  const name = `${authenticatedUser!!.firstName} 
                ${authenticatedUser!!.lastName}`;
  return (
    <Flex
      backgroundColor="white"
      border="1px solid"
      borderColor="blue.50"
      borderRadius={8}
      direction="column"
      padding="14px 15px"
      width="320px"
    >
      <b>Line {lineIndex}</b>
      <p>{name}</p>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        margin="8px 0"
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
