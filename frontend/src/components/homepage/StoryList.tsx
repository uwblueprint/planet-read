import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import StoryCard, { StoryCardProps } from "./StoryCard";

export type StoryListProps = {
  stories: StoryCardProps[] | null;
  displayMyStories: boolean;
  displayMyTests: boolean;
};

const LoadingCard = () => {
  return (
    <Flex
      alignItems="center"
      border="2px solid black"
      flexDirection="column"
      margin="10px 0px 10px 0px"
      padding="20px"
    >
      <Text>Loading...</Text>
      <Text>Almost there ⌛⌛⌛</Text>
    </Flex>
  );
};

const NoStoriesFoundCardCheckAccess = () => {
  return (
    <Flex
      alignItems="center"
      border="2px solid black"
      flexDirection="column"
      margin="10px 0px 10px 0px"
      padding="20px"
    >
      <Text>No Stories Found</Text>
      <Text>Please check access permissions.</Text>
    </Flex>
  );
};

const NoStoriesFoundCard = () => {
  return (
    <Flex
      alignItems="center"
      border="2px solid black"
      flexDirection="column"
      margin="10px 0px 10px 0px"
      padding="20px"
    >
      <Text>No Stories Found</Text>
      <Text>
        You may be seeing no stories if you are a translator or reviewer on an
        active story translation for this language. <br />
        Please complete that story translation before signing up for more.
      </Text>
    </Flex>
  );
};

const StoryList = ({
  stories,
  displayMyStories,
  displayMyTests,
}: StoryListProps) => {
  const createCardId = (storyId: number, storyTranslationId?: number) =>
    `story-${storyId}${
      storyTranslationId ? `-translation-${storyTranslationId}` : ``
    }-card`;

  if (stories == null) {
    return <LoadingCard />;
  }

  if (stories.length === 0 && !displayMyStories && !displayMyTests) {
    return <NoStoriesFoundCard />;
  }

  if (stories.length === 0) {
    return <NoStoriesFoundCardCheckAccess />;
  }

  const storyCards = stories.map(
    ({
      storyId,
      storyTranslationId,
      title,
      description,
      youtubeLink,
      level,
      language,
      translatorId,
      reviewerId,
    }: StoryCardProps) => (
      <StoryCard
        key={createCardId(storyId, storyTranslationId)}
        storyId={storyId}
        storyTranslationId={storyTranslationId}
        title={title}
        description={description}
        youtubeLink={youtubeLink}
        level={level}
        language={language}
        isMyStory={displayMyStories}
        isMyTest={displayMyTests}
        translatorId={translatorId}
        reviewerId={reviewerId}
      />
    ),
  );

  return <div className="story-list">{storyCards}</div>;
};

export default StoryList;
