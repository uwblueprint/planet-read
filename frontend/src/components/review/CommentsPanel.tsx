import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Box, Button, Flex, Text, Select } from "@chakra-ui/react";
import {
  CommentResponse,
  buildCommentsQuery,
} from "../../APIClients/queries/CommentQueries";

export type CommentPanelProps = {
  storyTranslationId: number;
};

const CommentsPanel = ({ storyTranslationId }: CommentPanelProps) => {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [filterIndex, setFilterIndex] = useState(0);

  const filterOptions = ["All", "Resolved", "Unresolved"];
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

  const CommentsList = () => {
    if (comments.length > 0) {
      return (
        <Box>
          {comments.map((comment: CommentResponse) => (
            // TODO: replace with actual comment component
            <Text key={comment.id} variant="comment">
              {JSON.stringify(comment.content)}
            </Text>
          ))}
        </Box>
      );
    }
    return (
      <Text variant="comment">
        Looks like there aren`&apos;`t any comments yet! Select the Comment
        button above to begin leaving comments.
      </Text>
    );
  };

  const filterOptionsComponent = filterOptions.map((op) => (
    <option key={op} value={op}>
      {op}
    </option>
  ));

  return (
    <Box backgroundColor="gray.100" float="right" width="350px" padding="20px">
      <Flex marginBottom="50px">
        <Button colorScheme="blue" size="secondary" marginRight="10px">
          Comment
        </Button>
        <Select
          name="comment filter"
          id="comment filter"
          value={filterOptions[filterIndex]}
          variant="commentsFilter"
          onChange={handleCommentFilterSelectChange}
          width="160px"
        >
          {filterOptionsComponent}
        </Select>
      </Flex>
      <CommentsList />
    </Box>
  );
};

export default CommentsPanel;
