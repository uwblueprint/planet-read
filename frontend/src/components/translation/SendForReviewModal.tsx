import React from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";

type SendForReviewModalProps = {
  sendForReview: boolean;
  onClose: () => void;
  onSendForReviewConfirmationClick: () => void;
};

const SendForReviewModal = ({
  sendForReview,
  onClose,
  onSendForReviewConfirmationClick,
}: SendForReviewModalProps) => {
  return (
    <Modal
      isOpen={sendForReview}
      onClose={onClose}
      motionPreset="slideInBottom"
      size="xl"
    >
      <ModalOverlay />
      <ModalContent marginTop="30vh">
        <ModalHeader
          paddingTop="30px"
          paddingBottom="-10px"
          paddingLeft="35px"
          paddingRight="35px"
        >
          <Flex>
            <Heading as="h3" size="md">
              Are you sure?
            </Heading>
            <ModalCloseButton
              position="static"
              marginLeft="auto"
              borderRadius="15px"
              backgroundColor="gray.100"
            />
          </Flex>
        </ModalHeader>
        <ModalBody>
          <hr
            style={{
              marginLeft: "10px",
              marginRight: "10px",
              paddingBottom: "15px",
            }}
          />
          <Text fontSize="16px" paddingLeft="10px" paddingRight="10px">
            Once you send your translation for review, the action cannot be
            undone. Please make sure that there are no mistakes.
          </Text>
          <Flex paddingTop="20px" paddingBottom="25px" paddingLeft="10px">
            <Button
              width="55%"
              colorScheme="blue"
              onClick={onSendForReviewConfirmationClick}
            >
              I&apos;m sure, send for review
            </Button>
          </Flex>
        </ModalBody>
        <Box bg="blue.500" w="100%" p="5px" borderRadius="0 0 5px 5px" />
      </ModalContent>
    </Modal>
  );
};

export default SendForReviewModal;
