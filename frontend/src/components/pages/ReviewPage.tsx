import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Box, Divider, Flex } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

import ProgressBar from "../utils/ProgressBar";
import TranslationTable from "../translation/TranslationTable";
import { StoryLine } from "../translation/Autosave";
import { convertStatusTitleCase } from "../../utils/StatusUtils";
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
  const [numApprovedLines, setNumApprovedLines] = useState(0);

  const [fontSize, setFontSize] = useState<string>("12px");
  const [title, setTitle] = useState<string>("");
  const [language, setLanguage] = useState<string>("");

  const [commentLine, setCommentLine] = useState(-1);

  const [
    commentStoryTranslationContentId,
    setCommentStoryTranslationContentId,
  ] = useState<number>(-1);

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
      setNumApprovedLines(data.storyTranslationById.numApprovedLines);

      const contentArray: StoryLine[] = [];
      storyContent.forEach(({ content, lineIndex }: Content) => {
        contentArray.push({
          lineIndex,
          originalContent: content,
        });
      });

      contentArray.sort((a, b) => a.lineIndex - b.lineIndex);

      translatedContent.forEach(
        ({ id, content, lineIndex, status }: Content) => {
          contentArray[lineIndex].translatedContent = content;
          contentArray[lineIndex].storyTranslationContentId = id;
          contentArray[lineIndex].status = convertStatusTitleCase(status);
        },
      );
      setTranslatedStoryLines(contentArray);
    },
  });

  return (
    <Flex
      height="100vh"
      direction="column"
      position="absolute"
      top="0"
      bottom="0"
      left="0"
      right="0"
      overflow="hidden"
    >
      <Header title={title} />
      <Divider />
      <Flex justify="space-between" flex={1} minHeight={0}>
        <Flex width="100%" direction="column">
          <Flex justify="space-between" alignItems="center" margin="10px 30px">
            <FontSizeSlider setFontSize={handleFontSizeChange} />
          </Flex>
          <Divider />
          <Flex
            marginLeft="20px"
            direction="column"
            flex={1}
            minHeight={0}
            overflowY="auto"
          >
            <TranslationTable
              storyTranslationId={storyTranslationId}
              translatedStoryLines={translatedStoryLines}
              fontSize={fontSize}
              originalLanguage="English"
              translatedLanguage={convertLanguageTitleCase(language)}
              commentLine={commentLine}
              setCommentLine={setCommentLine}
              setCommentStoryTranslationContentId={
                setCommentStoryTranslationContentId
              }
              translator={false}
              setTranslatedStoryLines={setTranslatedStoryLines}
              numApprovedLines={numApprovedLines}
              setNumApprovedLines={setNumApprovedLines}
              reviewPage
            />
          </Flex>
          <Flex margin="20px 30px" justify="flex-start" alignItems="center">
            <Box marginRight="10px">
              <ProgressBar
                percentageComplete={
                  (numTranslatedLines / translatedStoryLines.length) * 100
                }
                type="Translation"
              />
            </Box>
            <Box>
              <ProgressBar
                percentageComplete={
                  (numApprovedLines / translatedStoryLines.length) * 100
                }
                type="Review"
              />
            </Box>
          </Flex>
        </Flex>
        <CommentsPanel
          disabled={false}
          commentStoryTranslationContentId={commentStoryTranslationContentId}
          commentLine={commentLine}
          storyTranslationId={storyTranslationId}
          setCommentLine={setCommentLine}
        />
      </Flex>
    </Flex>
  );
};

export default ReviewPage;
