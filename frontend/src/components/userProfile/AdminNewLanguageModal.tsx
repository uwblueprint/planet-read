import React, { useState } from "react";
import Select from "react-select";
import {
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
  Box,
  Grid,
  GridItem,
  useStyleConfig,
} from "@chakra-ui/react";

import { languageOptions } from "../../constants/Languages";
import { levelOptions } from "../../constants/Levels";
import { roleOptions } from "../../constants/Roles";

import { convertLanguageTitleCase } from "../../utils/LanguageUtils";
import { ApprovedLanguagesMap } from "../../utils/Utils";
import DropdownIndicator from "../utils/DropdownIndicator";
import { colourStyles } from "../../theme/components/Select";

export type NewApprovedLanguage = {
  language: string;
  level: number;
  role: string;
};

export type AdminNewLanguageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (newApprovedLanguage: NewApprovedLanguage) => void;
  approvedLanguagesTranslation: ApprovedLanguagesMap;
  approvedLanguagesReview: ApprovedLanguagesMap;
};

const AdminNewLanguageModal = ({
  isOpen,
  onClose,
  onAssign,
  approvedLanguagesTranslation,
  approvedLanguagesReview,
}: AdminNewLanguageModalProps) => {
  const [role, setRole] = useState<string | null>(null);
  const [language, setLanguage] = useState<string | null>(null);
  const [level, setLevel] = useState<number | null>(null);

  const currentApprovedLanguages = new Set(
    Object.keys(
      role === "Translator"
        ? approvedLanguagesTranslation
        : approvedLanguagesReview,
    ),
  );

  // don't show languages that the user is already approved for
  const newLanguageOptions = languageOptions.filter(
    (lang) => !currentApprovedLanguages.has(lang.value),
  );

  const disabledStyle = useStyleConfig("Disabled");
  const isLanguageSelectDisabled = role == null;
  const isLevelSelectDisabled = role == null;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      motionPreset="slideInBottom"
      size="4xl"
    >
      <ModalOverlay />
      <ModalContent paddingLeft="32px">
        <ModalCloseButton
          position="static"
          marginLeft="auto"
          marginTop="8px"
          marginRight="8px"
        />
        <ModalHeader paddingTop="20px">
          <Heading as="h3" size="lg">
            Approve New Language/Level
          </Heading>
          <Text fontSize="16px" fontWeight="normal">
            Please assign the user a new language and level.
          </Text>
        </ModalHeader>
        <ModalBody paddingTop="24px" paddingBottom="36px">
          <Grid
            templateRows="repeat(3, 1fr)"
            templateColumns="repeat(2, 1fr)"
            gap={8}
            width="92%"
            marginBottom="72px"
          >
            <GridItem>
              <Heading size="sm">Role</Heading>
              <Text marginBottom="12px">
                Please select a role to assign to the user.
              </Text>
              <Box width="80%">
                <Select
                  placeholder="Select role"
                  options={roleOptions}
                  onChange={(option: any) => setRole(option.value)}
                  getOptionLabel={(option: any) => option.value}
                  value={role ? { value: role } : null}
                  styles={colourStyles}
                  components={{ DropdownIndicator }}
                />
              </Box>
            </GridItem>
            <GridItem rowStart={2}>
              <Heading fontSize="16px">Language</Heading>
              <Text marginBottom="12px">
                Please select a language to assign to the user.
              </Text>
              <Box
                width="80%"
                sx={isLanguageSelectDisabled ? disabledStyle : undefined}
              >
                <Select
                  placeholder="Select language"
                  options={newLanguageOptions}
                  onChange={(option: any) => setLanguage(option.value)}
                  getOptionLabel={(option: any) =>
                    convertLanguageTitleCase(option.value)
                  }
                  value={language ? { value: language } : null}
                  styles={colourStyles}
                  components={{ DropdownIndicator }}
                  isDisabled={isLanguageSelectDisabled}
                />
              </Box>
            </GridItem>
            <GridItem rowStart={3}>
              <Heading size="sm">Level</Heading>
              <Text marginBottom="12px">
                Please select a level to assign to the user.
              </Text>
              <Box
                width="80%"
                sx={isLevelSelectDisabled ? disabledStyle : undefined}
              >
                <Select
                  placeholder="Select level"
                  options={levelOptions}
                  onChange={(option: any) =>
                    setLevel(parseInt(option.value, 10))
                  }
                  getOptionLabel={(option: any) => option.value}
                  value={level ? { value: `${level}` } : null}
                  styles={colourStyles}
                  components={{ DropdownIndicator }}
                  isDisabled={isLevelSelectDisabled}
                />
              </Box>
            </GridItem>
          </Grid>
          <Flex marginRight="28px" justifyContent="flex-end">
            <Button
              fontSize="14px"
              colorScheme="blue"
              width="120px"
              onClick={() =>
                onAssign({
                  language: language!,
                  level: level!,
                  role: role!,
                })
              }
              isDisabled={!language || !level}
            >
              Assign
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AdminNewLanguageModal;
