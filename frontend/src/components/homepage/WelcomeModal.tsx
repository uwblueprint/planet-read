import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
} from "@chakra-ui/react";
import { WELCOME_MODAL_COPY } from "../../utils/Copy";

export type WelcomeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const modalBodyText = WELCOME_MODAL_COPY.map((text: string) => (
  <Text margin="10px">{text}</Text>
));

const WelcomeModal = ({ isOpen, onClose }: WelcomeModalProps) => {
  const [isAgreed, setIsAgreed] = useState(false);
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => undefined}
      motionPreset="slideInBottom"
      size="5xl"
    >
      <ModalOverlay />
      <ModalContent marginTop="30vh">
        <ModalHeader paddingTop="30px" paddingLeft="35px" paddingRight="35px">
          <Heading as="h3" size="lg" marginBottom="10px" width="75%">
            Welcome to Add My Language
          </Heading>
        </ModalHeader>
        <Divider width="100%" />
        <ModalBody paddingBottom="15px">
          <Flex direction="column" padding="20px">
            {modalBodyText}
          </Flex>
          <Flex justifyContent="space-between">
            <Checkbox
              isChecked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
            >
              I agree to the terms and conditions
            </Checkbox>
            <Button colorScheme="blue" isDisabled={!isAgreed} onClick={onClose}>
              Let&apos;s Get Started
            </Button>
          </Flex>
        </ModalBody>
        <Box bg="blue.500" w="100%" p="5px" borderRadius="0 0 5px 5px" />
      </ModalContent>
    </Modal>
  );
};

export default WelcomeModal;
