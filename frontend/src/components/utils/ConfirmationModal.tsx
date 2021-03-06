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

export type ConfirmationModalProps = {
  confirmation: boolean;
  onClose: () => void;
  onConfirmationClick: () => void;
  confirmationHeading?: string;
  confirmationMessage: string;
  buttonMessage: string;
};

const ConfirmationModal = ({
  confirmation,
  onClose,
  onConfirmationClick,
  confirmationHeading = "Are you sure?",
  confirmationMessage,
  buttonMessage,
}: ConfirmationModalProps) => {
  return (
    <Modal
      isOpen={confirmation}
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
              {confirmationHeading}
            </Heading>
            <ModalCloseButton
              position="static"
              marginLeft="auto"
              borderRadius="15px"
              backgroundColor="gray.100"
            />
          </Flex>
        </ModalHeader>
        <ModalBody paddingBottom="15px">
          <Text fontSize="16px" paddingLeft="10px" paddingRight="10px">
            {confirmationMessage}
          </Text>
          <Flex paddingTop="20px" paddingBottom="25px" paddingLeft="10px">
            <Button
              minWidth="65%"
              colorScheme="blue"
              onClick={onConfirmationClick}
            >
              {buttonMessage}
            </Button>
          </Flex>
        </ModalBody>
        <Box bg="blue.500" w="100%" p="5px" borderRadius="0 0 5px 5px" />
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
