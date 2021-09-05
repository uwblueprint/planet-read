import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Box, Divider, Flex } from "@chakra-ui/react";

import { useParams } from "react-router-dom";
import ProgressBar from "../utils/ProgressBar";
import TranslationTable from "../translation/TranslationTable";
import { StoryLine } from "../translation/Autosave";
import { GET_STORY_AND_TRANSLATION_CONTENTS } from "../../APIClients/queries/StoryQueries";
import CommentsPanel from "../review/CommentsPanel";
import FontSizeSlider from "../translation/FontSizeSlider";
import convertLanguageTitleCase from "../../utils/LanguageUtils";
import Header from "../navigation/Header";

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
  const [title, setTitle] = useState<string>("");
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
      setTitle(data.storyById.title);
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
    <Box height="100vh" overflow="hidden">
      <Header title={title} />
      <Divider />
      <Flex justify="space-between">
        <Box width="100%">
          <Flex justify="space-between" alignItems="center" margin="10px 30px">
            <FontSizeSlider setFontSize={handleFontSizeChange} />
          </Flex>
          <Divider />
          <Box margin="0 0 0 20px">
            <Flex
              direction="column"
              overflowY="auto"
              height="calc(100vh - 250px)"
            >
              <TranslationTable
                translatedStoryLines={translatedStoryLines}
                fontSize={fontSize}
                originalLanguage="English"
                translatedLanguage={convertLanguageTitleCase(language)}
              />
            </Flex>
            <Flex
              margin="20px 10px"
              justify="space-between"
              alignItems="center"
            >
              <ProgressBar
                percentageComplete={
                  (numTranslatedLines / translatedStoryLines.length) * 100
                }
              />
            </Flex>
          </Box>
        </Box>
        <CommentsPanel storyTranslationId={storyTranslationId} />
      </Flex>
    </Box>
  );
};

export default ReviewPage;
