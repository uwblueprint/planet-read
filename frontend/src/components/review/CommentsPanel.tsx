import React, { useState } from "react";
import { useQuery } from "@apollo/client";

import { Box, Text } from "@chakra-ui/react";
import {
  CommentResponse,
  buildCommentsQuery,
} from "../../APIClients/queries/StoryQueries";

export type CommentPanelProps = {
  storyTranslationId: number;
};

const CommentsPanel = ({ storyTranslationId }: CommentPanelProps) => {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const commentsQuery = buildCommentsQuery(storyTranslationId);
  useQuery(commentsQuery.string, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setComments(data.commentsByStoryTranslation);
    },
  });
  const commentsComponents = comments.map((comment: CommentResponse) => (
    <Text key={comment.id}>{JSON.stringify(comment)}</Text>
  ));

  return (
    <Box backgroundColor="gray.300" float="right" width="250px">
      Comments
      {commentsComponents}
    </Box>
  );
};

export default CommentsPanel;
