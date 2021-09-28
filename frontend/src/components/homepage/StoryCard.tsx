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
import convertLanguageTitleCase from "../../utils/LanguageUtils";
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
  translatorId?: number;
  reviewerId?: number;
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
  translatorId,
}: StoryCardProps) => {
  const { authenticatedUser } = useContext(AuthContext);
  const history = useHistory();
  const embedLink = (originalYoutubeLink: string): string => {
    /*
    Transforms originalYoutubeLink into embed link appropriate for iframe.
      If already given link in the embed version, does nothing.

    Example:
    - Real link: https://www.youtube.com/watch?v=_OBlgSz8sSM
    - Embed link: https://www.youtube.com/embed/_OBlgSz8sSM
    */

    return originalYoutubeLink.replace("watch?v=", "embed/");
  };
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
      if (result.data?.assignUserAsReviewer.ok) {
        history.push(`/review/${storyId}/${storyTranslationId}`);
      } else {
        handleError("Unable to assign reviewer.");
      }
    } catch (err) {
      handleError(err ?? "Error occurred, please try again.");
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
      if (result.data?.createStoryTranslation.story.id) {
        history.push(
          `/translation/${storyId}/${result.data?.createStoryTranslation.story.id}`,
        );
      } else {
        handleError("Unable to assign translator.");
      }
    } catch (err) {
      handleError(err ?? "Error occurred, please try again.");
    }
  };

  const [preview, setPreview] = useState(false);
  const previewBook = () => {
    setPreview(!preview);
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
    return storyTranslationId ? "review book" : "translate book";
  };

  const primaryBtnOnClick = () => {
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
          style={{ width: "100%" }}
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
            <Badge background="orange.50">{`Level ${level}`}</Badge>
            <Badge background="purple.50">{`${convertLanguageTitleCase(
              language,
            )}`}</Badge>
            {isMyStory && (
              <Badge background="green.50">
                {isTranslator ? "Translator" : "Reviewer"}
              </Badge>
            )}
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
          variant="outline"
          size="secondary"
          marginTop="5px"
          onClick={previewBook}
        >
          preview book
        </Button>
      </Flex>
      {preview && (
        <PreviewModal
          storyId={storyId}
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
