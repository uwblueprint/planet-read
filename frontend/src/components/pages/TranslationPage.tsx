import React, { useContext, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Box, Button, Divider, Flex, Text, Tooltip } from "@chakra-ui/react";
import { useParams, Redirect } from "react-router-dom";

import AuthContext from "../../contexts/AuthContext";
import ProgressBar from "../utils/ProgressBar";
import TranslationTable from "../translation/TranslationTable";
import UndoRedo from "../translation/UndoRedo";
import Autosave, { StoryLine } from "../translation/Autosave";
import { convertStatusTitleCase } from "../../utils/StatusUtils";
import { GET_STORY_AND_TRANSLATION_CONTENTS } from "../../APIClients/queries/StoryQueries";
import {
  UPDATE_STORY_TRANSLATION_STAGE,
  UpdateStoryTranslationStageResponse,
} from "../../APIClients/mutations/StoryMutations";
import FontSizeSlider from "../translation/FontSizeSlider";
import convertLanguageTitleCase from "../../utils/LanguageUtils";
import deepCopy from "../../utils/DeepCopyUtils";
import Header from "../navigation/Header";
import CommentsPanel from "../review/CommentsPanel";
import {
  TRANSLATION_PAGE_TOOL_TIP_COPY,
  TRANSLATION_PAGE_BUTTON_MESSAGE,
  TRANSLATION_PAGE_SEND_FOR_REVIEW_CONFIRMATION,
} from "../../utils/Copy";
import ConfirmationModal from "../translation/ConfirmationModal";

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

