import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import Select from "react-select";
import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icon";
import { MdArrowBackIosNew, MdFolder } from "react-icons/md";
import DropdownIndicator from "../utils/DropdownIndicator";
import Header from "../navigation/Header";
import { colourStyles } from "../../theme/components/Select";
import { getLanguagesQuery } from "../../APIClients/queries/LanguageQueries";

const ImportStoryPage = () => {
  const [excludedLanguages, setExcludedLanguages] = useState<string[]>([]);
  const [languageOptions, setLanguageOptions] = useState<string[]>([]);

  useQuery(getLanguagesQuery.string, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setLanguageOptions(data.languages);
    },
  });

  const options = languageOptions.map((lang) => {
    return { value: lang };
  });

  const excludedLanguageBadges = excludedLanguages.map((lang: string) => (
    <Badge key={lang} textTransform="none" marginBottom="15px">
      {lang}
      <Button
        variant="clear"
        size="clear"
        onClick={() => {
          const excludedLanguagesCopy = [...excludedLanguages];
          excludedLanguagesCopy.splice(excludedLanguages.indexOf(lang), 1);
          setExcludedLanguages(excludedLanguagesCopy);
        }}
      >
        ✕
      </Button>
    </Badge>
  ));

  return (
    <Flex direction="column" height="100vh" justifyContent="space-between">
      <Header />
      <Flex
        direction="column"
        flex="1"
        padding="40px 120px 60px 120px"
        overflow="auto"
      >
        <Link
          color="blue.100"
          fontWeight="bold"
          href="#/?tab=1"
          textDecoration="none"
          _hover={{ textDecoration: "none", color: "blue.100" }}
        >
          <Icon as={MdArrowBackIosNew} margin="-2px 10px 0 0" />
          Back to admin page
        </Link>
        <Heading margin="35px 0 30px 0">Import a New Book</Heading>
        <Flex>
          <Flex direction="column" paddingRight="40px" width="50%">
            <FormControl isRequired>
              <FormLabel fontWeight="bold" htmlFor="title" marginBottom="15px">
                Title
              </FormLabel>
              <Input id="title" size="md" type="text" />
            </FormControl>
            <FormControl isRequired marginTop="40px">
              <FormLabel
                fontWeight="bold"
                htmlFor="description"
                marginBottom="15px"
              >
                Description
              </FormLabel>
              <Textarea id="description" height="150px" type="text" />
            </FormControl>
            <FormControl marginTop="40px">
              <FormLabel fontWeight="bold" htmlFor="level" marginBottom="15px">
                Level
              </FormLabel>
              <Box width="300px">
                <Select
                  components={{ DropdownIndicator }}
                  id="level"
                  placeholder="Select level"
                  styles={colourStyles}
                />
              </Box>
            </FormControl>
            <FormControl isRequired marginTop="40px">
              <FormLabel
                fontWeight="bold"
                htmlFor="youtube-link"
                marginBottom="15px"
              >
                Youtube Link
              </FormLabel>
              <Input id="youtube-link" size="md" type="text" />
            </FormControl>
            <FormControl marginTop="40px">
              <FormLabel
                fontWeight="bold"
                htmlFor="languages"
                marginBottom="15px"
              >
                Languages to Exclude
              </FormLabel>
              {excludedLanguageBadges}
              <Box width="300px">
                <Select
                  components={{ DropdownIndicator }}
                  getOptionLabel={(option: any) => `
                    ${option.value || ""}
                  `}
                  id="languages"
                  options={options}
                  onChange={(option: any) =>
                    excludedLanguages.indexOf(option?.value) === -1 &&
                    setExcludedLanguages([...excludedLanguages, option?.value])
                  }
                  placeholder="Select one or more languages"
                  styles={colourStyles}
                />
              </Box>
            </FormControl>
          </Flex>
          <Flex direction="column" paddingLeft="40px" width="50%">
            <Text fontWeight="bold" marginBottom="15px">
              Instructions
            </Text>
            <Text fontSize="sm">
              Please divide the story content into digestible sections for the
              translator. To create a new section, skip a line between the
              previous section and the new section by pressing “Enter” on the
              keyboard.
            </Text>
            <Text fontSize="sm" margin="20px 0 15px 0">
              Example:
            </Text>
            <Box backgroundColor="gray.100" padding="10px 20px">
              <Text fontSize="sm" marginBottom="10px">
                PlanetRead is a not-for-profit with the vision of a planet where
                everyone can read and have access to interesting and affordable
                reading opportunities in native and any other language(s) of
                interest.
              </Text>
              <Text fontSize="sm" marginBottom="10px">
                (skipped line)
              </Text>
              <Text fontSize="sm">
                This vision is built around its core innovation, Same Language
                Subtitling (SLS), and a mission to implement SLS on audio-visual
                content already watched with a passion by millions of people, in
                every country, in locally, regionally, nationally, and
                internationally important languages.
              </Text>
            </Box>
            <FormControl isRequired marginTop="40px">
              <FormLabel
                fontWeight="bold"
                htmlFor="upload-file"
                marginBottom="15px"
              >
                Upload file
              </FormLabel>
              <Box
                backgroundColor="blue.50"
                border="1px solid"
                borderColor="blue.100"
                borderRadius="10px"
                padding="60px 120px"
                textAlign="center"
              >
                <Icon as={MdFolder} color="blue.100" height={16} width={16} />
                <Text fontSize="sm" marginBottom="15px">
                  Drag & drop your files here (.docx)
                </Text>
                <Button colorScheme="blue" textTransform="capitalize">
                  Browse Files
                </Button>
              </Box>
            </FormControl>
            <Text fontWeight="bold" marginTop="40px">
              Uploaded files
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        alignItems="center"
        boxShadow="0 0 12px -9px rgba(0, 0, 0, 0.7)"
        direction="row"
        height="90px"
        justify="flex-end"
        padding="20px 30px"
      >
        <Box>
          <Button colorScheme="blue" marginRight="20px" variant="blueOutline">
            PREVIEW STORY
          </Button>
          <Button colorScheme="blue" marginRight="90px">
            IMPORT STORY
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};

export default ImportStoryPage;
