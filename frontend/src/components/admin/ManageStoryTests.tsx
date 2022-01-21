import React, { useState } from "react";
import { Box, Heading, Flex } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import {
  buildStoryTranslationTestsQuery,
  StoryTranslationTest,
} from "../../APIClients/queries/StoryQueries";
import StoryTestsTable from "./StoryTestsTable";

const ManageStoryTests = () => {
  const [storyTests, setStoryTests] = useState<StoryTranslationTest[]>([]);

  const query = buildStoryTranslationTestsQuery("", 0, "", "", true);

  const { data } = useQuery(query.string, {
    fetchPolicy: "cache-and-network",
    onCompleted: () => {
      const result = [...data[query.fieldName]];
      setStoryTests(result);
    },
  });

  return (
    <Box textAlign="center">
      <Flex>
        <Heading float="left" margin="20px 30px" size="lg">
          Tests
        </Heading>
      </Flex>
      <StoryTestsTable storyTests={storyTests} setStoryTests={setStoryTests} />
    </Box>
  );
};

export default ManageStoryTests;
