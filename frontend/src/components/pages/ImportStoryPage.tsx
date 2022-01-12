import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import Select from "react-select";
import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Link,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icon";
import { MdArrowBackIosNew, MdDelete, MdFolder } from "react-icons/md";
import DropdownIndicator from "../utils/DropdownIndicator";
import Header from "../navigation/Header";
import { colourStyles } from "../../theme/components/Select";
import { getLanguagesQuery } from "../../APIClients/queries/LanguageQueries";
import {
  IMPORT_STORY,
  ImportStoryResponse,
  PROCESS_STORY,
  ProcessStoryResponse,
} from "../../APIClients/mutations/StoryMutations";
import { levelOptions } from "../../constants/Levels";
import PreviewModal from "../homepage/PreviewModal";

const ImportStoryPage = () => {
  const [dragOver, setDragOver] = useState(false);
  const [excludedLanguages, setExcludedLanguages] = useState<string[]>([]);
  const [languageOptions, setLanguageOptions] = useState<string[]>([]);
  const [storyFile, setStoryFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [level, setLevel] = useState<number | null>(null);
  const [youtubeLink, setYoutubeLink] = useState<string>("");
  const [preview, setPreview] = useState(false);
  const [storyContents, setStoryContents] = useState<string[]>([]);

  const history = useHistory();
  const [importStory] = useMutation<{
    importStory: ImportStoryResponse;
  }>(IMPORT_STORY);

  const [processStory] = useMutation<{
    processStory: ProcessStoryResponse;
  }>(PROCESS_STORY);

  useQuery(getLanguagesQuery.string, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setLanguageOptions(data.languages);
    },
  });

  const onFileUpload = (e: any) => {
    setStoryFile(e.target.files[0]);
  };

  const onFileDelete = () => {
    setStoryFile(null);
  };

  const onDragEnter = (e: any) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = (e: any) => {
    e.preventDefault();
    setDragOver(false);
  };

  const onDragOver = (e: any) => {
    e.preventDefault();
    if (
      e.dataTransfer.items &&
      e.dataTransfer.items.length === 1 &&
      e.dataTransfer.items[0].kind === "file"
    ) {
      e.dataTransfer.dropEffect = "copy";
    }
  };

  const onFileDrop = (e: any) => {
    e.preventDefault();
    setDragOver(false);
    if (
      e.dataTransfer.items &&
      e.dataTransfer.items.length === 1 &&
      e.dataTransfer.items[0].kind === "file"
    ) {
      const newStoryFile = e.dataTransfer.items[0].getAsFile();
      if (
        newStoryFile.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setStoryFile(newStoryFile);
      } else {
        console.log("Incorrect file type");
      }
    } else if (e.dataTransfer.files && e.dataTransfer.files.length === 1) {
      const newStoryFile = e.dataTransfer.files[0];
      if (
        newStoryFile.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setStoryFile(newStoryFile);
      }
    }
  };

  const submitForm = async () => {
    if (!(storyFile && title && description && level && youtubeLink)) {
      window.alert("Please fill out all required fields.");
      return;
    }

    const result = await importStory({
      variables: {
        storyFile,
        storyDetails: {
          title,
          description,
          youtubeLink,
          level,
        },
      },
    });
    if (result.data) {
      const storyId = result.data.importStory.story.id;
      history.push(`/story/${storyId}`);
    }
  };

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

  const onPreviewStory = async () => {
    const result = await processStory({
      variables: {
        storyFile,
      },
    });
    if (result.data) {
      setStoryContents(result.data.processStory.storyContents);
      setPreview(true);
    }
  };

  const onClosePreview = () => {
    setPreview(false);
  };

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
              <Input
                id="title"
                size="md"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired marginTop="40px">
              <FormLabel
                fontWeight="bold"
                htmlFor="description"
                marginBottom="15px"
              >
                Description
              </FormLabel>
              <Textarea
                id="description"
                height="150px"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
            <FormControl marginTop="40px" isRequired>
              <FormLabel fontWeight="bold" htmlFor="level" marginBottom="15px">
                Level
              </FormLabel>
              <Box width="300px">
                <Select
                  components={{ DropdownIndicator }}
                  id="level"
                  placeholder="Select level"
                  styles={colourStyles}
                  options={levelOptions}
                  onChange={(option: any) => setLevel(option?.value || "")}
                  getOptionLabel={(option: any) => `Level ${option.value}`}
                  value={level ? { value: level } : null}
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
              <Input
                id="youtube-link"
                size="md"
                type="text"
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
              />
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
            <Flex direction="column" flex={1} marginTop="40px">
              <Heading size="sm">
                Upload file
                <span
                  role="presentation"
                  className="chakra-form__required-indicator css-1ssjhh"
                >
                  *
                </span>
              </Heading>{" "}
              <Flex
                align="center"
                background="blue.50"
                border={dragOver ? "2px dashed" : "2px solid"}
                // this is blue.100 at 50% opacity
                borderColor="rgba(29, 108, 165, 0.5)"
                direction="column"
                height="250px"
                justify="center"
                onDragEnter={(e: any) => onDragEnter(e)}
                onDragLeave={(e: any) => onDragLeave(e)}
                onDragOver={(e: any) => onDragOver(e)}
                onDrop={(e: any) => onFileDrop(e)}
                opacity={dragOver ? "50%" : "100%"}
                rounded="md"
              >
                <Icon
                  aria-label="Folder icon"
                  as={MdFolder}
                  background="transparent"
                  color="blue.100"
                  height={16}
                  marginBottom="8px"
                  pointerEvents="none"
                  width={16}
                />
                <Text pointerEvents="none">
                  Drag & drop your file here (.docx)
                </Text>
                <FormControl
                  pointerEvents={dragOver ? "none" : "auto"}
                  width="160px"
                >
                  <FormLabel
                    cursor="pointer"
                    htmlFor="browse-files"
                    marginTop="16px"
                  >
                    <Button colorScheme="blue" pointerEvents="none">
                      Browse Files
                    </Button>
                  </FormLabel>
                  <Input
                    accept=".docx"
                    hidden
                    id="browse-files"
                    onChange={(e) => onFileUpload(e)}
                    type="file"
                  />
                </FormControl>
              </Flex>
              <Heading marginTop="40px" size="sm">
                Uploaded file
              </Heading>
              <Text marginBottom="10px">
                Drag & drop a file or browse files to upload a story.
              </Text>
              {storyFile && (
                <Flex key={storyFile.name}>
                  <Text marginTop="10px">{storyFile.name}</Text>
                  <IconButton
                    aria-label="Delete icon"
                    background="transparent"
                    icon={<Icon as={MdDelete} height={5} width={5} />}
                    marginTop="3px"
                    onClick={() => onFileDelete()}
                    width="fit-content"
                  />
                </Flex>
              )}
            </Flex>
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
          <Button
            colorScheme="blue"
            disabled={storyFile === null}
            marginRight="20px"
            onClick={onPreviewStory}
            variant="blueOutline"
          >
            PREVIEW STORY
          </Button>
          <Button
            colorScheme="blue"
            marginRight="90px"
            onClick={() => submitForm()}
          >
            IMPORT STORY
          </Button>
        </Box>
      </Flex>
      {preview && (
        <PreviewModal
          storyId={0}
          title={title}
          youtubeLink={youtubeLink}
          level={level || 0}
          previewBook={onClosePreview}
          preview={preview}
          previewStoryContents={storyContents}
        />
      )}
    </Flex>
  );
};

export default ImportStoryPage;
