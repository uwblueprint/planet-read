import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import Select, { StylesConfig } from "react-select";
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

import { roleOptions } from "../../constants/Roles";

import { buildAssignStoryQuery } from "../../APIClients/queries/StoryQueries";
import { convertLanguageTitleCase } from "../../utils/LanguageUtils";
import { ApprovedLanguagesMap, isObjEmpty } from "../../utils/Utils";

export type StoryToAssign = {
  storyId: number;
  storyTranslationId?: number;
  title: string;
  description: string;
  level: number;
  language: string;
};

export type AssignStoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAssignStory: (story: StoryToAssign) => void;
  approvedLanguagesTranslation: ApprovedLanguagesMap;
  approvedLanguagesReview: ApprovedLanguagesMap;
};

const DropdownIndicator = () => {
  return (
    <Box
      borderLeft="5px solid transparent"
      borderRight="5px solid transparent"
      borderTop="9px solid black"
      margin="10px"
    />
  );
};

const colourStyles: StylesConfig = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "#F1F4F7", // #F1F4F7 is gray.100
    border: "none",
  }),
  option: (styles, { isSelected }) => {
    return {
      ...styles,
      color: "black",
      backgroundColor: isSelected ? "#F1F4F7" : "white", // #F1F4F7 is gray.100
      "&:hover": {
        backgroundColor: "#F1F4F7", // #F1F4F7 is gray.100
      },
    };
  },
  indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
  placeholder: (styles) => ({ ...styles, color: "black" }),
};

const AssignStoryModal = ({
  isOpen,
  onClose,
  onAssignStory,
  approvedLanguagesTranslation,
  approvedLanguagesReview,
}: AssignStoryModalProps) => {
  const isApprovedReviewer = !isObjEmpty(approvedLanguagesReview);

  // default selection to Translator if user is not an approved reviewer
  const [role, setRole] = useState<string | null>(
    isApprovedReviewer ? null : "Translator",
  );
  const [language, setLanguage] = useState<string | null>(null);
  const [level, setLevel] = useState<number | null>(null);
  const [stories, setStories] = useState<StoryToAssign[]>([]);
  const [selectedStory, setSelectedStory] = useState<StoryToAssign | null>(
    null,
  );

  const query = buildAssignStoryQuery(role === "Translator", language, level);

  useQuery(query.string, {
    fetchPolicy: "cache-and-network",
    skip: language == null || level == null,
    onCompleted: (data) => {
      const storyData = data[query!!.fieldName].map((storyObj: any) => ({
        ...storyObj,
        language,
      }));
      setStories(storyData);
    },
  });

  useEffect(() => {
    // reset story selection when one of the fields change
    setSelectedStory(null);
    setStories([]);
  }, [language, level, role]);

  useEffect(() => {
    // reset fields every time role changes
    setLanguage(null);
    setLevel(null);
  }, [role]);

  const approvedLanguages =
    role === "Translator"
      ? approvedLanguagesTranslation
      : approvedLanguagesReview;

  const languageOptions = role
    ? Object.keys(approvedLanguages).map((value) => ({
        value,
      }))
    : [];

  const maxApprovedLevel = approvedLanguages[language ?? ""] || 0;

  // display levels that the user is approved for
  const levelOptions = language
    ? [...Array(maxApprovedLevel + 1).keys()]
        .slice(1)
        .map((value) => ({ value: `${value}` }))
    : [];

  const disabledStyle = useStyleConfig("Disabled");
  const isRoleSelectDisabled = !isApprovedReviewer;
  const isLanguageSelectDisabled = role == null;
  const isLevelSelectDisabled = language == null;
  const isTitleSelectDisabled =
    (language == null || level == null) && stories.length === 0;
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
            Assign Story
          </Heading>
          <Text fontSize="16px" fontWeight="normal">
            Please assign an existing story to the user.
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
              <Box
                width="80%"
                sx={isRoleSelectDisabled ? disabledStyle : undefined}
              >
                <Select
                  placeholder="Select role"
                  options={roleOptions}
                  onChange={(option: any) => setRole(option.value)}
                  getOptionLabel={(option: any) => option.value}
                  value={role ? { value: role } : null}
                  styles={colourStyles}
                  components={{ DropdownIndicator }}
                  isDisabled={isRoleSelectDisabled}
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
                  options={languageOptions}
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
            <GridItem rowStart={2}>
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
                  value={level ? { value: level } : null}
                  styles={colourStyles}
                  components={{ DropdownIndicator }}
                  isDisabled={isLevelSelectDisabled}
                />
              </Box>
            </GridItem>
            <GridItem rowStart={3}>
              <Heading size="sm">Title</Heading>
              <Text marginBottom="12px">
                Please select a book title to assign to the user.
              </Text>
              <Box
                width="80%"
                sx={isTitleSelectDisabled ? disabledStyle : undefined}
              >
                <Select
                  placeholder="Select book title"
                  options={stories}
                  onChange={(option: any) => setSelectedStory(option)}
                  getOptionLabel={(option: any) => option.title}
                  value={selectedStory}
                  styles={colourStyles}
                  components={{ DropdownIndicator }}
                />
              </Box>
            </GridItem>
          </Grid>
          <Flex marginRight="28px" justifyContent="flex-end">
            <Button
              fontSize="14px"
              colorScheme="blue"
              onClick={() => onAssignStory(selectedStory!)}
              isDisabled={selectedStory == null}
            >
              Assign Story
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AssignStoryModal;
