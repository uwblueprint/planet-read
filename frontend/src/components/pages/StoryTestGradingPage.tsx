import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
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
import { REVIEW_PAGE_TOOL_TIP_COPY } from "../../utils/Copy";

import AssignTestGradeModal from "../onboarding/AssignTestGradeModal";
import FailUserModal from "../onboarding/FailUserModal";

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

const GRADED_STATUSES = new Set(["Correct", "Incorrect", "Partially Correct"]);

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
  const [numGradedLines, setNumGradedLines] = useState(0);
  const [score, setScore] = useState(0);

  const [fontSize, setFontSize] = useState<string>("12px");
  const [title, setTitle] = useState<string>("");
  const [level, setLevel] = useState<number>(0);
  const [language, setLanguage] = useState<string>("");
  const [stage, setStage] = useState<string>("");

  const [failUser, setFailUser] = useState(false);
  const [assignGrade, setAssignGrade] = useState(false);

  const calculateScore = () => {
    const scoreReducer = (prev: number, cur: StoryLine) => {
      const { status } = cur;
      if (status === "Correct") {
        return prev + 1;
        // eslint-disable-next-line no-else-return
      } else if (status === "Partially Correct") {
        return prev + 0.5;
      }
      return prev;
    };
    const newScore = translatedStoryLines.reduce(scoreReducer, 0);
    setScore(newScore);
  };

  useEffect(() => {
    calculateScore();
  }, [translatedStoryLines]);

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

        let gradedLines = 0;
        translatedContent.forEach(
          ({ id, content, lineIndex, status }: Content) => {
            contentArray[lineIndex].translatedContent = content;
            contentArray[lineIndex].storyTranslationContentId = id;
            contentArray[lineIndex].status = convertStatusTitleCase(status);

            if (GRADED_STATUSES.has(contentArray[lineIndex].status!)) {
              gradedLines += 1;
            }
          },
        );
        setTranslatedStoryLines(contentArray);
        setNumGradedLines(gradedLines);
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
              numGradedLines={numGradedLines}
              setNumGradedLines={setNumGradedLines}
              isReviewable={stage === "REVIEW"}
              isTest
              reviewPage
            />
          </Flex>
          <Flex margin="20px 30px" justify="space-between" alignItems="center">
            <Flex justify="flex-start" alignItems="right">
              <ProgressBar
                percentageComplete={
                  (numGradedLines / translatedStoryLines.length) * 100
                }
                type="Review"
                fontSize={fontSize}
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
                    disabled={stage !== "REVIEW"}
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
                    disabled={stage !== "REVIEW"}
                    onClick={openAssignGradeModal}
                  >
                    Assign Level{" "}
                  </Button>
                </Box>
              </Tooltip>
            </Flex>
          </Flex>
        </Flex>
        <FailUserModal
          isOpen={failUser}
          onClose={closeFailUserModal}
          storyTranslationId={storyTranslationId}
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
