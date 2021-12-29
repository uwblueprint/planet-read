import React, { useState } from "react";
import Select from "react-select";
import {
  Button,
  Flex,
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
import { ApprovedLanguagesMap } from "../../utils/Utils";
import { colourStyles } from "../../theme/components/Select";
import { convertLanguageTitleCase } from "../../utils/LanguageUtils";
import DropdownIndicator from "../utils/DropdownIndicator";
import { languageOptions } from "../../constants/Languages";

export type UserNewLanguageModalProps = {
  onSubmit: (newLanguage: string) => void;
  approvedLanguagesTranslation: ApprovedLanguagesMap | undefined;
  isOpen: boolean;
  onClose: () => void;
};

const UserNewLanguageModal = ({
  onSubmit,
  approvedLanguagesTranslation,
  isOpen,
  onClose,
}: UserNewLanguageModalProps) => {
  const [newLanguage, setNewLanguage] = useState<string>("");
  const unapprovedLanguageOptions = languageOptions.filter(function (obj) {
    return (
      !approvedLanguagesTranslation ||
      !Object.prototype.hasOwnProperty.call(
        approvedLanguagesTranslation,
        obj.value,
      )
    );
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent padding="10px" marginTop="200px">
        <ModalCloseButton position="static" marginLeft="auto" />
        <ModalHeader paddingTop="-10px">
          <Heading as="h3" size="lg">
            Add New Language
          </Heading>
        </ModalHeader>
        <ModalBody margin="-10px 0 15px 0">
          <Text marginBottom="40px" fontSize="sm">
            Before you can translate in a new language, you must pass a story
            translation test in that language. Platform admins will mark your
            test upon completion. This process may take more than one week.
          </Text>
          <Text marginBottom="20px">
            Please select a new language that you would like to take the story
            translation test in.
          </Text>
          <Flex marginBottom="200px">
            <Select
              components={{ DropdownIndicator }}
              getOptionLabel={(option: any) =>
                convertLanguageTitleCase(option.value)
              }
              onChange={(option: any) => setNewLanguage(option?.value || "")}
              options={unapprovedLanguageOptions}
              placeholder="Select language"
              styles={colourStyles}
            />
          </Flex>
          <Tooltip
            hasArrow
            isDisabled={newLanguage !== ""}
            label="Please select a language to add first"
            placement="top"
          >
            <Flex float="right" width="20%">
              <Button
                colorScheme="blue"
                disabled={newLanguage === ""}
                onClick={() => onSubmit(newLanguage)}
              >
                ADD TEST
              </Button>
            </Flex>
          </Tooltip>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UserNewLanguageModal;
