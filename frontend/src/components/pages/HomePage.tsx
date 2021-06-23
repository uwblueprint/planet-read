import React, { useContext, useState } from "react";
import { DocumentNode, gql, useQuery } from "@apollo/client";
import StoryList from "../story/StoryList";
import { StoryCardProps } from "../story/StoryCard";
import { Role } from "../../constants/Enums";
import AuthContext from "../../contexts/AuthContext";
import ToggleButton from "../navigation/ToggleButton";
import Header from "../navigation/Header";
import "./HomePage.css";

type QueryInformation = {
  fieldName: string;
  string: DocumentNode;
};

const HomePage = () => {
  const STORY_FIELDS = `
  title
  description
  youtubeLink
  level
  `;

  const buildHomePageStoriesQuery = (
    displayMyStories: boolean,
    translationLanguage: string,
    role: Role,
    level: number,
    userId: number,
  ): QueryInformation => {
    let result = {};

    if (role === Role.Translator && !displayMyStories) {
      result = {
        fieldName: "storiesAvailableForTranslation",
        string: gql`
          query {
            storiesAvailableForTranslation(
              language: "${translationLanguage}",
              level: ${level}
            ) {
              storyId: id
              ${STORY_FIELDS}
            }
          }
        `,
      };
    } else if (role === Role.Reviewer && !displayMyStories) {
      result = {
        fieldName: "storyTranslationsAvailableForReview",
        string: gql`
          query {
            storyTranslationsAvailableForReview(
              language: "${translationLanguage}",
              level: ${level}
            ) {
              storyId
              storyTranslationId
              ${STORY_FIELDS}
            }
          }
        `,
      };
    } else if (displayMyStories) {
      result = {
        fieldName: "storyTranslationsByUser",
        string: gql`
          query {
            storyTranslationsByUser(
              userId: ${userId},
              translator: ${role === Role.Translator}
            ) {
              storyId
              storyTranslationId
              ${STORY_FIELDS}
            }
          }
        `,
      };
    }

    return result as QueryInformation;
  };

  const [displayMyStories, setDisplayMyStories] = useState<boolean>(true);
  const [translationLanguage] = useState<string>("RUSSIAN");
  const [role] = useState<Role>(Role.Translator);
  const [maxLevel] = useState<number>(1);
  const [stories, setStories] = useState<StoryCardProps[] | null>(null);

  const { authenticatedUser } = useContext(AuthContext);

  const query = buildHomePageStoriesQuery(
    displayMyStories,
    translationLanguage,
    role,
    maxLevel,
    +authenticatedUser!!.id,
  );

  useQuery(query.string, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => setStories(data[query.fieldName]),
    // Assumes independent queries (query will never include two sub-queries)
  });

  return (
    <div>
      <Header currentPageTitle="Stories" />
      <div id="homepage-stories-display">
        <div id="homepage-display-state-toggle-section">
          <ToggleButton
            currentState={displayMyStories}
            trueStateName="My Work"
            falseStateName="Browse Stories"
            onToggle={setDisplayMyStories}
          />
        </div>
        <StoryList stories={stories} />
      </div>
    </div>
  );
};

export default HomePage;
