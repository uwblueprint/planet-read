import React from "react";
import {
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
} from "@chakra-ui/react";

export type TestFeedbackModalProps = {
  isOpen: boolean;
  isCentered: boolean;
  testFeedback: string;
  setTestFeedback: (newFeedback: string) => void;
  onBack?: () => void;
  onConfirm: () => void;
  confirmString?: string;
};

const TestFeedbackModal = ({
  isOpen,
  isCentered,
  testFeedback,
  setTestFeedback,
  onBack,
  onConfirm,
  confirmString = "Confirm",
}: TestFeedbackModalProps) => {
  return (
    <Modal
      isCentered={isCentered}
      isOpen={isOpen}
      motionPreset="slideInBottom"
      onClose={() => {}}
      size="4xl"
    >
      <ModalOverlay />
      <ModalContent paddingLeft="32px">
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
            {onBack && (
              <Button
                colorScheme="blue"
                fontSize="14px"
                marginRight="20px"
                onClick={onBack}
                variant="blueOutline"
                width="120px"
              >
                Back
              </Button>
            )}
            <Button
              colorScheme="blue"
              fontSize="14px"
              onClick={onConfirm}
              width="120px"
            >
              {confirmString}
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TestFeedbackModal;