const TranslationPage = () => {
  const { authenticatedUser } = useContext(AuthContext);
  const MAX_STACK_SIZE = 100;
  const {
    storyIdParam,
    storyTranslationIdParam,
  } = useParams<TranslationPageProps>();
  // Story Data
  const storyId = +storyIdParam!!;
  const storyTranslationId = +storyTranslationIdParam!!;
  const [translatedStoryLines, setTranslatedStoryLines] = useState<StoryLine[]>(
    [],
  );
  const [translatorId, setTranslatorId] = useState(-1);
  const [title, setTitle] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [stage, setStage] = useState<string>("");

  const [isLoading, setIsLoading] = useState(true);

  // AutoSave
  const [changedStoryLines, setChangedStoryLines] = useState<
    Map<number, StoryLine>
  >(new Map());
  const [numTranslatedLines, setNumTranslatedLines] = useState(0);
  // UndoRedo
  const [versionHistoryStack, setVersionHistoryStack] = useState<
    Array<StoryLine[]>
  >([]);
  const [snapShotLineIndexes, snapSnapShotLineIndexes] = useState<Set<number>>(
    new Set(),
  );
  const [versionSnapShotStack, setVersionSnapShotStack] = useState<
    Array<number[]>
  >([]);
  const [currentVersion, setCurrentVersion] = useState<number>(0);
  // Font Size Slider
  const [fontSize, setFontSize] = useState<string>("12px");

  const editable = stage === "TRANSLATE";
  const [commentLine, setCommentLine] = useState(-1);
  const [
    commentStoryTranslationContentId,
    setCommentStoryTranslationContentId,
  ] = useState<number>(-1);

  const handleFontSizeChange = (val: string) => {
    setFontSize(val);
  };

  const onChangeTranslationContent = (
    newContent: string,
    lineIndex: number,
  ) => {
    const updatedContentArray = [...translatedStoryLines];
    snapSnapShotLineIndexes((val: Set<number>) => new Set(val.add(lineIndex)));
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
    if (maxChars >= newContent.length) {
      onChangeTranslationContent(newContent, lineIndex);
      setVersionHistoryStack([
        ...deepCopy(versionHistoryStack.slice(0, currentVersion + 1)),
      ]);
      setVersionSnapShotStack([
        ...deepCopy(versionSnapShotStack.slice(0, currentVersion + 1)),
      ]);
      setCurrentVersion(
        versionHistoryStack.length === MAX_STACK_SIZE
          ? MAX_STACK_SIZE - 1
          : versionHistoryStack.length,
      );
    }
  };

  const clearUnsavedChangesMap = () => {
    setChangedStoryLines(new Map());
  };

  const [sendForReview, setSendForReview] = useState(false);
  const onSendForReviewClick = async () => {
    setSendForReview(!sendForReview);
  };

  const [updateStoryTranslationStage] = useMutation<{
    updateStoryTranslationStage: UpdateStoryTranslationStageResponse;
  }>(UPDATE_STORY_TRANSLATION_STAGE);
  const onSendForReviewConfirmationClick = async () => {
    try {
      const storyTranslationData = {
        id: storyTranslationId,
        stage: "REVIEW",
      };
      const result = await updateStoryTranslationStage({
        variables: { storyTranslationData },
      });
      if (result.data?.updateStoryTranslationStage.ok) {
        window.location.reload(false);
      } else {
        window.alert("Unable to send for review.");
      }
    } catch (error) {
      window.alert(error ?? "Error occurred, please try again.");
    }
  };

  useQuery(GET_STORY_AND_TRANSLATION_CONTENTS(storyId, storyTranslationId), {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setTranslatorId(data.storyTranslationById.translatorId);
      setIsLoading(false);
      const storyContent = data.storyById.contents;
      const translatedContent = data.storyTranslationById.translationContents;
      setStage(data.storyTranslationById.stage);
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
      setVersionHistoryStack([deepCopy(contentArray)]);
      setVersionSnapShotStack([]);
      setCurrentVersion(0);
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

  const TranslationPageContent = () => (
    <>
      {+authenticatedUser!!.id !== translatorId ? (
        <Redirect to="/404" />
      ) : (
        <Flex height="100vh" direction="column" position="absolute">
          <Header title={title} />
          <Divider />
          <Flex justify="space-between" flex={1} minHeight={0}>
            <Flex width="100%" direction="column">
              <Flex
                justify="space-between"
                alignItems="center"
                margin="10px 30px"
              >
                <FontSizeSlider setFontSize={handleFontSizeChange} />
                <UndoRedo
                  currentVersion={currentVersion}
                  setCurrentVersion={setCurrentVersion}
                  versionHistoryStack={versionHistoryStack}
                  setVersionHistoryStack={setVersionHistoryStack}
                  versionSnapShotStack={versionSnapShotStack}
                  setVersionSnapShotStack={setVersionSnapShotStack}
                  snapShotLineIndexes={snapShotLineIndexes}
                  snapSnapShotLineIndexes={snapSnapShotLineIndexes}
                  translatedStoryLines={translatedStoryLines}
                  onChangeTranslationContent={onChangeTranslationContent}
                  MAX_STACK_SIZE={MAX_STACK_SIZE}
                />
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
                  storyTranslationId={storyTranslationId}
                  translatedStoryLines={translatedStoryLines}
                  onUserInput={onUserInput}
                  editable={editable}
                  fontSize={fontSize}
                  originalLanguage="English"
                  translatedLanguage={convertLanguageTitleCase(language)}
                  commentLine={commentLine}
                  setCommentLine={setCommentLine}
                  setCommentStoryTranslationContentId={
                    setCommentStoryTranslationContentId
                  }
                  translator
                  setTranslatedStoryLines={setTranslatedStoryLines}
                  changedStoryLines={changedStoryLines.size}
                />
              </Flex>
              <Flex
                margin="20px 30px"
                justify="space-between"
                alignItems="center"
              >
                <ProgressBar
                  percentageComplete={
                    (numTranslatedLines / translatedStoryLines.length) * 100
                  }
                  type="Translation"
                />
                <Tooltip
                  hasArrow
                  label={TRANSLATION_PAGE_TOOL_TIP_COPY}
                  isDisabled={editable}
                >
                  <Box>
                    <Button
                      colorScheme="blue"
                      size="secondary"
                      margin="0 10px 0"
                      disabled={!editable}
                      onClick={onSendForReviewClick}
                    >
                      {editable ? "SEND FOR REVIEW" : "IN REVIEW"}
                    </Button>
                  </Box>
                </Tooltip>
              </Flex>
            </Flex>
            <CommentsPanel
              disabled={!editable}
              commentStoryTranslationContentId={
                commentStoryTranslationContentId
              }
              commentLine={commentLine}
              storyTranslationId={storyTranslationId}
              setCommentLine={setCommentLine}
              setTranslatedStoryLines={setTranslatedStoryLines}
              translatedStoryLines={translatedStoryLines}
            />
          </Flex>
          <Autosave
            storylines={Array.from(changedStoryLines.values())}
            onSuccess={clearUnsavedChangesMap}
          />
          {sendForReview && (
            <ConfirmationModal
              confirmation={sendForReview}
              onClose={onSendForReviewClick}
              onConfirmationClick={onSendForReviewConfirmationClick}
              confirmationMessage={
                TRANSLATION_PAGE_SEND_FOR_REVIEW_CONFIRMATION
              }
              buttonMessage={TRANSLATION_PAGE_BUTTON_MESSAGE}
            />
          )}
        </Flex>
      )}
    </>
  );

  return <>{isLoading ? <div /> : <TranslationPageContent />}</>;
};

export default TranslationPage;
