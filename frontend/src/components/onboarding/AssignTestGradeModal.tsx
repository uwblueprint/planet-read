import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import Select from "react-select";
import { useHistory } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
} from "@chakra-ui/react";

import InfoAlert from "../utils/InfoAlert";
import {
  FINISH_GRADING_STORY_TRANSLATION,
  FinishGradingStoryTranslationResponse,
} from "../../APIClients/mutations/StoryMutations";
import { levelOptions } from "../../constants/Levels";
import { colourStyles } from "../../theme/components/Select";
import {
  ASSIGN_USER_LEVEL_CONFIRMATION,
  ASSIGN_USER_LEVEL_BUTTON,
  VIEW_FAILED_GRADE_ALERT,
  GRADED_TEST_ASSIGN_LEVEL_TOOL_TIP_COPY,
} from "../../utils/Copy";
import ConfirmationModal from "../utils/ConfirmationModal";
import DropdownIndicator from "../utils/DropdownIndicator";
import Block from "./Block";
import TestFeedbackModal from "./TestFeedbackModal";

export type AssignTestGradeModalProps = {
  isOpen: boolean;
  language: string;
  onClose: () => void;
  score: number;
  storyLength: number;
  storyTranslationId: number;
  testLevel: number;
  isDisabled?: boolean;
  defaultTranslatorLevel?: number | null;
  defaultReviewerLevel?: number | null;
  defaultTestFeedback?: string;
};

export type TestResult = {
  translate: number | null;
  review?: number | null;
};

