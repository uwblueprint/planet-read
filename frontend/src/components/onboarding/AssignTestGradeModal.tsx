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
  //   Text,
  Box,
  Grid,
  GridItem,
  //   useStyleConfig,
} from "@chakra-ui/react";

// import { languageOptions } from "../../constants/Languages";
import { levelOptions } from "../../constants/Levels";
// import { roleOptions } from "../../constants/Roles";

// import { convertLanguageTitleCase } from "../../utils/LanguageUtils";
// import { ApprovedLanguagesMap } from "../../utils/Utils";
import DropdownIndicator from "../utils/DropdownIndicator";
import { colourStyles } from "../../theme/components/Select";
import Block from "./Block";

export type AssignTestGradeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  testLevel: number;
  language: string;
  score: number;
  storyLength: number;
};

const AssignTestGradeModal = ({
  isOpen,
  onClose,
  testLevel,
  language,
  score,
  storyLength,
}: AssignTestGradeModalProps) => {
  const [level, setLevel] = useState<number | null>(null);

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
            Assign Level to User
          </Heading>
        </ModalHeader>
        <ModalBody paddingTop="24px" paddingBottom="36px">
          <Heading as="h4" size="md">
            Basic Test Information
          </Heading>

          <Grid
            templateRows="repeat(3, 1fr)"
            templateColumns="repeat(2, 1fr)"
            gap={8}
            width="92%"
            marginBottom="72px"
          >
            <GridItem rowStart={1}>
              <Flex width="100%">
                <Block header="Test Level" text={`Level ${testLevel}`} />
                <Block header="Test Level" text={`Level ${testLevel}`} />
                <Block header="Test Level" text={`Level ${testLevel}`} />
              </Flex>
              <Box>{language}</Box>
              <Box>
                {score}/{storyLength}
              </Box>
            </GridItem>
            <GridItem rowStart={2}>
              <Heading size="sm">Assign Level</Heading>
              <Box width="80%">
                <Select
                  placeholder="Assign level"
                  options={levelOptions}
                  onChange={(option: any) =>
                    setLevel(parseInt(option.value, 10))
                  }
                  getOptionLabel={(option: any) => option.value}
                  value={level ? { value: `${level}` } : null}
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
              width="120px"
              onClick={() => {}}
              isDisabled={!level}
            >
              Next
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AssignTestGradeModal;
