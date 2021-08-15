import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";
import convertLanguageTitleCase from "../../utils/LanguageUtils";
import { GET_STORY_CONTENTS } from "../../APIClients/queries";

export type PreviewModalProps = {
  storyId: number;
  title: string;
  youtubeLink: string;
  level: number;
  language: string;
  previewBook: () => void;
  preview: boolean;
  primaryBtnText: string;
  primaryBtnOnClick: () => any;
};

const PreviewModal = ({
  storyId,
  title,
  youtubeLink,
  level,
  language,
  previewBook,
  preview,
  primaryBtnText,
  primaryBtnOnClick,
}: PreviewModalProps) => {
  const [content, setContent] = useState<string[]>([]);

  useQuery(GET_STORY_CONTENTS(storyId), {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      const storyContentsArray = data.storyById.contents.map((story: any) => {
        return story.content;
      });
      setContent(storyContentsArray);
    },
  });

  const storyContents = content.map((c: string, index: number) => (
    <Flex padding={3}>
      <Box
        width="30px"
        text-align="center"
        float="left"
        margin="0px 10px 0px 0px"
        color="black"
      >
        <Text fontSize="16px" as="b" align="center">
          {index + 1}
        </Text>
      </Box>
      <Box
        backgroundColor="blue.50"
        width="100%"
        borderRadius="10px"
        float="right"
        padding={3}
        color="black"
        fontSize="16px"
        as="b"
      >
        {c}
      </Box>
    </Flex>
  ));

  return (
    <Modal
      isOpen={preview}
      onClose={previewBook}
      motionPreset="slideInBottom"
      size="4xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton position="static" marginLeft="auto" />
        <ModalHeader paddingTop="-10px">
          <Heading as="h3" size="md">
            {title}
          </Heading>
          <Box padding="10px 0px 10px 0px" float="left">
            <Badge>{`Level ${level}`}</Badge>
            <Badge>{`${convertLanguageTitleCase(language)}`}</Badge>
          </Box>
          <Button
            float="right"
            width="21%"
            colorScheme="blue"
            mr={3}
            onClick={primaryBtnOnClick()}
          >
            {primaryBtnText}
          </Button>
        </ModalHeader>
        <Box display="block" paddingLeft="30px">
          <Text fontSize="16px" color="grey">
            <Link href={youtubeLink}>→ Watch the English AniBook</Link>
          </Text>
        </Box>
        <ModalBody>{storyContents}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PreviewModal;