const AssignTestGradeModal = ({
  isOpen,
  language,
  onClose,
  score,
  storyLength,
  storyTranslationId,
  testLevel,
  isDisabled = false,
  defaultTranslatorLevel = null,
  defaultReviewerLevel = null,
  defaultTestFeedback = "",
}: AssignTestGradeModalProps) => {
  const [assignReviewerLevel, setAssignReviewerLevel] =
    useState<boolean>(false);
  const [translatorLevel, setTranslatorLevel] = useState<number | null>(null);
  const [reviewerLevel, setReviewerLevel] = useState<number | null>(null);
  const [enterFeedback, setEnterFeedback] = useState<boolean>(false);
  const [testFeedback, setTestFeedback] = useState<string>("");
  const [sendAssignGrade, setSendAssignGrade] = useState<boolean>(false);

  const [finishGradingStoryTranslation] = useMutation<{
    finishGradingStoryTranslation: FinishGradingStoryTranslationResponse;
  }>(FINISH_GRADING_STORY_TRANSLATION);

  const history = useHistory();

  const assignTestLevel = async () => {
    const testResult: TestResult = {
      translate: translatorLevel,
    };
    if (assignReviewerLevel) testResult.review = reviewerLevel;
    const result = await finishGradingStoryTranslation({
      variables: {
        storyTranslationTestId: storyTranslationId,
        testFeedback,
        testResult: JSON.stringify(testResult),
      },
    });
    if (result.data?.finishGradingStoryTranslation.ok) {
      history.push("/?tab=4");
    } else {
      // eslint-disable-next-line no-alert
      window.alert("Could not assign level to user.");
    }
  };

  const displayTranslatorLevel = isDisabled
    ? defaultTranslatorLevel
    : translatorLevel;
  const displayReviewerLevel = isDisabled
    ? defaultReviewerLevel
    : reviewerLevel;

  const interactiveComponent =
    isDisabled && !defaultTranslatorLevel ? (
      <GridItem colSpan={3} marginBottom="24px" paddingRight="32px">
        <InfoAlert colour="orange.50" message={VIEW_FAILED_GRADE_ALERT} />
      </GridItem>
    ) : (
      <>
        <GridItem
          colSpan={1}
          marginBottom="36px"
          paddingRight="32px"
          rowStart={2}
        >
          <Heading size="sm">Assign Level</Heading>
          <Tooltip
            hasArrow
            label={GRADED_TEST_ASSIGN_LEVEL_TOOL_TIP_COPY}
            isDisabled={!isDisabled}
          >
            <Box width="80%">
              <Select
                isDisabled={isDisabled}
                placeholder="Assign level"
                options={levelOptions}
                onChange={(option: any) =>
                  setTranslatorLevel(parseInt(option.value, 10))
                }
                getOptionLabel={(option: any) => option.value}
                value={
                  displayTranslatorLevel
                    ? { value: `${displayTranslatorLevel}` }
                    : null
                }
                styles={colourStyles}
                components={{ DropdownIndicator }}
              />
            </Box>
          </Tooltip>
        </GridItem>

        <GridItem
          colSpan={3}
          marginBottom="24px"
          paddingRight="32px"
          rowStart={3}
        >
          <Heading size="sm">Assign as Reviewer</Heading>
          <Checkbox
            isChecked={assignReviewerLevel || defaultReviewerLevel !== null}
            isDisabled={isDisabled}
            size="md"
            width="100%"
            onChange={() => setAssignReviewerLevel(!assignReviewerLevel)}
          >
            <Tooltip
              hasArrow
              label={GRADED_TEST_ASSIGN_LEVEL_TOOL_TIP_COPY}
              isDisabled={!isDisabled}
            >
              <Text>
                I would like to grant the <strong>Reviewer</strong> role to this
                user.
              </Text>
            </Tooltip>
          </Checkbox>
        </GridItem>
        {(assignReviewerLevel || defaultReviewerLevel !== null) && (
          <GridItem
            colSpan={1}
            marginBottom="36px"
            paddingRight="32px"
            rowStart={4}
          >
            <Box width="80%">
              <Select
                isDisabled={isDisabled}
                placeholder="Assign level"
                options={levelOptions}
                onChange={(option: any) =>
                  setReviewerLevel(parseInt(option.value, 10))
                }
                getOptionLabel={(option: any) => option.value}
                value={
                  displayReviewerLevel
                    ? { value: `${displayReviewerLevel}` }
                    : null
                }
                styles={colourStyles}
                components={{ DropdownIndicator }}
              />
            </Box>
          </GridItem>
        )}
      </>
    );
  return (
    <>
      <Modal
        isOpen={isOpen && !enterFeedback}
        motionPreset="slideInBottom"
        onClose={onClose}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent paddingLeft="32px">
          <ModalCloseButton
            marginLeft="auto"
            marginRight="8px"
            marginTop="8px"
            position="static"
          />
          <ModalHeader paddingTop="20px">
            <Heading as="h3" size="lg">
              Assign Level to User
            </Heading>
          </ModalHeader>
          <ModalBody paddingBottom="36px">
            <Heading as="h4" paddingBottom="24px" size="md">
              Basic Test Information
            </Heading>

            <Grid
              marginBottom="24px"
              templateColumns="repeat(3, 1fr)"
              width="100%"
            >
              <GridItem
                colSpan={3}
                marginBottom="36px"
                paddingRight="32px"
                rowStart={1}
              >
                <Flex width="100%">
                  <Block header="Test Level" text={`Level ${testLevel}`} />
                  <Block header="Language" text={language} />
                  <Block header="Score" text={`${score}/${storyLength}`} />
                </Flex>
              </GridItem>
              {interactiveComponent}
            </Grid>
            <Flex marginRight="28px" justifyContent="flex-end">
              <Button
                fontSize="14px"
                colorScheme="blue"
                isDisabled={
                  !isDisabled &&
                  (!translatorLevel || (assignReviewerLevel && !reviewerLevel))
                }
                onClick={() => setEnterFeedback(true)}
                width="120px"
              >
                Next
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
      <TestFeedbackModal
        isOpen={isOpen && enterFeedback}
        isCentered={false}
        isDisabled={isDisabled}
        testFeedback={isDisabled ? defaultTestFeedback : testFeedback}
        setTestFeedback={setTestFeedback}
        onBack={() => setEnterFeedback(false)}
        onConfirm={() => setSendAssignGrade(true)}
        confirmString="Continue"
      />
      <ConfirmationModal
        buttonMessage={ASSIGN_USER_LEVEL_BUTTON}
        confirmation={sendAssignGrade}
        confirmationMessage={ASSIGN_USER_LEVEL_CONFIRMATION}
        onClose={() => setSendAssignGrade(false)}
        onConfirmationClick={assignTestLevel}
      />
    </>
  );
};

export default AssignTestGradeModal;
