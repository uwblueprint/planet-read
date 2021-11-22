import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Heading,
  Link,
  Text,
  Textarea,
  useStyleConfig,
} from "@chakra-ui/react";
import { embedLink } from "../../utils/Utils";

import { GET_STORY_TRANSLATION } from "../../APIClients/queries/StoryQueries";
import {
  SOFT_DELETE_STORY_TRANSLATION,
  SoftDeleteStoryTranslationResponse,
  UPDATE_STORY,
  UpdateStoryResponse,
} from "../../APIClients/mutations/StoryMutations";
import Header from "../navigation/Header";
import ProgressBar from "../utils/ProgressBar";
import ConfirmationModal from "../utils/ConfirmationModal";
import { convertLanguageTitleCase } from "../../utils/LanguageUtils";
import convertStageTitleCase from "../../utils/StageUtils";
import {
  MANAGE_STORY_TRANSLATIONS_TABLE_DELETE_TRANSLATION_BUTTON,
  MANAGE_STORY_TRANSLATIONS_TABLE_DELETE_TRANSLATION_CONFIRMATION,
} from "../../utils/Copy";

type ManageStoryTranslationPageProps = {
  storyIdParam: string;
  storyTranslationIdParam: string;
};

type StoryTranslation = {
  title: string;
  description: string;
  youtubeLink: string;
  level: number;
  language: string;
  stage: string;
  translatorId: number;
  translatorName: string;
  reviewerId: number;
  reviewerName: string;
  numTranslatedLines: number;
  numApprovedLines: number;
  numContentLines: number;
};

