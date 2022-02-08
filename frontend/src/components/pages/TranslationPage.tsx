import React, { useContext, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Box, Button, Divider, Flex, Text, Tooltip } from "@chakra-ui/react";
import { useParams, Redirect, useHistory } from "react-router-dom";

import AuthContext from "../../contexts/AuthContext";
import ProgressBar from "../utils/ProgressBar";
import TranslationTable from "../translation/TranslationTable";
import UndoRedo from "../translation/UndoRedo";
import Autosave, { StoryLine } from "../translation/Autosave";
import { convertStatusTitleCase } from "../../utils/StatusUtils";
import { GET_STORY_AND_TRANSLATION_CONTENTS } from "../../APIClients/queries/StoryQueries";
import {
  SOFT_DELETE_STORY_TRANSLATION,
  SoftDeleteStoryTranslationResponse,
  UPDATE_STORY_TRANSLATION_STAGE,
  UpdateStoryTranslationStageResponse,
} from "../../APIClients/mutations/StoryMutations";
import FontSizeSlider from "../translation/FontSizeSlider";
import deepCopy from "../../utils/DeepCopyUtils";
import Header from "../navigation/Header";
import CommentsPanel from "../review/CommentsPanel";
import {
  CHANGES_NOT_YET_SAVED_ALERT,
  TRANSLATION_PAGE_TOOL_TIP_COPY,
  TRANSLATION_PAGE_BUTTON_MESSAGE,
  TRANSLATION_PAGE_SEND_FOR_REVIEW_CONFIRMATION,
  TRANSLATION_PAGE_REMOVE_FROM_TRANSLATION_BUTTON_MESSAGE,
  TRANSLATION_PAGE_REMOVE_FROM_TRANSLATION_CONFIRMATION,
} from "../../utils/Copy";
import ConfirmationModal from "../utils/ConfirmationModal";

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
  const { storyIdParam, storyTranslationIdParam } =
    useParams<TranslationPageProps>();
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
  const [isTest, setIsTest] = useState(false);
  const [translatorName, setTranslatorName] = useState<string>("");
  const [reviewerName, setReviewerName] = useState<string>("");

  const history = useHistory();

  // AutoSave
  const [changedStoryLines, setChangedStoryLines] = useState<
    Map<number, StoryLine>
  >(new Map());
  const [numTranslatedLines, setNumTranslatedLines] = useState(0);
  const [changesSaved, setChangesSaved] = useState<Boolean>(true);
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
  const [storyTranslationContentId, setStoryTranslationContentId] =
    useState<number>(-1);

  const handleFontSizeChange = (val: string) => {
    setFontSize(val);
  };

  const onChangeTranslationContent = (
    newContent: string,
    lineIndex: number,
  ) => {
    setChangesSaved(false);

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
        history.push("/");
      } else {
        // eslint-disable-next-line no-alert
        window.alert("Unable to send for review.");
      }
    } catch (error) {
      // eslint-disable-next-line no-alert
      window.alert(error ?? "Error occurred, please try again.");
    }
  };

  const [removeFromTranslation, setRemoveFromTranslation] = useState(false);
  const onRemoveFromTranslationClick = async () => {
    setRemoveFromTranslation(!removeFromTranslation);
  };

  const [deleteStoryTranslation] = useMutation<{
    response: SoftDeleteStoryTranslationResponse;
  }>(SOFT_DELETE_STORY_TRANSLATION);
  const onRemoveFromTranslationConfirmationClick = async () => {
    console.log(storyTranslationId);
    await deleteStoryTranslation({
      variables: {
        id: storyTranslationId,
      },
    });
    onRemoveFromTranslationClick();
    history.push("/");
  };

  const { loading } = useQuery(
    GET_STORY_AND_TRANSLATION_CONTENTS(storyId, storyTranslationId),
    {
      fetchPolicy: "cache-and-network",
      onCompleted: (data) => {
        setTranslatorId(data.storyTranslationById.translatorId);
        const storyContent = data.storyById.contents;
        const translatedContent = data.storyTranslationById.translationContents;
        setStage(data.storyTranslationById.stage);
        setLanguage(data.storyTranslationById.language);
        setTitle(data.storyById.title);
        setNumTranslatedLines(data.storyTranslationById.numTranslatedLines);
        setTranslatorName(data.storyTranslationById.translatorName);
        setReviewerName(data.storyTranslationById.reviewerName);
        setIsTest(data.storyTranslationById.isTest);

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
    },
  );

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

  if (loading || translatorId === -1) return <div />;
  if (+authenticatedUser!!.id !== translatorId) return <Redirect to="/404" />;

  return (
    <Flex height="100vh" width="100%" direction="column" position="absolute">
      <Header title={title} />
      <Divider />
      <Flex justify="space-between" flex={1} minHeight={0}>
        <Flex width="100%" direction="column">
          <Flex justify="space-between" alignItems="center" margin="10px 30px">
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
              translatedLanguage={language}
              commentLine={commentLine}
              setCommentLine={setCommentLine}
              setStoryTranslationContentId={setStoryTranslationContentId}
              translator
              setTranslatedStoryLines={setTranslatedStoryLines}
              changedStoryLines={changedStoryLines.size}
              isTest={isTest}
            />
          </Flex>
          <Flex margin="20px 30px" justify="space-between" alignItems="center">
            <ProgressBar
              percentageComplete={
                (numTranslatedLines / translatedStoryLines.length) * 100
              }
              type="Translation"
              fontSize={fontSize}
            />
            <Flex>
              <Text
                as="u"
                margin="5px 20px 0 0"
                onClick={onRemoveFromTranslationClick}
                variant="link"
              >
                Remove myself from translation
              </Text>
              <Tooltip
                hasArrow
                label={
                  !changesSaved
                    ? CHANGES_NOT_YET_SAVED_ALERT
                    : TRANSLATION_PAGE_TOOL_TIP_COPY
                }
                disabled={editable && changesSaved}
              >
                <Box>
                  <Button
                    colorScheme="blue"
                    size="secondary"
                    margin="0 10px 0"
                    disabled={!editable || !changesSaved}
                    onClick={onSendForReviewClick}
                  >
                    {editable ? "SEND FOR REVIEW" : "IN REVIEW"}
                  </Button>
                </Box>
              </Tooltip>
            </Flex>
          </Flex>
        </Flex>
        {!isTest && (
          <CommentsPanel
            storyTranslationContentId={storyTranslationContentId}
            commentLine={commentLine}
            storyTranslationId={storyTranslationId}
            translatorId={translatorId}
            translatorName={translatorName}
            reviewerName={reviewerName}
            setCommentLine={setCommentLine}
          />
        )}
      </Flex>
      <Autosave
        storylines={Array.from(changedStoryLines.values())}
        onSuccess={clearUnsavedChangesMap}
        setChangesSaved={setChangesSaved}
      />
      {sendForReview && (
        <ConfirmationModal
          confirmation={sendForReview}
          onClose={onSendForReviewClick}
          onConfirmationClick={onSendForReviewConfirmationClick}
          confirmationMessage={TRANSLATION_PAGE_SEND_FOR_REVIEW_CONFIRMATION}
          buttonMessage={TRANSLATION_PAGE_BUTTON_MESSAGE}
        />
      )}
      {removeFromTranslation && (
        <ConfirmationModal
          buttonMessage={
            TRANSLATION_PAGE_REMOVE_FROM_TRANSLATION_BUTTON_MESSAGE
          }
          confirmation={removeFromTranslation}
          confirmationMessage={
            TRANSLATION_PAGE_REMOVE_FROM_TRANSLATION_CONFIRMATION
          }
          onClose={onRemoveFromTranslationClick}
          onConfirmationClick={onRemoveFromTranslationConfirmationClick}
        />
      )}
    </Flex>
  );
};
export default TranslationPage;
