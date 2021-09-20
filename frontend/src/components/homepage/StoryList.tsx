import React from "react";
import StoryCard, { StoryCardProps } from "./StoryCard";
import "./StoryList.css";

export type StoryListProps = {
  stories: StoryCardProps[] | null;
  displayMyStories: boolean;
};

const LoadingCard = () => {
  return (
    <div className="loading-card">
      <h1>Loading...</h1>
      <p>Almost there ⌛⌛⌛</p>
    </div>
  );
};

const NoStoriesFoundCard = () => {
  return (
    <div className="no-stories-found-card">
      <h1>No Stories Found</h1>
      <p>Please check access permissions.</p>
    </div>
  );
};

const StoryList = ({ stories, displayMyStories }: StoryListProps) => {
  const createCardId = (storyId: number, storyTranslationId?: number) =>
    `story-${storyId}${
      storyTranslationId ? `-translation-${storyTranslationId}` : ``
    }-card`;

  if (stories == null) {
    return <LoadingCard />;
  }

  if (stories.length === 0) {
    return <NoStoriesFoundCard />;
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
        translatorId={translatorId}
        reviewerId={reviewerId}
      />
    ),
  );

  return <div className="story-list">{storyCards}</div>;
};

export default StoryList;
