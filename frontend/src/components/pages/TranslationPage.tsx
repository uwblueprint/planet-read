import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";

import "./TranslationPage.css";
import { useParams } from "react-router-dom";
import Cell from "../translation/Cell";
import EditableCell from "../translation/EditableCell";
import TranslationProgressBar from "../translation/TranslationProgressBar";
import CheckmarkIcon from "../../assets/checkmark.svg";
import CommentIcon from "../../assets/comment_no_number.svg";
import Autosave, { StoryLine } from "../translation/Autosave";

type TranslationPageProps = {
  storyIdParam: string | undefined;
  storyTranslationIdParam: string | undefined;
};

type Content = {
  id: number;
  lineIndex: number;
  content: string;
};
const GET_STORY_CONTENTS = (storyId: number, storyTranslationId: number) => gql`
  query {
    storyById(id: ${storyId}) {
      contents {
        id
        lineIndex
        content
      }
    }
    storyTranslationById(id: ${storyTranslationId}) {
      translationContents {
        id
        lineIndex
        content: translationContent
      },
      numTranslatedLines
    }
  }
`;

const TranslationPage = () => {
  const {
    storyIdParam,
    storyTranslationIdParam,
  } = useParams<TranslationPageProps>();

  const storyId = +storyIdParam!!;
  const storyTranslationId = +storyTranslationIdParam!!;

  const [translatedStoryLines, setTranslatedStoryLines] = useState<StoryLine[]>(
    [],
  );
  const [changedStoryLines, setChangedStoryLines] = useState<
    Map<number, StoryLine>
  >(new Map());
  const [numTranslatedLines, setNumTranslatedLines] = useState(0);
  const [numStoryLines, setNumStoryLines] = useState(0);
  const [percentageComplete, setPercentageComplete] = useState(0);

  const arrayIndex = (lineIndex: number): number =>
    lineIndex - translatedStoryLines[0].lineIndex;

  // TODO replace with real logic
  const translationStatusIcon = (): JSX.Element | null => {
    const randomNum = Math.floor(Math.random() * 3);

    switch (randomNum) {
      case 0:
        return <img src={CheckmarkIcon} alt="Approved line" />;
      case 1:
        return <img src={CommentIcon} alt="Line with feedback" />;
      default:
        return null;
    }
  };

  const updatePercentageComplete = (
    translatedLines: number,
    storyLines: number,
  ) => {
    setPercentageComplete((translatedLines / storyLines) * 100);
    setNumTranslatedLines(translatedLines);
  };

  const onChangeTranslationContent = async (
    newContent: string,
    lineIndex: number,
  ) => {
    const updatedContentArray = [...translatedStoryLines];
    const index = arrayIndex(lineIndex);

    if (
      // user deleted translation line
      !newContent.trim() &&
      translatedStoryLines[index]?.translatedContent?.trim()
    ) {
      updatePercentageComplete(numTranslatedLines - 1, numStoryLines);
    } else if (
      // user added new translation line
      newContent.trim() &&
      !translatedStoryLines[index]?.translatedContent?.trim()
    ) {
      updatePercentageComplete(numTranslatedLines + 1, numStoryLines);
    }
    updatedContentArray[index].translatedContent = newContent;
    setTranslatedStoryLines(updatedContentArray);
    setChangedStoryLines(
      changedStoryLines.set(lineIndex, updatedContentArray[index]),
    );
  };

  const clearUnsavedChangesMap = () => {
    setChangedStoryLines(new Map());
  };

  useQuery(GET_STORY_CONTENTS(storyId, storyTranslationId), {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      const storyContent = data.storyById.contents;
      const translatedContent = data.storyTranslationById.translationContents;

      setNumStoryLines(data.storyTranslationById.translationContents.length);
      updatePercentageComplete(
        data.storyTranslationById.numTranslatedLines,
        data.storyTranslationById.translationContents.length,
      );

      const contentArray: StoryLine[] = [];
      storyContent.forEach(({ content, lineIndex }: Content) => {
        contentArray.push({
          lineIndex,
          originalContent: content,
        });
      });

      contentArray.sort((a, b) => a.lineIndex - b.lineIndex);

      translatedContent.forEach(({ id, content, lineIndex }: Content) => {
        const arrIndex = lineIndex - contentArray[0].lineIndex;
        contentArray[arrIndex].translatedContent = content;
        contentArray[arrIndex].storyTranslationContentId = id;
      });
      setTranslatedStoryLines(contentArray);
    },
  });

  const storyCells = translatedStoryLines.map((storyLine: StoryLine) => {
    const displayLineNumber = storyLine.lineIndex + 1;

    return (
      <div
        className="row-translation"
        key={`row-${arrayIndex(storyLine.lineIndex)}`}
      >
        <p className="line-index">{displayLineNumber}</p>
        <Cell text={storyLine.originalContent} />
        <EditableCell
          text={storyLine.translatedContent!!}
          storyTranslationContentId={storyLine.storyTranslationContentId!!}
          lineIndex={storyLine.lineIndex}
          onChange={onChangeTranslationContent}
        />
        {translationStatusIcon()}
      </div>
    );
  });

  return (
    <div className="translation-page">
      <h1>Story Title Here</h1>
      <h4>View story details</h4>
      <div className="translation-container">
        <div className="translation-content">{storyCells}</div>
        <div className="translation-sidebar">
          <div className="translation-progress-bar">
            <TranslationProgressBar percentageComplete={percentageComplete} />
          </div>
        </div>
      </div>
      <Autosave
        storylines={Array.from(changedStoryLines.values())}
        onSuccess={clearUnsavedChangesMap}
      />
    </div>
  );
};

export default TranslationPage;
