import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icon";
import { MdLibraryAdd } from "react-icons/md";
import Statistic from "./Statistic";
import StoryTranslationsTable from "./StoryTranslationsTable";
import TableFilter from "./TableFilter";
import {
  buildStoryTranslationsQuery,
  GET_STORY_TRANSLATION_STATISTICS,
  StoryTranslation,
} from "../../APIClients/queries/StoryQueries";
import { convertTitleCaseToStage } from "../../utils/StageUtils";
import { STORY_TRANSLATION_TABLE_FILTER_SEARCH_BAR_PLACEHOLDER } from "../../utils/Copy";
import usePagination from "../../utils/hooks/usePagination";
import AddLanguageModal from "./AddLanguageModal";

const ITEMS_PER_PAGE = 10;

const ManageStoryTranslations = () => {
  const [language, setLanguage] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [stage, setStage] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string | null>(null);
  const [numTranslationsInTranslation, setNumTranslationsInTranslation] =
    useState(0);
  const [numTranslationsInReview, setNumTranslationsInReview] = useState(0);
  const [numTranslationsCompleted, setNumTranslationsCompleted] = useState(0);
  const [isAddNewLanguageModalOpen, setIsAddNewLanguageModalOpen] =
    useState(false);
  const [isAscendingLastEdited, setIsAscendingLastEdited] = useState(false);

  const query = buildStoryTranslationsQuery(
    0,
    language || "",
    parseInt(level || "", 10) || 0,
    convertTitleCaseToStage(stage || ""),
    searchText || "",
    isAscendingLastEdited,
  );

  const { loading, pageResults, paginator } = usePagination<StoryTranslation>(
    query.string,
    query.fieldName,
    ITEMS_PER_PAGE,
  );

  useQuery(GET_STORY_TRANSLATION_STATISTICS, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setNumTranslationsInTranslation(
        data.storyTranslationStatistics.numTranslationsInTranslation,
      );
      setNumTranslationsInReview(
        data.storyTranslationStatistics.numTranslationsInReview,
      );
      setNumTranslationsCompleted(
        data.storyTranslationStatistics.numTranslationsCompleted,
      );
    },
  });

  return (
    <>
      <Box textAlign="center">
        <Flex padding="35px 35px 10px 35px">
          <Statistic
            header="IN TRANSLATION"
            num={numTranslationsInTranslation}
          />
          <Statistic header="IN REVIEW" num={numTranslationsInReview} />
          <Statistic header="COMPLETED" num={numTranslationsCompleted} />
          <Box
            border="1px solid"
            borderColor="gray.200"
            borderRadius="10px"
            margin="10px"
            textDecoration="none"
            _hover={{ cursor: "pointer", textDecoration: "none" }}
            onClick={() => setIsAddNewLanguageModalOpen(true)}
          >
            <Box
              color="blue.500"
              height="150px"
              paddingTop="35px"
              width="200px"
            >
              <Icon
                as={MdLibraryAdd}
                height={10}
                marginBottom="10px"
                transform="rotate(270deg)"
                width={10}
              />
              <Heading size="sm" textTransform="uppercase">
                LANGUAGE
              </Heading>
            </Box>
          </Box>
        </Flex>
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
          setQueryIsAscendingLastEdited={setIsAscendingLastEdited}
        />
      </Box>
      <AddLanguageModal
        isOpen={isAddNewLanguageModalOpen}
        onClose={() => setIsAddNewLanguageModalOpen(false)}
      />
    </>
  );
};

export default ManageStoryTranslations;
