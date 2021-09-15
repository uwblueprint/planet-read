import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Icon } from "@chakra-ui/icon";
import { Box, Button, Divider, Flex, IconButton, Text } from "@chakra-ui/react";
import { MdRedo, MdUndo } from "react-icons/md";
import { useParams } from "react-router-dom";
import ProgressBar from "../utils/ProgressBar";
import TranslationTable from "../translation/TranslationTable";
import Autosave, { StoryLine } from "../translation/Autosave";
import { convertStatusTitleCase } from "../../utils/StatusUtils";
import { GET_STORY_AND_TRANSLATION_CONTENTS } from "../../APIClients/queries/StoryQueries";
import FontSizeSlider from "../translation/FontSizeSlider";
import convertLanguageTitleCase from "../../utils/LanguageUtils";
import Header from "../navigation/Header";
import CommentsPanel from "../review/CommentsPanel";

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
  const [title, setTitle] = useState<string>("");
  const [language, setLanguage] = useState<string>("");

  const [isCommenting, setIsCommenting] = useState<boolean>(false);
  const [commentLine, setCommentLine] = useState(0);
  const [
    storyTranslationContentId,
    setStoryTranslationContentId,
  ] = useState<number>(-1);

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
      setLanguage(data.storyTranslationById.language);
      setTitle(data.storyById.title);
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
    <Flex
      height="100vh"
      direction="column"
      position="absolute"
      top="0"
      bottom="0"
      left="0"
      right="0"
    >
      <Header title={title} />
      <Divider />
      <Flex justify="space-between" flex={1} minHeight={0}>
        <Flex width="100%" direction="column">
          <Flex justify="space-between" alignItems="center" margin="10px 30px">
            <FontSizeSlider setFontSize={handleFontSizeChange} />
            <Flex direction="row">
              <IconButton
                size="undoRedo"
                variant="ghost"
                aria-label="Undo Change"
                onClick={undoChange}
                icon={<Icon as={MdUndo} />}
              />
              <IconButton
                variant="ghost"
                size="undoRedo"
                aria-label="Redo Change"
                onClick={redoChange}
                icon={<Icon as={MdRedo} />}
              />
            </Flex>
          </Flex>
          <Divider />
          <Flex
            marginLeft="20px"
            direction="column"
            flex={1}
            minHeight={0}
            overflowY="auto"
          >
            {maxCharsExceededWarning()}
            <TranslationTable
              translatedStoryLines={translatedStoryLines}
              onUserInput={onUserInput}
              editable
              fontSize={fontSize}
              originalLanguage="English"
              translatedLanguage={convertLanguageTitleCase(language)}
              isCommenting={isCommenting}
              setCommentLine={setCommentLine}
              setStoryTranslationContentId={setStoryTranslationContentId}
            />
          </Flex>
          <Flex margin="20px 30px" justify="space-between" alignItems="center">
            <ProgressBar
              percentageComplete={
                (numTranslatedLines / translatedStoryLines.length) * 100
              }
              type="Translation"
            />
            <Button colorScheme="blue" size="secondary" margin="0 10px 0">
              SEND FOR REVIEW
            </Button>
          </Flex>
        </Flex>
        <CommentsPanel
          storyTranslationContentId={storyTranslationContentId}
          isCommenting={isCommenting}
          setIsCommenting={setIsCommenting}
          commentLine={commentLine}
          storyTranslationId={storyTranslationId}
          setCommentLine={setCommentLine}
        />
      </Flex>
      <Autosave
        storylines={Array.from(changedStoryLines.values())}
        onSuccess={clearUnsavedChangesMap}
      />
    </Flex>
  );
};

export default TranslationPage;
