import React, { useContext } from "react";
import { gql, useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import Tag from "./Tag";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import "./StoryCard.css";

export type StoryCardProps = {
  storyId: number;
  storyTranslationId?: number;
  title: string;
  description: string;
  youtubeLink: string;
  level: number;
  language: string;
};

const StoryCard = ({
  storyId,
  storyTranslationId,
  title,
  description,
  youtubeLink,
  level,
  language,
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
    alert(errorMessage);
  };

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
  type AssignReviewer = { ok: boolean };
  const [assignUserAsReviewer] = useMutation<{
    assignUserAsReviewer: AssignReviewer;
  }>(ASSIGN_REVIEWER);
  const assignReviewer = async () => {
    try {
      const result = await assignUserAsReviewer({
        variables: { storyTranslationId, userId: +authenticatedUser!!.id },
      });
      if (result.data?.assignUserAsReviewer.ok) {
        history.push(`/review/${storyTranslationId}`);
      } else {
        handleError("Unable to assign reviewer.");
      }
    } catch (err) {
      handleError(err ?? "Error occurred, please try again.");
    }
  };

  const CREATE_TRANSLATION = gql`
    mutation createStoryTranslation(
      $storyTranslationData: CreateStoryTranslationRequestDTO!
    ) {
      createStoryTranslation(storyTranslationData: $storyTranslationData) {
        story {
          storyId
          translatorId
          language
        }
      }
    }
  `;
  type CreateTranslation = {
    story: {
      storyId: number;
      translatorId: number;
      language: string;
    };
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
      if (result.data?.createStoryTranslation.story.storyId) {
        history.push(`/translation/${storyId}`);
      } else {
        handleError("Unable to assign translator.");
      }
    } catch (err) {
      handleError(err ?? "Error occurred, please try again.");
    }
  };

  const previewBook = () => history.push("/preview");
  return (
    <div id={`story-${storyId}`} className="story-card">
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
          onClick={storyTranslationId ? assignReviewer : assignTranslator}
          displayText={storyTranslationId ? "review book" : "translate book"}
        />
        <SecondaryButton onClick={previewBook} displayText="preview book" />
      </div>
    </div>
  );
};

export default StoryCard;
