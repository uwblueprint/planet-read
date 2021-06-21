import React, { useContext, useState } from "react";
import { DocumentNode, gql, useQuery } from "@apollo/client";
import StoryList from "../story/StoryList";
import { StoryCardProps } from "../story/StoryCard";
import { Role } from "../../constants/Enums";
import AuthContext from "../../contexts/AuthContext";

export enum HomePageDisplayState {
  MyWork,
  Browse,
}

type QueryInformation = {
  fieldName: string;
  string: DocumentNode;
};

const HomePage = () => {
  // how do private methods exist?
  const buildHomePageStoriesQuery = (
    display: HomePageDisplayState,
    translationLanguage: string,
    role: Role,
    level: number,
    userId: number,
  ): QueryInformation => {
    if (role === Role.Translator && display === HomePageDisplayState.Browse) {
      return {
        fieldName: "storiesAvailableForTranslation",
        string: gql`
          query {
            storiesAvailableForTranslation(
              language: "${translationLanguage}",
              level: ${level}
            ) {
              storyId: id
              title
              description
              youtubeLink
              level
            }
          }
        `,
      };
    }

    if (role === Role.Reviewer && display === HomePageDisplayState.Browse) {
      // TODO: real query DNE yet
      return {
        fieldName: "storyTranslationsAvailableForReview",
        string: gql`
          query {
            storyTranslationsAvailableForReview(
              language: "${translationLanguage}",
              level: ${level}
            ) {
              storyId
              storyTranslationId
              title
              description
              youtubeLink
              level
            }
          }
        `,
      };
    }

    return {
      fieldName: "storyTranslationsByUser",
      string: gql`
        query {
          storyTranslationsByUser(
            userId: ${userId},
            translator: ${role === Role.Translator}
          ) {
            storyId
            storyTranslationId
            title
            description
            youtubeLink
            level
          }
        }
      `,
    };
  };

  const [displayState, setDisplayState] = useState<HomePageDisplayState>(
    HomePageDisplayState.MyWork,
  );
  const [translationLanguage, setTranslationLanguage] = useState<string>(
    "RUSSIAN",
  );
  const [role, setRole] = useState<Role>(Role.Translator);
  const [maxLevel, setMaxLevel] = useState<number>(1);
  const [stories, setStories] = useState<StoryCardProps[] | null>(null);

  const { authenticatedUser } = useContext(AuthContext);

  // dummy setting to avoid the unused vars error :(
  if (authenticatedUser == null) {
    setDisplayState(HomePageDisplayState.MyWork);
    setTranslationLanguage("ENGLISH");
    setRole(Role.Translator);
    setMaxLevel(2);
  }

  const query = buildHomePageStoriesQuery(
    displayState,
    translationLanguage,
    role,
    maxLevel,
    +authenticatedUser!!.id,
  );

  useQuery(query.string, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      // Assumes independent queries (query will never include two sub-queries)
      setStories(data[query.fieldName]);
    },
  });

  return (
    <div>
      <h1>Header Bar - Stories</h1>
      <div id="homepage-display-state-toggle">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setDisplayState(HomePageDisplayState.MyWork)}
        >
          My Work
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setDisplayState(HomePageDisplayState.Browse)}
        >
          Browse Stories
        </button>
      </div>
      <StoryList stories={stories} />
    </div>
  );
};

export default HomePage;
