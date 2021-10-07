import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Box, Divider, Flex, Button, Tooltip } from "@chakra-ui/react";
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
import ConfirmationModal from "../translation/ConfirmationModal";
import {
  REVIEW_PAGE_RETURN_TO_TRANSLATOR_CONFIRMAITON,
  REVIEW_PAGE_RETURN_TO_TRANSLATOR_BUTTON_MESSAGE,
  REVIEW_PAGE_TOOL_TIP_COPY,
} from "../../utils/Copy";
import {
  UPDATE_STORY_TRANSLATION_STAGE,
  UpdateStoryTranslationStageResponse,
} from "../../APIClients/mutations/StoryMutations";

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
  const [stage, setStage] = useState<string>("");

  const [commentLine, setCommentLine] = useState(-1);

  const [returnToTranslator, setReturnToTranslator] = useState(false);

  const closeModal = async () => {
    setReturnToTranslator(false);
  };
  const openModal = async () => {
    setReturnToTranslator(true);
  };

  const [
    commentStoryTranslationContentId,
    setCommentStoryTranslationContentId,
  ] = useState<number>(-1);

  const handleFontSizeChange = (val: string) => {
    setFontSize(val);
  };

  const [updateStoryTranslationStage] = useMutation<{
    updateStoryTranslationStage: UpdateStoryTranslationStageResponse;
  }>(UPDATE_STORY_TRANSLATION_STAGE);
  const returnToTranslatorMutation = async () => {
    try {
      const storyTranslationData = {
        id: storyTranslationId,
        stage: "TRANSLATE",
      };
      const result = await updateStoryTranslationStage({
        variables: { storyTranslationData },
      });
      if (result.data?.updateStoryTranslationStage.ok) {
        window.location.reload();
      } else {
        window.alert("Unable to return to translator.");
      }
    } catch (error) {
      window.alert(error ?? "Error occurred, please try again.");
    }
  };

  useQuery(GET_STORY_AND_TRANSLATION_CONTENTS(storyId, storyTranslationId), {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      const storyContent = data.storyById.contents;
      const translatedContent = data.storyTranslationById.translationContents;
      setLanguage(data.storyTranslationById.language);
      setStage(data.storyTranslationById.stage);
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
              isReviewable={stage === "REVIEW"}
              reviewPage
            />
          </Flex>
          <Flex margin="20px 30px" justify="space-between" alignItems="center">
            <Flex justify="flex-start" alignItems="right">
              <ProgressBar
                percentageComplete={
                  (numTranslatedLines / translatedStoryLines.length) * 100
                }
                type="Translation"
              />
              <ProgressBar
                percentageComplete={
                  (numApprovedLines / translatedStoryLines.length) * 100
                }
                type="Review"
              />
            </Flex>
            <Tooltip
              hasArrow
              label={REVIEW_PAGE_TOOL_TIP_COPY}
              isDisabled={stage === "REVIEW"}
            >
              <Box>
                <Button
                  colorScheme="blue"
                  size="secondary"
                  margin="0 10px 0"
                  width="250px"
                  disabled={stage === "TRANSLATE"}
                  onClick={openModal}
                >
                  RETURN TO TRANSLATOR
                </Button>
              </Box>
            </Tooltip>
          </Flex>
        </Flex>
        <CommentsPanel
          disabled={stage === "TRANSLATE"}
          commentStoryTranslationContentId={commentStoryTranslationContentId}
          commentLine={commentLine}
          storyTranslationId={storyTranslationId}
          setCommentLine={setCommentLine}
          setTranslatedStoryLines={setTranslatedStoryLines}
          translatedStoryLines={translatedStoryLines}
          reviewPage
        />
        {returnToTranslator && (
          <ConfirmationModal
            confirmation={returnToTranslator}
            onConfirmationClick={returnToTranslatorMutation}
            onClose={closeModal}
            confirmationMessage={REVIEW_PAGE_RETURN_TO_TRANSLATOR_CONFIRMAITON}
            buttonMessage={REVIEW_PAGE_RETURN_TO_TRANSLATOR_BUTTON_MESSAGE}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default ReviewPage;
