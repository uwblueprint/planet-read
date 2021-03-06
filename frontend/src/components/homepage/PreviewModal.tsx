import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Badge,
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
import { Icon } from "@chakra-ui/icon";
import { MdTrendingFlat } from "react-icons/md";
import { getLevelVariant } from "../../utils/StatusUtils";
import { convertStageTitleCase } from "../../utils/StageUtils";
import {
  GET_STORY_CONTENTS,
  GET_STORY_AND_TRANSLATION_CONTENTS,
} from "../../APIClients/queries/StoryQueries";
import { IS_RTL } from "../../APIClients/queries/LanguageQueries";

export type PreviewModalProps = {
  storyId?: number;
  storyTranslationId?: number;
  title?: string;
  youtubeLink?: string;
  level?: number;
  language?: string;
  previewBook: () => void;
  preview: boolean;
  primaryBtnText?: string;
  primaryBtnOnClick?: () => any;
  previewStoryContents?: string[];
};

const PreviewModal = ({
  storyId,
  storyTranslationId,
  title,
  youtubeLink,
  level,
  language,
  previewBook,
  preview,
  primaryBtnText,
  primaryBtnOnClick,
  previewStoryContents,
}: PreviewModalProps) => {
  const [content, setContent] = useState<string[]>([]);
  const [translationContent, setTranslationContent] = useState<string[]>([]);
  const [stage, setStage] = useState<string>("");
  const [isRTL, setIsRTL] = useState<boolean>(false);

  if (language) {
    useQuery(IS_RTL(language), {
      fetchPolicy: "cache-and-network",
      onCompleted: (data) => {
        setIsRTL(data.isRtl.isRtl);
      },
    });
  }

  if (storyId && storyTranslationId) {
    useQuery(GET_STORY_AND_TRANSLATION_CONTENTS(storyId, storyTranslationId), {
      fetchPolicy: "cache-and-network",
      onCompleted: (data: any) => {
        const storyContentsArray = data.storyById.contents.map((story: any) => {
          return story.content;
        });
        setContent(storyContentsArray);

        const storyTranslationContentsArray =
          data.storyTranslationById.translationContents.map((story: any) => {
            return story.content;
          });
        setTranslationContent(storyTranslationContentsArray);

        setStage(data.storyTranslationById.stage);
      },
    });
  } else if (storyId) {
    useQuery(GET_STORY_CONTENTS(storyId), {
      fetchPolicy: "cache-and-network",
      onCompleted: (data: any) => {
        const storyContentsArray = data.storyById.contents.map((story: any) => {
          return story.content;
        });
        setContent(storyContentsArray);
      },
    });
  }

  let storyContents = null;
  if (previewStoryContents) {
    storyContents = previewStoryContents.map((c: string, index: number) => (
      <Flex>
        <Text variant="previewModalLineIndex">{index + 1}</Text>
        <Text variant="cell" fontSize="16px">
          {c}
        </Text>
      </Flex>
    ));
  } else {
    storyContents = content.map((c: string, index: number) => (
      <Flex>
        <Text variant="previewModalLineIndex">{index + 1}</Text>
        <Text variant="cell" fontSize="16px">
          {c}
        </Text>
        {storyTranslationId && (
          <Text
            textAlign={isRTL ? "right" : "left"}
            variant="previewModalTranslationContent"
          >
            {translationContent[index]}
          </Text>
        )}
      </Flex>
    ));
  }

  return (
    <Modal
      isOpen={preview}
      onClose={previewBook}
      motionPreset="slideInBottom"
      size="6xl"
    >
      <ModalOverlay />
      <ModalContent paddingLeft="20px">
        <ModalCloseButton position="static" marginLeft="auto" />
        {title && language && level && primaryBtnOnClick && primaryBtnText && (
          <ModalHeader paddingTop="-10px">
            <Heading as="h3" size="lg" marginBottom="10px" width="75%">
              {title}
            </Heading>
            <Badge variant="language" size="s">{`${language}`}</Badge>
            <Badge
              backgroundColor={getLevelVariant(level)}
              size="s"
            >{`Level ${level}`}</Badge>
            {storyTranslationId && (
              <Badge variant="stage" size="s">
                {convertStageTitleCase(stage)}
              </Badge>
            )}
            <Button
              float="right"
              width="20%"
              colorScheme="blue"
              size="secondary"
              marginRight="15px"
              onClick={primaryBtnOnClick()}
            >
              {primaryBtnText}
            </Button>
          </ModalHeader>
        )}
        {youtubeLink && (
          <ModalBody marginBottom="30px" marginTop="-10px" as="u">
            <Link href={youtubeLink} isExternal color="gray">
              <Icon
                as={MdTrendingFlat}
                height={6}
                width={6}
                marginRight="10px"
              />
              Watch the English AniBook
            </Link>
          </ModalBody>
        )}
        <ModalBody>{storyContents}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PreviewModal;
