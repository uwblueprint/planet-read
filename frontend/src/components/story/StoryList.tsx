import React from "react";
import StoryCard, { StoryCardProps } from "./StoryCard";

export type StoryListProps = {
  stories: StoryCardProps[] | null;
};

const StoryList = ({ stories }: StoryListProps) => {
  const storyCards = stories?.map((story: StoryCardProps) => (
    <StoryCard
      key={`story-card-key-${story.id}`}
      id={story.id}
      title={story.title}
      description={story.description}
      youtubeLink={story.youtubeLink}
      level={story.level}
      // isStory={story.isStory}
      isStory
    />
  ));

  return <div className="story-list">{storyCards}</div>;
};

export default StoryList;
