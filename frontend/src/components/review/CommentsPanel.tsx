import React, { useState } from "react";
import { useQuery } from "@apollo/client";

import { Box, Text, Select } from "@chakra-ui/react";
import {
  CommentResponse,
  buildCommentsQuery,
} from "../../APIClients/queries/StoryQueries";

export type CommentPanelProps = {
  storyTranslationId: number;
};

const CommentsPanel = ({ storyTranslationId }: CommentPanelProps) => {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [filterIndex, setFilterIndex] = useState(0);

  const filterOptions = ["Show All", "Show Resolved", "Show Unresolved"];
  const filterToResolved = [null, true, false];
  const commentsQuery = buildCommentsQuery(
    storyTranslationId,
    filterToResolved[filterIndex],
  );
  useQuery(commentsQuery.string, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setComments(data.commentsByStoryTranslation);
    },
  });

  const handleCommentFilterSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setFilterIndex(event.target.selectedIndex);
  };

  const commentsComponents = comments.map((comment: CommentResponse) => (
    <Text key={comment.id}>{JSON.stringify(comment)}</Text>
  ));
  const filterOptionsComponent = filterOptions.map((op) => (
    <option key={op} value={op}>
      {op}
    </option>
  ));

  return (
    <Box backgroundColor="gray.300" float="right" width="250px">
      <Select
        name="comment filter"
        id="comment filter"
        value={filterOptions[filterIndex]}
        onChange={handleCommentFilterSelectChange}
      >
        {filterOptionsComponent}
      </Select>
      Comments
      {commentsComponents}
    </Box>
  );
};

export default CommentsPanel;
