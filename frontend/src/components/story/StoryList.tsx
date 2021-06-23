import React from "react";
import StoryCard, { StoryCardProps } from "./StoryCard";
import "./StoryList.css";

export type StoryListProps = {
  stories: StoryCardProps[] | null;
};

const NoStoriesFoundCard = () => {
  return (
    <div className="no-stories-found-card">
      <h1>No Stories Found</h1>
      <p>Please check access permissions.</p>
    </div>
  );
};

const StoryList = ({ stories }: StoryListProps) => {
  const createCardId = (storyId: number, storyTranslationId?: number) =>
    `story-${storyId}${
      storyTranslationId ? `-translation-${storyTranslationId}` : ``
    }-card`;

  const storyCards = stories?.map(
    ({
      storyId,
      storyTranslationId,
      title,
      description,
      youtubeLink,
      level,
    }: StoryCardProps) => (
      <StoryCard
        key={createCardId(storyId, storyTranslationId)}
        storyId={storyId}
        storyTranslationId={storyTranslationId}
        title={title}
        description={description}
        youtubeLink={youtubeLink}
        level={level}
        language="HINDI"
      />
    ),
  );

  if (stories == null || stories.length === 0) {
    return <NoStoriesFoundCard />;
  }

  return <div className="story-list">{storyCards}</div>;
};

export default StoryList;
