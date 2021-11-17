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
    window.location.href = `/user/${id}`;
  };

  return (
    <Modal
      isOpen={showUser}
      onClose={onClose}
      motionPreset="slideInBottom"
      size="xs"
    >
      <ModalOverlay />
      <ModalContent marginTop="30vh">
        <Box
          backgroundColor="blue.50"
          width="100%"
          height="70px"
          borderRadius="5px 5px 0 0"
        >
          <Flex justify="center">
            <Circle
              width="60px"
              height="60px"
              marginTop="35px"
              backgroundColor="white"
            >
              <Circle
                width="54px"
                height="54px"
                marginTop="1px"
                backgroundColor="blue.500"
              >
                <Icon
                  as={MdOutlineAccountCircle}
                  width={12}
                  height={12}
                  color="white"
                />
              </Circle>
            </Circle>
          </Flex>
        </Box>
        <ModalHeader padding="30px">
          <Flex flexDirection="column" alignItems="center">
            <Heading as="h3" size="md">
              {firstName} {lastName}
            </Heading>
            <Text fontSize="16px" color="gray.300">
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
                variant="link"
                marginBottom="20px"
                fontSize="16px"
                color="black"
                onClick={onShowProfileClick}
              >
                <Icon
                  as={MdOutlineAccountCircle}
                  height={6}
                  width={6}
                  marginRight="10px"
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
