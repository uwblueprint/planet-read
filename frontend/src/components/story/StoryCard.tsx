import React from "react";
import { useHistory } from "react-router-dom";
import Tag from "./Tag";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import "./StoryCard.css";

export type StoryCardProps = {
  id: number;
  title: string;
  description: string;
  youtubeLink: string;
  level: number;
  isStory: boolean;
};

const StoryCard = ({
  id,
  title,
  description,
  youtubeLink,
  level,
  isStory,
}: StoryCardProps) => {
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
  const history = useHistory();
  const navigateTo = () => history.push("/review/id");
  return (
    <div id={`story-${id}`} className="story-card">
      <iframe
        className="youtube-thumbnail"
        src={embedLink(youtubeLink)}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <div className="story-card-details">
        <div className="story-card-top">
          <p className="story-card-title">{title}</p>
          <div className="story-card-tags">
            <Tag displayText={`level ${level}`} />
            <Tag displayText="language needed" />
          </div>
        </div>
        <p className="story-card-description">{description}</p>
      </div>
      <div className="story-card-actions">
        <PrimaryButton
          onClick={navigateTo}
          displayText={isStory ? "translate book" : "review book"}
        />
        <SecondaryButton onClick={navigateTo} displayText="preview book" />
      </div>
    </div>
  );
};

export default StoryCard;
