// TODO: remove when functional
/* eslint-disable */
import React, { useContext, useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Box, Text, Divider, Flex, Button, Tooltip } from "@chakra-ui/react";
import { useParams, Redirect, useHistory } from "react-router-dom";

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
  REVIEW_PAGE_TOOL_TIP_COPY,
  GRADING_PAGE_FAIL_USER_CONFIRMATION,
  GRADING_PAGE_FAIL_USER_BUTTON,
} from "../../utils/Copy";
import {
  FINISH_GRADING_STORY_TRANSLATION,
  FinishGradingStoryTranslationResponse,
  UPDATE_STORY_TRANSLATION_STAGE,
  UpdateStoryTranslationStageResponse,
} from "../../APIClients/mutations/StoryMutations";
import AssignTestGradeModal from "../onboarding/AssignTestGradeModal";

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
  const [score, setScore] = useState(0);

  const [fontSize, setFontSize] = useState<string>("12px");
  const [title, setTitle] = useState<string>("");
  const [level, setLevel] = useState<number>(0);
  const [language, setLanguage] = useState<string>("");
  const [stage, setStage] = useState<string>("");
  const [testFeedback] = useState<string>("");

  const [failUser, setFailUser] = useState(false);
  const [assignGrade, setAssignGrade] = useState(false);

  useEffect(() => {
    calculateScore();
  }, [translatedStoryLines]);

  const calculateScore = () => {
    const scoreReducer = (prev: number, cur: StoryLine) => {
      const status = cur.status;
      if (status === "Correct") {
        return prev + 1;
      } else if (status === "Partially Correct") {
        return prev + 0.5;
      }
      return prev;
    };
    const newScore = translatedStoryLines.reduce(scoreReducer, 0);
    setScore(newScore);
  };

  const closeFailUserModal = () => {
    setFailUser(false);
  };
  const openFailUserModal = () => {
    setFailUser(true);
  };

  const closeAssignGradeModal = () => {
    setAssignGrade(false);
  };
  const openAssignGradeModal = () => {
    setAssignGrade(true);
  };

  const handleFontSizeChange = (val: string) => {
    setFontSize(val);
  };

  const history = useHistory();

  const [updateStoryTranslationStage] = useMutation<{
    updateStoryTranslationStage: UpdateStoryTranslationStageResponse;
  }>(UPDATE_STORY_TRANSLATION_STAGE);

  const [finishGradingStoryTranslation] = useMutation<{
    finishGradingStoryTranslation: FinishGradingStoryTranslationResponse;
  }>(FINISH_GRADING_STORY_TRANSLATION);

  const failGrade = async (testFeedback: string | null) => {
    const result = await finishGradingStoryTranslation({
      variables: {
        storyTranslationTestId: storyTranslationId,
        testFeedback,
        testResult: "{}",
      },
    });
    if (result.data?.finishGradingStoryTranslation.ok) {
      history.push("/");
    } else {
      window.alert("Could not mark story translation as failed.");
    }
  };

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
          window.alert(`Unable to update story test stage to ${stage}.`);
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
        if (!data.storyTranslationById.isTest) {
          history.push("/404");
        }

        const storyContent = data.storyById.contents;
        const translatedContent = data.storyTranslationById.translationContents;
        setLevel(data.storyTranslationById.level);
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
            <Text fontWeight="bold" marginRight="42px" color="blue.100">
              {`SCORE: ${score}/${translatedStoryLines.length}`}
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

            <Flex marginBottom="10px">
              <Tooltip
                hasArrow
                label={REVIEW_PAGE_TOOL_TIP_COPY}
                isDisabled={stage === "REVIEW"}
              >
                <Box>
                  <Button
                    colorScheme="red"
                    variant="outline"
                    disabled={stage === "TRANSLATE"}
                    onClick={openFailUserModal}
                  >
                    Fail User
                  </Button>
                </Box>
              </Tooltip>
              <Tooltip
                hasArrow
                label={REVIEW_PAGE_TOOL_TIP_COPY}
                isDisabled={stage === "REVIEW"}
              >
                <Box marginLeft="24px" marginRight="20px">
                  <Button
                    colorScheme="blue"
                    disabled={stage === "TRANSLATE"}
                    onClick={openAssignGradeModal}
                  >
                    Assign Level{" "}
                  </Button>
                </Box>
              </Tooltip>
            </Flex>
          </Flex>
        </Flex>
        <ConfirmationModal
          confirmation={failUser}
          onConfirmationClick={() => failGrade(testFeedback)}
          onClose={closeFailUserModal}
          confirmationMessage={GRADING_PAGE_FAIL_USER_CONFIRMATION}
          buttonMessage={GRADING_PAGE_FAIL_USER_BUTTON}
        />
        <AssignTestGradeModal
          isOpen={assignGrade}
          onClose={closeAssignGradeModal}
          testLevel={level}
          language={convertLanguageTitleCase(language)}
          score={score}
          storyLength={translatedStoryLines.length}
          storyTranslationId={storyTranslationId}
        />
      </Flex>
    </Flex>
  );
};

export default StoryTestGradingPage;
