import React, { useContext, useState } from "react";
import { DocumentNode, gql, useQuery } from "@apollo/client";
import Filter from "../homepage/Filter";
import StoryList from "../homepage/StoryList";
import { StoryCardProps } from "../homepage/StoryCard";
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
    language: string,
    isTranslator: boolean,
    level: number,
    userId: number,
  ): QueryInformation => {
    let result = {};

    if (isTranslator && !displayMyStories) {
      result = {
        fieldName: "storiesAvailableForTranslation",
        string: gql`
          query {
            storiesAvailableForTranslation(
              language: "${language}",
              level: ${level}
            ) {
              storyId: id
              ${STORY_FIELDS}
            }
          }
        `,
      };
    } else if (!isTranslator && !displayMyStories) {
      result = {
        fieldName: "storyTranslationsAvailableForReview",
        string: gql`
          query {
            storyTranslationsAvailableForReview(
              language: "${language}",
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
              translator: ${isTranslator},
              language: "${language}",
              level: ${level}
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

  const { authenticatedUser } = useContext(AuthContext);

  const approvedLanguages = JSON.parse(
    authenticatedUser!!.approvedLanguages.replace(/'/g, '"'),
  );

  const [displayMyStories, setDisplayMyStories] = useState<boolean>(true);
  const [language, setLanguage] = useState<string>(
    Object.keys(approvedLanguages)[0],
  );
  const [isTranslator, setIsTranslator] = useState<boolean>(true);
  const [level, setLevel] = useState<number>(approvedLanguages[language]);
  const [stories, setStories] = useState<StoryCardProps[] | null>(null);

  const query = buildHomePageStoriesQuery(
    displayMyStories,
    language,
    isTranslator,
    level,
    +authenticatedUser!!.id,
  );

  useQuery(query.string, {
    fetchPolicy: "cache-and-network",
    // Assumes independent queries (query will never include two sub-queries)
    onCompleted: (data) => setStories(data[query.fieldName]),
  });
  return (
    <div>
      <Header currentPageTitle="Stories" />
      <div id="homepage-body">
        <Filter
          approvedLanguages={approvedLanguages}
          level={level}
          setLevel={setLevel}
          language={language}
          setLanguage={setLanguage}
          role={isTranslator}
          setRole={setIsTranslator}
        />
        <div id="homepage-stories-display">
          <div id="homepage-display-state-toggle-section">
            <ToggleButton
              leftStateIsSelected={displayMyStories}
              leftStateLabel="My Work"
              rightStateLabel="Browse Stories"
              onToggle={setDisplayMyStories}
            />
          </div>
          <StoryList
            stories={stories}
            language={language}
            displayMyStories={displayMyStories}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
