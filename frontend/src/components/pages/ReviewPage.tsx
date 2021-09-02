import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Box, Flex, Text } from "@chakra-ui/react";

import { useParams } from "react-router-dom";
import ProgressBar from "../utils/ProgressBar";
import TranslationTable from "../translation/TranslationTable";
import { StoryLine } from "../translation/Autosave";
import { GET_STORY_AND_TRANSLATION_CONTENTS } from "../../APIClients/queries/StoryQueries";
import CommentsPanel from "../review/CommentsPanel";
import FontSizeSlider from "../translation/FontSizeSlider";
import convertLanguageTitleCase from "../../utils/LanguageUtils";

type ReviewPageProps = {
  storyIdParam: string | undefined;
  storyTranslationIdParam: string | undefined;
};

type Content = {
  id: number;
  lineIndex: number;
  content: string;
  status: string;
};

const ReviewPage = () => {
  const {
    storyIdParam,
    storyTranslationIdParam,
  } = useParams<ReviewPageProps>();

  const storyId = +storyIdParam!!;
  const storyTranslationId = +storyTranslationIdParam!!;
  const [translatedStoryLines, setTranslatedStoryLines] = useState<StoryLine[]>(
    [],
  );
  const [numTranslatedLines, setNumTranslatedLines] = useState(0);

  const [fontSize, setFontSize] = useState<string>("12px");
  const [language, setLanguage] = useState<string>("");

  const handleFontSizeChange = (val: string) => {
    setFontSize(val);
  };

  useQuery(GET_STORY_AND_TRANSLATION_CONTENTS(storyId, storyTranslationId), {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      const storyContent = data.storyById.contents;
      const translatedContent = data.storyTranslationById.translationContents;
      setLanguage(data.storyTranslationById.language);
      setNumTranslatedLines(data.storyTranslationById.numTranslatedLines);

      const contentArray: StoryLine[] = [];
      storyContent.forEach(({ content, lineIndex }: Content) => {
        contentArray.push({
          lineIndex,
          originalContent: content,
          status: "Default",
        });
      });

      contentArray.sort((a, b) => a.lineIndex - b.lineIndex);

      translatedContent.forEach(({ id, content, lineIndex }: Content) => {
        contentArray[lineIndex].translatedContent = content;
        contentArray[lineIndex].storyTranslationContentId = id;
      });
      setTranslatedStoryLines(contentArray);
    },
  });

  return (
    <Box margin="20px 20px 0px 20px">
      <Text size="lg">Story Title Here</Text>
      <Text as="ins">View story details</Text>
      <FontSizeSlider setFontSize={handleFontSizeChange} />
      <Flex>
        <Flex direction="column" width="75vw">
          <TranslationTable
            translatedStoryLines={translatedStoryLines}
            fontSize={fontSize}
            translatedLanguage={convertLanguageTitleCase(language)}
          />
        </Flex>
        <Box margin="20px 30px 0 0">
          <ProgressBar
            percentageComplete={
              (numTranslatedLines / translatedStoryLines.length) * 100
            }
          />
        </Box>
        <CommentsPanel storyTranslationId={storyTranslationId} />
      </Flex>
    </Box>
  );
};

export default ReviewPage;
