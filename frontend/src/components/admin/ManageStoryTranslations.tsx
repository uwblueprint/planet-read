import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Box, Heading, Flex } from "@chakra-ui/react";
import StoryTranslationsTable from "./StoryTranslationsTable";
import TableFilter from "./TableFilter";
import {
  buildStoriesQuery,
  StoryTranslation,
  StoryTranslationEdge,
} from "../../APIClients/queries/StoryQueries";
import { convertTitleCaseToLanguage } from "../../utils/LanguageUtils";
import { convertTitleCaseToStage } from "../../utils/StageUtils";
import { STORY_TRANSLATION_TABLE_FILTER_SEARCH_BAR_PLACEHOLDER } from "../../utils/Copy";

const ManageStoryTranslations = () => {
  const [language, setLanguage] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [stage, setStage] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string | null>(null);
  const query = buildStoriesQuery(
    convertTitleCaseToLanguage(language || ""),
    parseInt(level || "", 10) || 0,
    convertTitleCaseToStage(stage || ""),
    searchText || "",
  );
  const [storyTranslations, setStoryTranslations] = useState<
    StoryTranslation[]
  >([]);
  useQuery(query.string, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data: {
      storyTranslations: { edges: StoryTranslationEdge[] };
    }) => {
      const translations = data.storyTranslations.edges.map((e) => e.node);
      setStoryTranslations(translations);
    },
  });

  return (
    <Box textAlign="center">
      <Flex>
        <Heading float="left" margin="20px 30px" size="lg">
          Manage Story Translations
        </Heading>
      </Flex>
      <TableFilter
        language={language}
        setLanguage={setLanguage}
        level={level}
        setLevel={setLevel}
        stage={stage}
        setStage={setStage}
        searchText={searchText}
        setSearchText={setSearchText}
        searchBarPlaceholder={
          STORY_TRANSLATION_TABLE_FILTER_SEARCH_BAR_PLACEHOLDER
        }
        useLanguage
        useLevel
        useStage
      />
      <StoryTranslationsTable storyTranslations={storyTranslations} />
    </Box>
  );
};

export default ManageStoryTranslations;