const ManageStoryTranslationPage = () => {
  const { storyIdParam, storyTranslationIdParam } =
    useParams<ManageStoryTranslationPageProps>();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [youtubeLink, setYoutubeLink] = useState<string>("");
  const [level, setLevel] = useState<number>(0);
  const [language, setLanguage] = useState<string>("");
  const [stage, setStage] = useState<string>("");
  const [translatorId, setTranslatorId] = useState<number>(0);
  const [translatorName, setTranslatorName] = useState<string>("");
  const [reviewerId, setReviewerId] = useState<number>(0);
  const [reviewerName, setReviewerName] = useState<string>("");
  const [numTranslatedLines, setNumTranslatedLines] = useState<number>(0);
  const [numApprovedLines, setNumApprovedLines] = useState<number>(0);
  const [numContentLines, setNumContentLines] = useState<number>(0);
  const [tempTitle, setTempTitle] = useState<string>("");
  const [tempDescription, setTempDescription] = useState<string>("");
  const [tempYoutubeLink, setTempYoutubeLink] = useState<string>("");

  const [confirmDeleteTranslation, setConfirmDeleteTranslation] =
    useState(false);

  const history = useHistory();

  useQuery(GET_STORY_TRANSLATION(parseInt(storyTranslationIdParam, 10)), {
    fetchPolicy: "cache-and-network",
    onCompleted: (data: {
      storyTranslationById: StoryTranslation;
      errors: any;
    }) => {
      setTitle(data.storyTranslationById.title);
      setDescription(data.storyTranslationById.description);
      setYoutubeLink(data.storyTranslationById.youtubeLink);
      setLevel(data.storyTranslationById.level);
      setLanguage(data.storyTranslationById.language);
      setStage(data.storyTranslationById.stage);
      setTranslatorId(data.storyTranslationById.translatorId);
      setTranslatorName(data.storyTranslationById.translatorName);
      setReviewerId(data.storyTranslationById.reviewerId);
      setReviewerName(data.storyTranslationById.reviewerName);
      setNumTranslatedLines(data.storyTranslationById.numTranslatedLines);
      setNumApprovedLines(data.storyTranslationById.numApprovedLines);
      setNumContentLines(data.storyTranslationById.numContentLines);
      setTempTitle(data.storyTranslationById.title);
      setTempDescription(data.storyTranslationById.description);
      setTempYoutubeLink(data.storyTranslationById.youtubeLink);
    },
    onError: () => {
      history.push("/404");
    },
  });
  const [deleteStoryTranslation] = useMutation<{
    response: SoftDeleteStoryTranslationResponse;
  }>(SOFT_DELETE_STORY_TRANSLATION);

  const [updateStory] = useMutation<{
    response: UpdateStoryResponse;
  }>(UPDATE_STORY);

  const closeModal = () => {
    setConfirmDeleteTranslation(false);
  };

  const openModal = () => {
    setConfirmDeleteTranslation(true);
  };

  const callSoftDeleteStoryTranslationMutation = async () => {
    await deleteStoryTranslation({
      variables: {
        id: storyTranslationIdParam,
      },
    });
    closeModal();
    history.push("/");
  };

  const callUpdateStoryMutation = async () => {
    await updateStory({
      variables: {
        storyId: storyIdParam,
        title: tempTitle,
        description: tempDescription,
        youtubeLink: tempYoutubeLink,
      },
    });
    setTitle(tempTitle);
    setDescription(tempDescription);
    setYoutubeLink(tempYoutubeLink);
  };

  const cancelChanges = () => {
    setTempTitle(title);
    setTempDescription(description);
    setTempYoutubeLink(youtubeLink);
  };

  const filterStyle = useStyleConfig("Filter");
  return (
    <Flex direction="column" height="100vh">
      <Header title="Manage Story Translation" />
      <Flex direction="row" flex={1}>
        <Flex sx={filterStyle} maxWidth="292px">
          <Heading size="lg">{title}</Heading>
          <Heading size="sm">Story ID</Heading>
          <Text>{storyIdParam}</Text>
          <Heading size="sm">Translation Language</Heading>
          <Text>{convertLanguageTitleCase(language)}</Text>
          <Heading size="sm">Level</Heading>
          <Text>{level}</Text>
          <Heading size="sm">Stage</Heading>
          <Text>{convertStageTitleCase(stage)}</Text>
          {/* TODO: Use translatorName and reviewerName */}
          <Heading size="sm">Translator</Heading>
          <Link isExternal href={`/user/${translatorId}`}>
            {translatorId}
            {translatorName}
          </Link>
          {reviewerId && (
            <>
              <Heading size="sm">Reviewer</Heading>
              <Link isExternal href={`/user/${reviewerId}`}>
                {reviewerId}
                {reviewerName}
              </Link>
            </>
          )}
        </Flex>
        <Flex direction="column" margin="40px" width="50%">
          <FormControl id="email">
            <Heading size="sm" marginTop="24px" marginBottom="18px">
              Title
            </Heading>
            <Input
              onChange={(event) => setTempTitle(event.target.value)}
              type="title"
              value={tempTitle || ""}
            />
            <Heading size="sm" marginTop="24px" marginBottom="18px">
              Description
            </Heading>
            <Textarea
              onChange={(event) => setTempDescription(event.target.value)}
              type="description"
              value={tempDescription || ""}
            />
            <Heading size="sm" marginTop="24px" marginBottom="18px">
              YouTube Link
            </Heading>
            <Input
              onChange={(event) => setTempYoutubeLink(event.target.value)}
              type="youtubeLink"
              value={tempYoutubeLink}
            />
          </FormControl>
          <Heading size="sm" marginTop="24px">
            Delete Story Translation
          </Heading>
          <Text>
            Permanently delete this story translation and all data associated
            with it.
          </Text>
          <Button
            colorScheme="red"
            margin="10px 0px"
            variant="outline"
            width="250px"
            onClick={() => openModal()}
          >
            Delete Story Translation
          </Button>
        </Flex>
        <Box
          css={{
            borderRadius: "8px",
            height: "200px",
            margin: "40px",
            MozBorderRadius: "8px",
            overflow: "hidden",
            webkitBorderRadius: "8px",
          }}
        >
          <iframe
            height="200px"
            width="100%"
            src={embedLink(youtubeLink)}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Box>
      </Flex>
      <Flex
        alignItems="center"
        boxShadow="0 0 12px -9px rgba(0, 0, 0, 0.7)"
        direction="row"
        height="90px"
        justify="space-between"
        padding="20px 30px"
      >
        <Flex direction="row">
          <ProgressBar
            percentageComplete={(numTranslatedLines / numContentLines) * 100}
            type="Translation"
          />
          <ProgressBar
            percentageComplete={(numApprovedLines / numContentLines) * 100}
            type="Review"
          />
        </Flex>
        <Box>
          <Button
            colorScheme="blue"
            isDisabled={
              title === tempTitle &&
              description === tempDescription &&
              youtubeLink === tempYoutubeLink
            }
            onClick={cancelChanges}
            variant="blueOutline"
          >
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            isDisabled={
              title === tempTitle &&
              description === tempDescription &&
              youtubeLink === tempYoutubeLink
            }
            onClick={callUpdateStoryMutation}
          >
            Save Changes
          </Button>
        </Box>
      </Flex>
      {confirmDeleteTranslation && (
        <ConfirmationModal
          confirmation={confirmDeleteTranslation}
          onClose={closeModal}
          onConfirmationClick={callSoftDeleteStoryTranslationMutation}
          confirmationMessage={
            MANAGE_STORY_TRANSLATIONS_TABLE_DELETE_TRANSLATION_CONFIRMATION
          }
          buttonMessage={
            MANAGE_STORY_TRANSLATIONS_TABLE_DELETE_TRANSLATION_BUTTON
          }
        />
      )}
    </Flex>
  );
};

export default ManageStoryTranslationPage;
