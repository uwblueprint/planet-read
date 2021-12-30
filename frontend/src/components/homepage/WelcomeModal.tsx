import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Heading,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
} from "@chakra-ui/react";
import { WELCOME_MODAL_COPY } from "../../utils/Copy";
import Logo from "../../assets/planet-read-logo.svg";

export type WelcomeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const modalBodyText = WELCOME_MODAL_COPY.map((text: string) => (
  <Text paddingTop="10px" paddingBottom="10px">
    {text}
  </Text>
));

const WelcomeModal = ({ isOpen, onClose }: WelcomeModalProps) => {
  const [isAgreed, setIsAgreed] = useState(false);
  return (
    <Modal
      isCentered
      isOpen={isOpen}
      closeOnOverlayClick={false}
      onClose={onClose}
      motionPreset="slideInBottom"
      size="4xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader padding="30px 35px 5px 35px">
          <Flex direction="row" justifyContent="flex-start">
            <Heading as="h3" size="lg" marginBottom="10px" marginRight="10px">
              Welcome to Add My Language
            </Heading>
            <Image alt="Planet read logo" src={Logo} width="40px" />
          </Flex>
        </ModalHeader>
        <Divider width="100%" />
        <ModalBody paddingBottom="15px" paddingLeft="35px">
          <Flex direction="column">{modalBodyText}</Flex>
          <Flex
            justifyContent="space-between"
            paddingTop="20px"
            paddingBottom="10px"
          >
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
