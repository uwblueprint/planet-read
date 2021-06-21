import React from "react";
import StoryCard, { StoryCardProps } from "./StoryCard";

export type StoryListProps = {
  stories: StoryCardProps[] | null;
};

const NoStoriesFoundCard = () => {
  return (
    <div className="no-stories-found-card">
      <p>No :(</p>
    </div>
  );
};

const StoryList = ({ stories }: StoryListProps) => {
  /**
   * I think this will recalculate everytime we re-render. Is this avoidable? Is having better handled in HomePage?
   * Also is this extra? Is there a different key value that will always be unique?
   * storyId won't be unique unless there is a guarantee that a language will always be set
   *  (otherwise can multiple translations per story)
   * */

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
