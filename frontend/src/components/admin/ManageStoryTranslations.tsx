import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Box, Heading } from "@chakra-ui/react";
import StoryTranslationsTable from "./StoryTranslationsTable";
import {
  buildStoriesQuery,
  StoryTranslation,
} from "../../APIClients/queries/StoryQueries";

const ManageStoryTranslations = () => {
  const query = buildStoriesQuery();
  const [storyTranslations, setStoryTranslations] = useState<
    StoryTranslation[]
  >([]);
  useQuery(query.string, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setStoryTranslations(data[query.fieldName]);
    },
  });

  return (
    <Box textAlign="center">
      <Heading float="left" margin="20px 30px" size="lg">
        Manage Story Translations
      </Heading>
      <StoryTranslationsTable storyTranslations={storyTranslations} />
    </Box>
  );
};

export default ManageStoryTranslations;
