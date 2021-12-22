import React, { useState } from "react";
import { Box, Heading, Flex } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import {
  buildStoryTranslationTestsQuery,
  StoryTranslationTest,
} from "../../APIClients/queries/StoryQueries";
import { convertTitleCaseToLanguage } from "../../utils/LanguageUtils";
import { convertTitleCaseToStage } from "../../utils/StageUtils";
import StoryTestsTable from "./StoryTestsTable";

const ManageStoryTests = () => {
  // TODO: uncomment if filters are implemented
  /* eslint-disable */
  const [language, setLanguage] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [stage, setStage] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string | null>(null);
  const [storyTests, setStoryTests] = useState<StoryTranslationTest[]>([]);
  /* eslint-enable */

  const query = buildStoryTranslationTestsQuery(
    convertTitleCaseToLanguage(language || ""),
    parseInt(level || "", 10) || 0,
    convertTitleCaseToStage(stage || ""),
    searchText || "",
  );

  const { data } = useQuery(query.string, {
    fetchPolicy: "cache-and-network",
    onCompleted: () => {
      const result = [...data[query.fieldName]];
      setStoryTests(result.filter((test) => test.stage === "REVIEW"));
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
