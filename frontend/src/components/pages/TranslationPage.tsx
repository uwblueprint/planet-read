import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import ProgressBar from "../utils/ProgressBar";
import TranslationTable from "../translation/TranslationTable";
import Autosave, { StoryLine } from "../translation/Autosave";
import convertStatusTitleCase from "../../utils/StatusUtils";
import { GET_STORY_AND_TRANSLATION_CONTENTS } from "../../APIClients/queries/StoryQueries";
import FontSizeSlider from "../translation/FontSizeSlider";
import convertLanguageTitleCase from "../../utils/LanguageUtils";
import PlaceholderUserIcon from "../../assets/user-icon.svg";
import UndoIcon from "../../assets/Undo";
import RedoIcon from "../../assets/Redo";
import PlanetReadLogo from "../../assets/planet-read-logo.svg";

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
    <Box height="100vh" overflow="hidden">
      <Flex justify="space-between" alignItems="center" margin="20px 30px">
        <Flex width="300px" justify="flex-start" alignItems="center">
          <Heading size="md" margin="0 10px 0 0">
            Add my Language
          </Heading>
          <Image width="40px" src={PlanetReadLogo} alt="Planet read logo" />
        </Flex>
        <Heading size="lg">{title}</Heading>
        <Flex width="300px" justify="flex-end">
          <Image width="40px" src={PlaceholderUserIcon} alt="User icon" />
        </Flex>
      </Flex>
      <Divider />
      <Flex justify="space-between">
        <Box minWidth="75vw" maxWidth="75vw">
          <Flex justify="space-between" alignItems="center" margin="10px 30px">
            <FontSizeSlider setFontSize={handleFontSizeChange} />
            <Flex direction="row">
              <IconButton
                size="undoRedo"
                variant="ghost"
                aria-label="Undo Change"
                onClick={undoChange}
                icon={<UndoIcon />}
              />
              <IconButton
                variant="ghost"
                size="undoRedo"
                aria-label="Redo Change"
                onClick={redoChange}
                icon={<RedoIcon />}
              />
            </Flex>
          </Flex>
          <Divider />
          <Box margin="0 0 0 20px">
            <Flex
              direction="column"
              overflowY="auto"
              height="calc(100vh - 250px)"
            >
              {maxCharsExceededWarning()}
              <TranslationTable
                translatedStoryLines={translatedStoryLines}
                onUserInput={onUserInput}
                editable
                fontSize={fontSize}
                originalLanguage="English"
                translatedLanguage={convertLanguageTitleCase(language)}
              />
            </Flex>
            <Autosave
              storylines={Array.from(changedStoryLines.values())}
              onSuccess={clearUnsavedChangesMap}
            />
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
              <Button colorScheme="blue" size="secondary" margin="0 10px 0">
                SEND FOR REVIEW
              </Button>
            </Flex>
          </Box>
        </Box>
        <Box backgroundColor="gray.100" padding="20px">
          {/* TODO: buttons are all placeholders */}
          <Button colorScheme="blue" size="secondary" margin="0 10px 0">
            Comment
          </Button>
          <Menu>
            <MenuButton as={Button} variant="outline" width="120px">
              All
            </MenuButton>
            <MenuList>
              <MenuItem>Option 1</MenuItem>
              <MenuItem>Option 2</MenuItem>
            </MenuList>
          </Menu>
          <Text>
            Looks like there aren’t any comments yet! Select the Comment button
            above to begin leaving comments.
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default TranslationPage;
