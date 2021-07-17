import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
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

  const GET_STORY_CONTENTS = (id: number) =>
    gql`
      query {
        storyById(
          id: ${id}
        ) {
          contents {
            id
            lineIndex
            content
          }
        }
      }
    `;

  useQuery(GET_STORY_CONTENTS(storyId), {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      const storyContentsArray = data.storyById.contents.map((story: any) => {
        return story.content;
      });
      setContent(storyContentsArray);
    },
  });

  return (
    <Modal
      isOpen={preview}
      onClose={previewBook}
      motionPreset="slideInBottom"
      size="xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Box width="95%">
            <Box width="70%">
              <Heading as="h3" size="md">
                {title}
              </Heading>
            </Box>
            <Box width="75%" padding="10px 0px 10px 0px" float="left">
              <Badge>{`Level ${level}`}</Badge>
              <Badge>{`${convertLanguageTitleCase(language)}`}</Badge>
            </Box>
            <Box width="25%" float="right">
              <Button colorScheme="blue" mr={3} onClick={primaryBtnOnClick()}>
                {primaryBtnText}
              </Button>
            </Box>
          </Box>
          <Box width="95%" display="inline-block">
            <Text fontSize="22px" color="grey">
              <Link href={youtubeLink}>→ Watch the Audiobook</Link>
            </Text>
          </Box>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {content.map((c, index) => (
            <Box display="inline-block">
              <Flex
                width="5%"
                text-align="left"
                float="left"
                display="inline-block"
              >
                <Text fontSize="12px" as="b">
                  {index + 1}
                </Text>
              </Flex>
              <Flex
                width="95%"
                borderRadius="10px"
                float="right"
                padding="8px 8px 8px 10px"
                margin="0px 0px 15px 0px"
                backgroundColor="blue.50"
              >
                <Text fontSize="12px" as="b">
                  {c}
                </Text>
              </Flex>
            </Box>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PreviewModal;
