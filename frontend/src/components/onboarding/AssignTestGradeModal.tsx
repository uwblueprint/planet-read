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
  Textarea,
} from "@chakra-ui/react";

import {
  FINISH_GRADING_STORY_TRANSLATION,
  FinishGradingStoryTranslationResponse,
} from "../../APIClients/mutations/StoryMutations";
import { levelOptions } from "../../constants/Levels";
import { colourStyles } from "../../theme/components/Select";
import {
  ASSIGN_USER_LEVEL_CONFIRMATION,
  ASSIGN_USER_LEVEL_BUTTON,
} from "../../utils/Copy";
import ConfirmationModal from "../utils/ConfirmationModal";
import DropdownIndicator from "../utils/DropdownIndicator";
import Block from "./Block";

export type AssignTestGradeModalProps = {
  isOpen: boolean;
  language: string;
  onClose: () => void;
  score: number;
  storyLength: number;
  storyTranslationId: number;
  testLevel: number;
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
}: AssignTestGradeModalProps) => {
  const [assignReviewerLevel, setAssignReviewerLevel] =
    useState<boolean>(false);
  const [enterFeedback, setEnterFeedback] = useState<boolean>(false);
  const [reviewerLevel, setReviewerLevel] = useState<number | null>(null);
  const [sendAssignGrade, setSendAssignGrade] = useState<boolean>(false);
  const [testFeedback, setTestFeedback] = useState<string>("");
  const [translatorLevel, setTranslatorLevel] = useState<number | null>(null);

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
      history.push("/");
    } else {
      window.alert("Could not assign level to user.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      motionPreset="slideInBottom"
      onClose={onClose}
      size="4xl"
    >
      <ModalOverlay />
      {!enterFeedback && (
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
              <GridItem
                colSpan={1}
                marginBottom="36px"
                paddingRight="32px"
                rowStart={2}
              >
                <Heading size="sm">Assign Level</Heading>
                <Box width="80%">
                  <Select
                    placeholder="Assign level"
                    options={levelOptions}
                    onChange={(option: any) =>
                      setTranslatorLevel(parseInt(option.value, 10))
                    }
                    getOptionLabel={(option: any) => option.value}
                    value={
                      translatorLevel ? { value: `${translatorLevel}` } : null
                    }
                    styles={colourStyles}
                    components={{ DropdownIndicator }}
                  />
                </Box>
              </GridItem>
              <GridItem
                colSpan={3}
                marginBottom="24px"
                paddingRight="32px"
                rowStart={3}
              >
                <Heading size="sm">Assign as Reviewer</Heading>
                <Checkbox
                  isChecked={assignReviewerLevel}
                  size="md"
                  width="100%"
                  onChange={() => setAssignReviewerLevel(!assignReviewerLevel)}
                >
                  <Text>
                    I would like to grant the <strong>Reviewer</strong> role to
                    this user.
                  </Text>
                </Checkbox>
              </GridItem>
              {assignReviewerLevel && (
                <GridItem
                  colSpan={1}
                  marginBottom="36px"
                  paddingRight="32px"
                  rowStart={4}
                >
                  <Box width="80%">
                    <Select
                      placeholder="Assign level"
                      options={levelOptions}
                      onChange={(option: any) =>
                        setReviewerLevel(parseInt(option.value, 10))
                      }
                      getOptionLabel={(option: any) => option.value}
                      value={
                        reviewerLevel ? { value: `${reviewerLevel}` } : null
                      }
                      styles={colourStyles}
                      components={{ DropdownIndicator }}
                    />
                  </Box>
                </GridItem>
              )}
            </Grid>
            <Flex marginRight="28px" justifyContent="flex-end">
              <Button
                fontSize="14px"
                colorScheme="blue"
                isDisabled={
                  !translatorLevel || (assignReviewerLevel && !reviewerLevel)
                }
                onClick={() => setEnterFeedback(true)}
                width="120px"
              >
                Next
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      )}
      {enterFeedback && (
        <ModalContent paddingLeft="32px">
          <ModalCloseButton
            marginLeft="auto"
            marginRight="8px"
            marginTop="8px"
            position="static"
          />
          <ModalHeader paddingTop="20px">
            <Heading as="h3" size="lg">
              Feedback to User
            </Heading>
          </ModalHeader>
          <ModalBody paddingBottom="36px">
            <Grid width="100%" marginBottom="24px">
              <GridItem marginBottom="24px" paddingRight="32px" rowStart={1}>
                <Text>
                  Provide any feedback or comments to the user in the box below
                  (Optional)
                </Text>
                <Textarea
                  height="285px"
                  margin="8px 0"
                  onChange={(e) => setTestFeedback(e.target.value)}
                  placeholder="Enter your feedback here..."
                  value={testFeedback}
                />
              </GridItem>
            </Grid>
            <Flex marginRight="28px" justifyContent="flex-end">
              <Button
                colorScheme="blue"
                fontSize="14px"
                marginRight="20px"
                onClick={() => setEnterFeedback(false)}
                variant="blueOutline"
                width="120px"
              >
                Back
              </Button>
              <Button
                colorScheme="blue"
                fontSize="14px"
                onClick={() => setSendAssignGrade(true)}
                width="120px"
              >
                Continue
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      )}
      <ConfirmationModal
        buttonMessage={ASSIGN_USER_LEVEL_BUTTON}
        confirmation={sendAssignGrade}
        confirmationMessage={ASSIGN_USER_LEVEL_CONFIRMATION}
        onClose={() => setSendAssignGrade(false)}
        onConfirmationClick={assignTestLevel}
      />
    </Modal>
  );
};

export default AssignTestGradeModal;
