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
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { embedLink } from "../../utils/Utils";
import {
  buildStoryTranslationsQuery,
  GET_STORY,
  Story,
  StoryTranslation,
} from "../../APIClients/queries/StoryQueries";
import {
  UPDATE_STORY,
  UpdateStoryResponse,
  SOFT_DELETE_STORY,
  SoftDeleteStoryResponse,
} from "../../APIClients/mutations/StoryMutations";
import Header from "../navigation/Header";
import ConfirmationModal from "../utils/ConfirmationModal";
import {
  DELETE_STORY_BUTTON,
  DELETE_STORY_CONFIRMATION,
} from "../../utils/Copy";
import StoryTranslationsTable from "../admin/StoryTranslationsTable";
import usePagination from "../../utils/hooks/usePagination";

type ManageStoryPageProps = {
  storyIdParam: string;
  storyTranslationIdParam: string;
};

const ITEMS_PER_PAGE = 10;

const ManageStoryPage = () => {
  const { storyIdParam } = useParams<ManageStoryPageProps>();

  const [title, setTitle] = useState<string>("");
  const [level, setLevel] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [youtubeLink, setYoutubeLink] = useState<string>("");
  const [tempTitle, setTempTitle] = useState<string>("");
  const [tempLevel, setTempLevel] = useState<number>(0);
  const [tempDescription, setTempDescription] = useState<string>("");
  const [tempYoutubeLink, setTempYoutubeLink] = useState<string>("");

  const [confirmDeleteStory, setConfirmDeleteStory] = useState(false);

  const history = useHistory();

  const query = buildStoryTranslationsQuery(
    parseInt(storyIdParam || "", 10) || 0,
  );

  const { pageResults, paginator } = usePagination<StoryTranslation>(
    query.string,
    query.fieldName,
    ITEMS_PER_PAGE,
  );

  useQuery(GET_STORY(parseInt(storyIdParam, 10)), {
    fetchPolicy: "cache-and-network",
    onCompleted: (data: { storyById: Story; errors: any }) => {
      setTitle(data.storyById.title);
      setLevel(data.storyById.level);
      setDescription(data.storyById.description);
      setYoutubeLink(data.storyById.youtubeLink);
      setTempTitle(data.storyById.title);
      setTempLevel(data.storyById.level);
      setTempDescription(data.storyById.description);
      setTempYoutubeLink(data.storyById.youtubeLink);
    },
    onError: () => {
      history.push("/404");
    },
  });

  const [updateStory] = useMutation<{
    response: UpdateStoryResponse;
  }>(UPDATE_STORY);

  const [softDeleteStory] = useMutation<{
    softDeleteStory: SoftDeleteStoryResponse;
  }>(SOFT_DELETE_STORY);

  const closeModal = () => {
    setConfirmDeleteStory(false);
  };

  const openModal = () => {
    setConfirmDeleteStory(true);
  };

  const callUpdateStoryMutation = async () => {
    if (
      title !== tempTitle ||
      description !== tempDescription ||
      youtubeLink !== tempYoutubeLink ||
      level !== tempLevel
    ) {
      await updateStory({
        variables: {
          storyId: storyIdParam,
          title: tempTitle,
          level: tempLevel,
          description: tempDescription,
          youtubeLink: tempYoutubeLink,
        },
      });
      window.location.reload();
    }
  };

  const callSoftDeleteStoryMutation = async () => {
    try {
      await softDeleteStory({
        variables: {
          id: parseInt(storyIdParam, 10),
        },
      });
      window.location.href = "#/?tab=1";
    } catch (error) {
      // eslint-disable-next-line no-alert
      window.alert(`Error occurred, please try again. Error: ${error}`);
    }
  };

  const cancelChanges = () => {
    setTempTitle(title);
    setTempDescription(description);
    setTempYoutubeLink(youtubeLink);
  };

  return (
    <Flex direction="column" height="100vh" justifyContent="space-between">
      <Box>
        <Header title="Manage Story" />
        <Flex direction="column" padding="40px">
          <Flex direction="row" flex={1}>
            <Flex direction="column" width="50%">
              <FormControl id="email">
                <Heading size="sm" marginBottom="18px">
                  Title
                </Heading>
                <Input
                  onChange={(event) => setTempTitle(event.target.value)}
                  type="title"
                  value={tempTitle || ""}
                />
                <Heading size="sm" marginTop="24px" marginBottom="18px">
                  Level
                </Heading>
                <Slider
                  value={tempLevel}
                  min={1}
                  max={4}
                  step={1}
                  marginLeft="20px"
                  size="lg"
                  width="79%"
                  onChange={(newLevel: number) => setTempLevel(newLevel)}
                >
                  <SliderTrack height="6px">
                    <SliderFilledTrack bg="blue.500" />
                  </SliderTrack>
                  <SliderThumb boxShadow="0px 0px 3px black" />
                  {[1, 2, 3, 4].map((val) => (
                    <SliderMark
                      key={val}
                      value={val}
                      height="6px"
                      width="4px"
                      marginTop="-3px"
                      bg={
                        level >= val
                          ? "#64A1CD" // light blue
                          : "#ECF1F4" // light gray
                      }
                    >
                      <Text
                        margin="10px 0px 0px -2px"
                        fontWeight={level === val ? "bold" : "normal"}
                      >
                        {val}
                      </Text>
                    </SliderMark>
                  ))}
                </Slider>
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
            </Flex>
            <Box
              css={{
                borderRadius: "8px",
                marginTop: "40px",
                marginLeft: "40px",
                MozBorderRadius: "8px",
                overflow: "hidden",
                webkitBorderRadius: "8px",
                width: "25%",
              }}
            >
              <iframe
                height="100%"
                width="100%"
                src={embedLink(youtubeLink)}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </Box>
          </Flex>
          <Heading size="md" marginTop="48px" marginBottom="18px">
            Story Translations
          </Heading>
          <StoryTranslationsTable
            loading // set to true to prevent empty table dialog from showing
            storyTranslationSlice={pageResults}
            paginator={paginator}
            filters={[() => {}]}
            width="100%"
          />
          <Heading size="sm">Delete Story</Heading>
          <Text>
            Permanently delete this story and all story translations associated
            with it.
          </Text>
          <Button
            colorScheme="red"
            margin="10px 0px"
            variant="outline"
            width="250px"
            onClick={() => openModal()}
          >
            Delete Story
          </Button>
        </Flex>
      </Box>

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
            isDisabled={
              title === tempTitle &&
              description === tempDescription &&
              youtubeLink === tempYoutubeLink &&
              level === tempLevel
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
              youtubeLink === tempYoutubeLink &&
              level === tempLevel
            }
            onClick={callUpdateStoryMutation}
          >
            Save Changes
          </Button>
        </Box>
      </Flex>
      {confirmDeleteStory && (
        <ConfirmationModal
          confirmation={confirmDeleteStory}
          onClose={closeModal}
          onConfirmationClick={() => callSoftDeleteStoryMutation()}
          confirmationMessage={DELETE_STORY_CONFIRMATION}
          buttonMessage={DELETE_STORY_BUTTON}
        />
      )}
    </Flex>
  );
};

export default ManageStoryPage;
