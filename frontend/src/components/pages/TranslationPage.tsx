import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Icon } from "@chakra-ui/icon";
import { Box, IconButton, Flex, Text } from "@chakra-ui/react";
import { MdRedo, MdUndo } from "react-icons/md";

import { useParams } from "react-router-dom";
import ProgressBar from "../utils/ProgressBar";
import TranslationTable from "../translation/TranslationTable";
import Autosave, { StoryLine } from "../translation/Autosave";
import convertStatusTitleCase from "../../utils/StatusUtils";
import { GET_STORY_AND_TRANSLATION_CONTENTS } from "../../APIClients/queries/StoryQueries";
import FontSizeSlider from "../translation/FontSizeSlider";

type TranslationPageProps = {
  storyIdParam: string | undefined;
  storyTranslationIdParam: string | undefined;
};

type Content = {
  id: number;
  lineIndex: number;
  content: string;
  status: string;
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

  const [fontSize, setFontSize] = useState<string>("12px");

  const handleFontSizeChange = (val: string) => {
    setFontSize(val);
  };

  const deepCopy = (lines: Object) => {
    // This is a funky method to make deep copies on objects with primative values
    // https://javascript.plainenglish.io/how-to-deep-copy-objects-and-arrays-in-javascript-7c911359b089
    // Should probably go under some util
    return JSON.parse(JSON.stringify(lines));
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

  const maxCharsExceededWarning = () => {
    const exceededLines: number[] = [];
    translatedStoryLines.forEach((storyLine: StoryLine) => {
      if (
        storyLine.translatedContent &&
        storyLine.originalContent.length * 2 <=
          storyLine.translatedContent.length
      ) {
        exceededLines.push(storyLine.lineIndex + 1);
      }
    });

    const exceededLinesJoined = exceededLines.join(", ");
    return exceededLines.length > 0 ? (
      <Box>
        <Text>
          {"⚠ You have exceeded the character limit in the following lines: "}
          {exceededLinesJoined}
        </Text>
      </Box>
    ) : null;
  };

  return (
    <Box margin="20px 20px 0px 20px">
      <Text size="lg">Story Title Here</Text>
      <Text as="ins">View story details</Text>
      <FontSizeSlider setFontSize={handleFontSizeChange} />
      <Flex>
        <Flex direction="column" width="75vw">
          <Flex direction="row">
            <IconButton
              variant="ghost"
              aria-label="Undo Change"
              onClick={undoChange}
              icon={<Icon as={MdUndo} />}
            />
            <IconButton
              variant="ghost"
              aria-label="Redo Change"
              onClick={redoChange}
              icon={<Icon as={MdRedo} />}
            />
          </Flex>
          {maxCharsExceededWarning()}
          <TranslationTable
            translatedStoryLines={translatedStoryLines}
            onUserInput={onUserInput}
            editable
            fontSize={fontSize}
          />
        </Flex>
        <Box margin="20px 30px 0 0">
          <ProgressBar
            percentageComplete={
              (numTranslatedLines / translatedStoryLines.length) * 100
            }
          />
        </Box>
      </Flex>
      <Autosave
        storylines={Array.from(changedStoryLines.values())}
        onSuccess={clearUnsavedChangesMap}
      />
    </Box>
  );
};

export default TranslationPage;
