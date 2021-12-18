import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import { Flex, Button, Textarea } from "@chakra-ui/react";
import AuthContext from "../../contexts/AuthContext";
import {
  CreateCommentResponse,
  CREATE_COMMMENT,
} from "../../APIClients/mutations/CommentMutations";
import { UPDATE_STORY_TRANSLATION_LAST_ACTIVITY } from "../../APIClients/mutations/StoryMutations";
import { CommentResponse } from "../../APIClients/queries/CommentQueries";
import { StoryLine } from "../translation/Autosave";
import { convertStatusTitleCase } from "../../utils/StatusUtils";
import { insertSortedComments } from "../../utils/Utils";

export type WIPCommentProps = {
  storyTranslationId: number;
  isTranslator: boolean;
  storyTranslationContentId: number;
  WIPLineIndex: number;
  setCommentLine: (line: number) => void;
  comments: CommentResponse[];
  setComments: (comments: CommentResponse[]) => void;
  translatedStoryLines: StoryLine[];
  setTranslatedStoryLines: (storyLines: StoryLine[]) => void;
};

const WIPComment = ({
  storyTranslationId,
  isTranslator,
  storyTranslationContentId,
  WIPLineIndex,
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

  const [updateActivity] = useMutation<{}>(
    UPDATE_STORY_TRANSLATION_LAST_ACTIVITY,
  );

  const createNewComment = async () => {
    try {
      const commentData = {
        storyTranslationContentId,
        content: text,
      };
      const result = await createComment({
        variables: { commentData },
      });
      updateActivity({
        variables: {
          storyTranslationId,
          isTranslator,
        },
      });
      if (result.data?.createComment.ok) {
        setText("");
        setCommentLine(-1);
        setComments(
          insertSortedComments(comments, result.data.createComment.comment),
        );
        const updatedStoryLines = [...translatedStoryLines];
        updatedStoryLines[WIPLineIndex - 1].status =
          convertStatusTitleCase("ACTION_REQUIRED");
        setTranslatedStoryLines(updatedStoryLines);
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
  const name = `${authenticatedUser!!.firstName}
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
      <b>Line {WIPLineIndex}</b>
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
          variant="blueOutline"
          onClick={() => setCommentLine(-1)}
        >
          Cancel
        </Button>
      </Flex>
    </Flex>
  );
};

export default WIPComment;
