import React, { useState } from "react";
import { Box, Heading, Flex } from "@chakra-ui/react";
import StoryTranslationsTable from "./StoryTranslationsTable";
import TableFilter from "./TableFilter";
import {
  buildStoriesQuery,
  StoryTranslation,
} from "../../APIClients/queries/StoryQueries";
import { convertTitleCaseToLanguage } from "../../utils/LanguageUtils";
import { convertTitleCaseToStage } from "../../utils/StageUtils";
import { STORY_TRANSLATION_TABLE_FILTER_SEARCH_BAR_PLACEHOLDER } from "../../utils/Copy";
import usePagination from "../../utils/hooks/usePagination";

const ITEMS_PER_PAGE = 10;

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

  const { loading, pageResults, paginator } = usePagination<StoryTranslation>(
    query.string,
    query.fieldName,
    ITEMS_PER_PAGE,
  );

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
      <StoryTranslationsTable
        loading={loading}
        storyTranslationSlice={pageResults}
        paginator={paginator}
        filters={[setLanguage, setLevel, setStage, setSearchText]}
      />
    </Box>
  );
};

export default ManageStoryTranslations;
