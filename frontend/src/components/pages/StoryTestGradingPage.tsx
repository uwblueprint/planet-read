// TODO: remove when functional
/* eslint-disable */
import React, { useContext, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Box, Text, Divider, Flex, Button } from "@chakra-ui/react";
import { useParams, Redirect } from "react-router-dom";

import AuthContext from "../../contexts/AuthContext";
import ProgressBar from "../utils/ProgressBar";
import TranslationTable from "../translation/TranslationTable";
import { StoryLine } from "../translation/Autosave";
import { convertStatusTitleCase } from "../../utils/StatusUtils";
import { GET_STORY_AND_TRANSLATION_CONTENTS } from "../../APIClients/queries/StoryQueries";
import FontSizeSlider from "../translation/FontSizeSlider";
import { convertLanguageTitleCase } from "../../utils/LanguageUtils";
import Header from "../navigation/Header";
import ConfirmationModal from "../utils/ConfirmationModal";
import {
  REVIEW_PAGE_SUBMIT_TRANSLATION_CONFIRMATION,
  REVIEW_PAGE_SUBMIT_TRANSLATION_BUTTON_MESSAGE,
} from "../../utils/Copy";
import {
  UPDATE_STORY_TRANSLATION_STAGE,
  UpdateStoryTranslationStageResponse,
} from "../../APIClients/mutations/StoryMutations";

type StoryTestGradingPageProps = {
  storyIdParam: string | undefined;
  storyTranslationIdParam: string | undefined;
};

type Content = {
  id: number;
  lineIndex: number;
  content: string;
  status: string;
};

const StoryTestGradingPage = () => {
  const { authenticatedUser } = useContext(AuthContext);
  const { storyIdParam, storyTranslationIdParam } =
    useParams<StoryTestGradingPageProps>();

  const storyId = +storyIdParam!!;
  const storyTranslationId = +storyTranslationIdParam!!;
  const [translatedStoryLines, setTranslatedStoryLines] = useState<StoryLine[]>(
    [],
  );
  const [numApprovedLines, setNumApprovedLines] = useState(0);

  const [fontSize, setFontSize] = useState<string>("12px");
  const [title, setTitle] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [stage, setStage] = useState<string>("");

  const [submitTranslation, setSubmitTranslation] = useState(false);

  const closeSubmitTranslationModal = () => {
    setSubmitTranslation(false);
  };
  const openSubmitTranslationModal = () => {
    setSubmitTranslation(true);
  };

  const handleFontSizeChange = (val: string) => {
    setFontSize(val);
  };

  const [updateStoryTranslationStage] = useMutation<{
    updateStoryTranslationStage: UpdateStoryTranslationStageResponse;
  }>(UPDATE_STORY_TRANSLATION_STAGE);

  const createUpdateStoryTranslationStageMutation = (newStage: string) => {
    const updateStoryTranslationStageMutation = async () => {
      try {
        const storyTranslationData = {
          id: storyTranslationId,
          stage: newStage,
        };
        const result = await updateStoryTranslationStage({
          variables: { storyTranslationData },
        });
        if (result.data?.updateStoryTranslationStage.ok) {
          window.location.reload();
        } else {
          window.alert(`Unable to update story stage to ${stage}.`);
        }
      } catch (error) {
        window.alert(error ?? "Error occurred, please try again.");
      }
    };
    return updateStoryTranslationStageMutation;
  };

  const { loading } = useQuery(
    GET_STORY_AND_TRANSLATION_CONTENTS(storyId, storyTranslationId),
    {
      fetchPolicy: "cache-and-network",
      onCompleted: (data) => {
        const storyContent = data.storyById.contents;
        const translatedContent = data.storyTranslationById.translationContents;
        setLanguage(data.storyTranslationById.language);
        setStage(data.storyTranslationById.stage);
        setTitle(data.storyById.title);
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
    },
  );

  if (loading) return <div />;
  if (authenticatedUser!!.role !== "Admin") return <Redirect to="/404" />;
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
            {/* TODO: use actual score */}
            <Text fontWeight="bold" marginRight="24px" color="blue.100">
              SCORE: 0/6
            </Text>
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
              translator={false}
              setTranslatedStoryLines={setTranslatedStoryLines}
              numApprovedLines={numApprovedLines}
              setNumApprovedLines={setNumApprovedLines}
              isReviewable={stage === "REVIEW"}
              isTest
              reviewPage
            />
          </Flex>
          <Flex margin="20px 30px" justify="space-between" alignItems="center">
            <Flex justify="flex-start" alignItems="right">
              <ProgressBar
                percentageComplete={
                  (numApprovedLines / translatedStoryLines.length) * 100
                }
                type="Review"
              />
            </Flex>

            <Box marginBottom="10px">
              <Button colorScheme="red" variant="outline" onClick={() => {}}>
                Fail User
              </Button>
              <Button
                colorScheme="blue"
                marginLeft="24px"
                marginRight="20px"
                onClick={() => {}}
              >
                Assign Level
              </Button>
            </Box>
          </Flex>
        </Flex>
        {/* TODO: replace this modal with assign level modal */}
        {submitTranslation && (
          <ConfirmationModal
            confirmation={submitTranslation}
            onConfirmationClick={createUpdateStoryTranslationStageMutation(
              "PUBLISH",
            )}
            onClose={closeSubmitTranslationModal}
            confirmationMessage={REVIEW_PAGE_SUBMIT_TRANSLATION_CONFIRMATION}
            buttonMessage={REVIEW_PAGE_SUBMIT_TRANSLATION_BUTTON_MESSAGE}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default StoryTestGradingPage;
