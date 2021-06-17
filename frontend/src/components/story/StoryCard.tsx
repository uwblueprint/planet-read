import React from "react";
import Tag from "./Tag";
import "./StoryCard.css";

export type StoryCardProps = {
  id: number;
  title: string;
  description: string;
  youtubeLink: string;
  level: number;
};

const StoryCard = ({
  id,
  title,
  description,
  youtubeLink,
  level,
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
          <Tag displayText={`level ${level}`} />
          <Tag displayText="language needed" />
        </div>
        <p className="story-card-description">{description}</p>
      </div>
      <div className="story-card-actions" />
    </div>
  );
};

export default StoryCard;
