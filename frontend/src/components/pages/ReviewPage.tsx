import React, { useState } from "react";
import { useQuery } from "@apollo/client";

import "./TranslationPage.css";
import { useParams } from "react-router-dom";
import ProgressBar from "../utils/ProgressBar";
import TranslationTable from "../translation/TranslationTable";
import { StoryLine } from "../translation/Autosave";
import { GET_STORY_AND_TRANSLATION_CONTENTS } from "../../APIClients/queries/StoryQueries";
import CommentsPanel from "../review/CommentsPanel";
import FontSizeSlider from "../translation/FontSizeSlider";

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

  const handleFontSizeChange = (val: string) => {
    setFontSize(val);
  };

  useQuery(GET_STORY_AND_TRANSLATION_CONTENTS(storyId, storyTranslationId), {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      const storyContent = data.storyById.contents;
      const translatedContent = data.storyTranslationById.translationContents;

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
    <div className="translation-page">
      <h1>Story Title Here</h1>
      <h4>View story details</h4>
      <FontSizeSlider setFontSize={handleFontSizeChange} />
      <div className="translation-container">
        <div className="translation-content">
          <TranslationTable
            translatedStoryLines={translatedStoryLines}
            fontSize={fontSize}
          />
        </div>
        <div className="translation-sidebar">
          <div className="translation-progress-bar">
            <ProgressBar
              percentageComplete={
                (numTranslatedLines / translatedStoryLines.length) * 100
              }
            />
          </div>
        </div>
        <CommentsPanel storyTranslationId={storyTranslationId} />
      </div>
    </div>
  );
};

export default ReviewPage;
