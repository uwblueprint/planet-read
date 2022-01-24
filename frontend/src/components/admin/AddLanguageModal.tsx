import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import Select from "react-select";

import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Text,
  Tbody,
  Tr,
  Td,
  useStyleConfig,
} from "@chakra-ui/react";

import {
  ADD_LANGUAGE,
  AddLanguageResponse,
} from "../../APIClients/mutations/LanguageMutations";
import {
  ADD_LANGUAGE_SUCCESS_HEADING,
  ADD_LANGUAGE_SUCCESS_CONFIRMATION,
  CONFIRM_OK,
} from "../../utils/Copy";

import { scriptDirectionOptions } from "../../constants/Languages";
import ConfirmationModal from "../utils/ConfirmationModal";
import DropdownIndicator from "../utils/DropdownIndicator";
import { colourStyles } from "../../theme/components/Select";
import { getLanguagesQuery } from "../../APIClients/queries/LanguageQueries";

export type AddLanguageModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddLanguageModal = ({ isOpen, onClose }: AddLanguageModalProps) => {
  const [language, setLanguage] = useState<string>("");
  const [languageOptions, setLanguageOptions] = useState<string[]>([]);
  const [isRtl, setIsRtl] = useState<boolean | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);

  const disabledStyle = useStyleConfig("Disabled");
  const [addLanguage] = useMutation<{
    addLanguage: AddLanguageResponse;
  }>(ADD_LANGUAGE);

  const onConfirmationModalClose = () => {
    setLanguageOptions([...languageOptions, language]);
    setLanguage("");
    setIsRtl(null);
    setIsSuccessModalOpen(false);
    onClose();
  };

  const useAddLanguage = async () => {
    try {
      const result = await addLanguage({ variables: { language, isRtl } });
      if (!result.data?.addLanguage.ok) {
        // eslint-disable-next-line no-alert
        window.alert("Error creating new language!");
        onConfirmationModalClose();
      }
      setIsSuccessModalOpen(true);
    } catch (err) {
      // eslint-disable-next-line no-alert
      window.alert(err);
      onConfirmationModalClose();
    }
  };

  useQuery(getLanguagesQuery.string, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setLanguageOptions(data.languages);
    },
  });

  const languageTableBody = languageOptions.map(
    (lang: string, index: number) => (
      <Tr
        borderTop={index === 0 ? "1em solid transparent" : ""}
        borderBottom={
          index === languageOptions.length - 1 ? "1em solid transparent" : ""
        }
        key={lang}
      >
        <Td>{lang}</Td>
      </Tr>
    ),
  );

  const getScriptDirectionSelectValue = () => {
    if (isRtl === null) {
      return null;
    }
    if (isRtl) {
      return { value: "Right-to-left" };
    }
    return { value: "Left-to-right" };
  };

  const languageAlreadyExists =
    languageOptions
      .map((lang) => lang.toLowerCase())
      .indexOf(language.toLowerCase()) !== -1;

  const languageNotTitlecase = language.match(/\b[a-z]/) !== null;

  const getFocuBorderColor = () => {
    if (languageAlreadyExists) {
      return "red.100";
    }
    if (languageNotTitlecase) {
      return "orange.100";
    }
    return "";
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        motionPreset="slideInBottom"
        onClose={onClose}
        size="6xl"
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
              Add New Language
            </Heading>
          </ModalHeader>
          <ModalBody paddingBottom="36px">
            <Flex justifyContent="space-between">
              <Flex direction="column" width="40%" margin="10px">
                <Heading as="h4" size="sm" marginBottom="3px">
                  Add New Language
                </Heading>
                <Text marginBottom="3px">
                  Please enter the name of the new language.
                </Text>
                {languageNotTitlecase && (
                  <Text marginBottom="3px" color="orange.100">
                    Note: Did you mean to make this language title-case?
                  </Text>
                )}
                {languageAlreadyExists && (
                  <Text marginBottom="3px" color="red.100">
                    This language already exists.
                  </Text>
                )}
                <Input
                  id="new-language"
                  isInvalid={languageAlreadyExists}
                  errorBorderColor="red.100"
                  focusBorderColor={getFocuBorderColor()}
                  type="text"
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  placeholder="Enter new language"
                  marginBottom="10px"
                />
                <Heading as="h4" size="sm" marginBottom="3px">
                  Script Direction
                </Heading>
                <Text marginBottom="3px">
                  Please enter the direction of the script. For example, English
                  is left-to-right and Arabic is right-to-left.
                </Text>
                <Box
                  width="80%"
                  sx={
                    languageAlreadyExists || language === ""
                      ? disabledStyle
                      : undefined
                  }
                >
                  <Select
                    placeholder="Select Script Direction"
                    options={scriptDirectionOptions}
                    onChange={(option: any) =>
                      setIsRtl(option.value === "Right-to-left")
                    }
                    getOptionLabel={(option: any) => option.value}
                    value={getScriptDirectionSelectValue()}
                    styles={colourStyles}
                    components={{ DropdownIndicator }}
                    isDisabled={languageAlreadyExists || language === ""}
                  />
                </Box>
              </Flex>
              <Flex direction="column" margin="10px" width="50%">
                <Heading as="h4" size="sm">
                  Existing Languages
                </Heading>
                <Box
                  borderRadius="10px"
                  boxShadow="0px 0px 2px grey"
                  height="300px"
                  overflow="auto"
                >
                  <Table
                    marginTop="-10px"
                    size="sm"
                    theme="gray"
                    variant="striped"
                    width="100%"
                  >
                    <Tbody>{languageTableBody}</Tbody>
                  </Table>
                </Box>
              </Flex>
            </Flex>
            <Flex marginRight="28px" justifyContent="flex-end">
              <Button
                fontSize="14px"
                colorScheme="blue"
                width="120px"
                isDisabled={
                  languageAlreadyExists || language === "" || isRtl === null
                }
                onClick={useAddLanguage}
              >
                Confirm
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
      <ConfirmationModal
        buttonMessage={CONFIRM_OK}
        confirmation={isSuccessModalOpen && isOpen}
        confirmationHeading={ADD_LANGUAGE_SUCCESS_HEADING}
        confirmationMessage={ADD_LANGUAGE_SUCCESS_CONFIRMATION}
        onClose={onConfirmationModalClose}
        onConfirmationClick={onConfirmationModalClose}
      />
    </>
  );
};

export default AddLanguageModal;
