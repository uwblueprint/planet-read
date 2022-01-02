import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useStyleConfig,
} from "@chakra-ui/react";
import AuthContext from "../../contexts/AuthContext";
import PreviewModal from "./PreviewModal";
import { convertLanguageTitleCase } from "../../utils/LanguageUtils";
import { getLevelVariant } from "../../utils/StatusUtils";
import { embedLink } from "../../utils/Utils";

import {
  ASSIGN_REVIEWER,
  AssignReviewerResponse,
  CREATE_TRANSLATION,
  CreateTranslationResponse,
} from "../../APIClients/mutations/StoryMutations";

export type StoryCardProps = {
  storyId: number;
  storyTranslationId?: number;
  title: string;
  description: string;
  youtubeLink: string;
  level: number;
  language: string;
  isMyStory: boolean;
  isMyTest: boolean;
  translatorId?: number;
  reviewerId?: number;
  stage?: string;
};

const StoryCard = ({
  storyId,
  storyTranslationId,
  title,
  description,
  youtubeLink,
  level,
  language,
  isMyStory,
  isMyTest,
  translatorId,
}: StoryCardProps) => {
  const { authenticatedUser } = useContext(AuthContext);
  const history = useHistory();

  const handleError = (errorMessage: string) => {
    // eslint-disable-next-line no-alert
    alert(errorMessage);
  };
  const isTranslator = +authenticatedUser!!.id === translatorId;

  const [assignUserAsReviewer] = useMutation<{
    assignUserAsReviewer: AssignReviewerResponse;
  }>(ASSIGN_REVIEWER);
  const assignReviewer = async () => {
    try {
      const result = await assignUserAsReviewer({
        variables: { storyTranslationId, userId: +authenticatedUser!!.id },
      });
      if (result.data?.assignUserAsReviewer.story.storyId) {
        history.push(`/review/${storyId}/${storyTranslationId}`);
      } else {
        handleError("Unable to assign reviewer.");
      }
    } catch (err) {
      if (typeof err === "string") {
        handleError(err);
      } else {
        console.log(err);
        handleError("Error occurred, please try again.");
      }
    }
  };

  const [createTranslation] = useMutation<{
    createStoryTranslation: CreateTranslationResponse;
  }>(CREATE_TRANSLATION);
  const assignTranslator = async () => {
    try {
      const storyTranslationData = {
        storyId,
        translatorId: +authenticatedUser!!.id,
        language,
      };
      const result = await createTranslation({
        variables: { storyTranslationData },
      });
      if (result.data?.createStoryTranslation.story.storyTranslationId) {
        history.push(
          `/translation/${storyId}/${result.data?.createStoryTranslation.story.storyTranslationId}`,
        );
      } else {
        handleError("Unable to assign translator.");
      }
    } catch (err) {
      if (typeof err === "string") {
        handleError(err);
      } else {
        console.log(err);
        handleError("Error occurred, please try again.");
      }
    }
  };

  const [preview, setPreview] = useState(false);
  const previewBook = () => {
    setPreview(!preview);
  };

  const openTest = () => {
    history.push(`/translation/${storyId}/${storyTranslationId}`);
  };

  const openTranslation = () => {
    const storyTranslationUrlBase = isTranslator ? "translation" : "review";
    history.push(
      `/${storyTranslationUrlBase}/${storyId}/${storyTranslationId}`,
    );
  };

  const primaryBtnText = () => {
    if (isMyStory) {
      return storyTranslationId ? "view translation" : "edit translation";
    }
    if (isMyTest) {
      return "take test";
    }
    return storyTranslationId ? "review" : "translate";
  };

  const primaryBtnOnClick = () => {
    if (isMyTest) {
      return openTest;
    }
    if (isMyStory) {
      return openTranslation;
    }
    return storyTranslationId ? assignReviewer : assignTranslator;
  };
  const storyCardStyle = useStyleConfig("StoryCard");

  const truncateText = (text: string, length: number) => {
    return `${text.substring(0, length).trim()}...`;
  };

  return (
    <Flex id={`story-${storyId}`} sx={storyCardStyle}>
      <Box
        css={{
          webkitBorderRadius: "8px",
          MozBorderRadius: "8px",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <iframe
          width="100%"
          src={embedLink(youtubeLink)}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </Box>
      <Box flexBasis="50%" padding="0px 0px 17px 26px">
        <Flex direction="column" wrap="wrap">
          <Heading size="md">{title}</Heading>
          <Flex direction="row" paddingBottom="10px">
            <Badge
              background={getLevelVariant(level)}
            >{`Level ${level}`}</Badge>
            <Badge variant="language">{`${convertLanguageTitleCase(
              language,
            )}`}</Badge>
            {isMyStory && (
              <Badge variant="role">
                {isTranslator ? "Translator" : "Reviewer"}
              </Badge>
            )}
            {isMyTest && <Badge variant="role">Test Book</Badge>}
          </Flex>
        </Flex>
        <Text size="xs">{truncateText(description, 100)}</Text>
      </Box>
      <Flex
        direction="column"
        flexBasis="30%"
        paddingTop="30px"
        alignItems="center"
        textAlign="center"
      >
        <Button
          colorScheme="blue"
          size="secondary"
          marginBottom="5px"
          onClick={primaryBtnOnClick()}
        >
          {primaryBtnText()}
        </Button>
        <Button
          variant="blueOutline"
          size="secondary"
          marginTop="5px"
          onClick={previewBook}
        >
          {isMyTest ? "preview" : "preview book"}
        </Button>
      </Flex>
      {preview && (
        <PreviewModal
          storyId={storyId}
          storyTranslationId={storyTranslationId}
          title={title}
          youtubeLink={youtubeLink}
          level={level}
          language={language}
          previewBook={previewBook}
          preview={preview}
          primaryBtnText={primaryBtnText()}
          primaryBtnOnClick={primaryBtnOnClick}
        />
      )}
    </Flex>
  );
};

export default StoryCard;
