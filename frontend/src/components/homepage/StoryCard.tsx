import React, { useContext } from "react";
import { gql, useMutation } from "@apollo/client";
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
import "./StoryCard.css";
import convertLanguageTitleCase from "../../utils/LanguageUtils";

type AssignReviewer = { ok: boolean };
const ASSIGN_REVIEWER = gql`
  mutation assignUserAsReviewer($storyTranslationId: ID!, $userId: ID!) {
    assignUserAsReviewer(
      storyTranslationId: $storyTranslationId
      userId: $userId
    ) {
      ok
    }
  }
`;

type CreateTranslation = {
  story: {
    id: number;
  };
};
const CREATE_TRANSLATION = gql`
  mutation createStoryTranslation(
    $storyTranslationData: CreateStoryTranslationRequestDTO!
  ) {
    createStoryTranslation(storyTranslationData: $storyTranslationData) {
      story {
        id
      }
    }
  }
`;

export type StoryCardProps = {
  storyId: number;
  storyTranslationId?: number;
  title: string;
  description: string;
  youtubeLink: string;
  level: number;
  language: string;
  isMyStory: boolean;
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

  const [assignUserAsReviewer] = useMutation<{
    assignUserAsReviewer: AssignReviewer;
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
    createStoryTranslation: CreateTranslation;
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

  const previewBook = () => history.push("/preview");

  const openTranslation = () =>
    history.push(`/translation/${storyId}/${storyTranslationId}`);

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

  return (
    <Flex id={`story-${storyId}`} sx={storyCardStyle}>
      <iframe
        className="youtube-thumbnail"
        src={embedLink(youtubeLink)}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <Box flexBasis="40%" padding="17px 0px 17px 26px">
        <Flex direction="column" wrap="wrap">
          <Heading size="md">{title}</Heading>
          <Flex direction="row">
            <Badge>{`Level ${level}`}</Badge>
            <Badge>{`${convertLanguageTitleCase(language)}`}</Badge>
          </Flex>
        </Flex>
        <Text>{description}</Text>
      </Box>
      <Box flexBasis="40%" paddingTop="30px" textAlign="center">
        <Button
          colorScheme="blue"
          variant="solid"
          size="wide"
          onClick={primaryBtnOnClick()}
        >
          {primaryBtnText()}
        </Button>
        <Button
          colorScheme="blue"
          variant="outline"
          size="wide"
          onClick={previewBook}
        >
          preview book
        </Button>
      </Box>
    </Flex>
  );
};

export default StoryCard;
