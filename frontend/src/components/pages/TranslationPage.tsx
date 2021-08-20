import React, { useState } from "react";
import { useQuery } from "@apollo/client";

import "./TranslationPage.css";
import { useParams } from "react-router-dom";
import Cell from "../translation/Cell";
import EditableCell from "../translation/EditableCell";
import TranslationProgressBar from "../translation/TranslationProgressBar";
import CheckmarkIcon from "../../assets/checkmark.svg";
import CommentIcon from "../../assets/comment_no_number.svg";
import Autosave, { StoryLine } from "../translation/Autosave";
import { GET_STORY_AND_TRANSLATION_CONTENTS } from "../../APIClients/queries/StoryQueries";

type TranslationPageProps = {
  storyIdParam: string | undefined;
  storyTranslationIdParam: string | undefined;
};

type Content = {
  id: number;
  lineIndex: number;
  content: string;
};

type HistoryStack = {
  Undo: Array<{ lineIndex: number; content: string }>;
  Redo: Array<{ lineIndex: number; content: string }>;
};

const TranslationPage = () => {
  const MAX_STACK_SIZE = 100;
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

  const [versionHistoryStack, setVersionHistoryStack] = useState<HistoryStack>({
    Undo: [],
    Redo: [],
  });

  const deepCopy = (lines: Object) => {
    // This is a funky method to make deep copies on objects with primative values
    // https://javascript.plainenglish.io/how-to-deep-copy-objects-and-arrays-in-javascript-7c911359b089
    // Should probably go under some util
    return JSON.parse(JSON.stringify(lines));
  };

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

  const onChangeTranslationContent = async (
    newContent: string,
    lineIndex: number,
  ) => {
    const updatedContentArray = [...translatedStoryLines];
    if (
      // user deleted translation line
      !newContent.trim() &&
      translatedStoryLines[lineIndex].translatedContent!!.trim()
    ) {
      setNumTranslatedLines(numTranslatedLines - 1);
    } else if (
      // user added new translation line
      newContent.trim() &&
      !translatedStoryLines[lineIndex].translatedContent!!.trim()
    ) {
      setNumTranslatedLines(numTranslatedLines + 1);
    }
    updatedContentArray[lineIndex].translatedContent = newContent;
    setTranslatedStoryLines(updatedContentArray);
    setChangedStoryLines(
      changedStoryLines.set(lineIndex, updatedContentArray[lineIndex]),
    );
  };

  const onUserInput = async (
    newContent: string,
    lineIndex: number,
    maxChars: number,
  ) => {
    const oldContent = translatedStoryLines[lineIndex].translatedContent!;
    const newUndo =
      versionHistoryStack.Undo.length === MAX_STACK_SIZE
        ? versionHistoryStack.Undo.slice(1)
        : versionHistoryStack.Undo;
    setVersionHistoryStack({
      Undo: [...deepCopy(newUndo), { lineIndex, content: oldContent }],
      Redo: [],
    });

    if (maxChars >= newContent.length) {
      onChangeTranslationContent(newContent, lineIndex);
    }
  };

  const undoChange = () => {
    if (versionHistoryStack.Undo.length > 0) {
      const { lineIndex, content: newContent } = versionHistoryStack.Undo[
        versionHistoryStack.Undo.length - 1
      ];
      const oldContent = translatedStoryLines[lineIndex].translatedContent;
      if (oldContent !== newContent) {
        const newRedo =
          versionHistoryStack.Redo.length === MAX_STACK_SIZE
            ? versionHistoryStack.Redo.slice(1)
            : versionHistoryStack.Redo;
        const newHistory = {
          Undo: deepCopy(versionHistoryStack.Undo.slice(0, -1)),
          Redo: [
            ...deepCopy(newRedo),
            {
              lineIndex,
              content: oldContent,
            },
          ],
        };
        setVersionHistoryStack(newHistory);
        onChangeTranslationContent(newContent, lineIndex);
      }
    }
  };

  const redoChange = () => {
    if (versionHistoryStack.Redo.length > 0) {
      const { lineIndex, content: newContent } = versionHistoryStack.Redo[
        versionHistoryStack.Redo.length - 1
      ];
      const oldContent = translatedStoryLines[lineIndex].translatedContent;
      if (oldContent !== newContent) {
        const newUndo =
          versionHistoryStack.Undo.length === MAX_STACK_SIZE
            ? versionHistoryStack.Undo.slice(1)
            : versionHistoryStack.Undo;
        const newHistory = {
          Undo: [
            ...deepCopy(newUndo),
            {
              lineIndex,
              content: oldContent,
            },
          ],
          Redo: deepCopy(versionHistoryStack.Redo.slice(0, -1)),
        };
        setVersionHistoryStack(newHistory);
        onChangeTranslationContent(newContent, lineIndex);
      }
    }
  };

  const clearUnsavedChangesMap = () => {
    setChangedStoryLines(new Map());
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
      <div className="row-translation" key={`row-${storyLine.lineIndex}`}>
        <p className="line-index">{displayLineNumber}</p>
        <Cell text={storyLine.originalContent} />
        <EditableCell
          text={storyLine.translatedContent!!}
          storyTranslationContentId={storyLine.storyTranslationContentId!!}
          lineIndex={storyLine.lineIndex}
          maxChars={storyLine.originalContent.length * 2}
          onChange={onUserInput}
        />
        {translationStatusIcon()}
      </div>
    );
  });

  const maxCharsExceededWarning = () => {
    let exceededLines = ""; 
    translatedStoryLines.map((storyLine: StoryLine) => {
      if (
        storyLine.translatedContent &&
        storyLine.originalContent.length * 2 <= storyLine.translatedContent.length) 
        {
        exceededLines += (", " + String(storyLine.lineIndex + 1));
      }
    });

    return (
      <div>
        <p>
          You have exceeded the character limit in the following lines: 
        </p>
      </div>
    );
  };
  //   const exceededLines = (storyLine: StoryLine) => {
  //     return <div>{storyLine.lineIndex}</div>;
  //   }
  //   return (
  //     <div>You have exceeded the character limits on the following line(s):
  //     </div>
  //   )

  // ));

  return (
    <div className="translation-page">
      <h1>Story Title Here</h1>
      <h4>View story details</h4>
      <div className="translation-container">
        <div className="translation-content">
          <button onClick={undoChange} type="button">
            Undo
          </button>
          <button onClick={redoChange} type="button">
            Redo
          </button>
          {maxCharsExceededWarning}
          {storyCells}
        </div>
        <div className="translation-sidebar">
          <div className="translation-progress-bar">
            <TranslationProgressBar
              percentageComplete={
                (numTranslatedLines / translatedStoryLines.length) * 100
              }
            />
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
