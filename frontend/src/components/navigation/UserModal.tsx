import React from "react";
import {
  Box,
  Circle,
  Divider,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icon";
import { MdOutlineAccountCircle } from "react-icons/md";
import Logout from "../auth/Logout";

type UserModalProps = {
  firstName: string;
  id: string;
  isReviewer: boolean;
  lastName: string;
  onClose: () => void;
  role: string;
  showUser: boolean;
};

const UserModal = ({
  firstName,
  id,
  isReviewer,
  lastName,
  onClose,
  role,
  showUser,
}: UserModalProps) => {
  const onShowProfileClick = () => {
    window.location.href = `#/user/${id}`;
  };

  return (
    <Modal
      isOpen={showUser}
      motionPreset="slideInBottom"
      onClose={onClose}
      size="xs"
    >
      <ModalOverlay />
      <ModalContent marginTop="30vh">
        <Box
          backgroundColor="blue.50"
          borderRadius="5px 5px 0 0"
          height="70px"
          width="100%"
        >
          <Flex justify="center">
            <Circle
              backgroundColor="white"
              height="60px"
              marginTop="35px"
              width="60px"
            >
              <Circle
                backgroundColor="blue.500"
                height="54px"
                marginTop="1px"
                width="54px"
              >
                <Icon
                  as={MdOutlineAccountCircle}
                  color="white"
                  height={12}
                  width={12}
                />
              </Circle>
            </Circle>
          </Flex>
        </Box>
        <ModalHeader padding="30px">
          <Flex alignItems="center" flexDirection="column">
            <Heading as="h3" size="md">
              {firstName} {lastName}
            </Heading>
            <Text color="gray.300" fontSize="16px">
              {role === "Admin" ? "Admin" : "Translator"}
              {isReviewer && role !== "Admin" ? " & Reviewer" : ""}
            </Text>
          </Flex>
        </ModalHeader>
        <Divider color="gray.300" />
        <ModalBody padding="30px">
          <Flex flexDirection="column">
            {role !== "Admin" && (
              <Text
                color="black"
                fontSize="16px"
                marginBottom="20px"
                onClick={onShowProfileClick}
                variant="link"
              >
                <Icon
                  as={MdOutlineAccountCircle}
                  height={6}
                  marginRight="10px"
                  width={6}
                />
                Profile
              </Text>
            )}
            <Logout />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UserModal;
