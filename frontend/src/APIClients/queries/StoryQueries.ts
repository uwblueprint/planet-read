import { DocumentNode, gql } from "@apollo/client";

export const GET_STORY_TRANSLATION = (id: number) =>
  gql`
      query GetStoryTranslations {
        storyTranslationById(
          id: ${id}
        ) {
          title
          description
          youtubeLink
          level
          language
          stage
          translatorId
          translatorName
          reviewerId
          reviewerName
          numTranslatedLines
          numApprovedLines
        }
      }
    `;

export const GET_STORY_CONTENTS = (id: number) =>
  gql`
      query GetStoryContents {
        storyById(
          id: ${id}
        ) {
          contents {
            id
            lineIndex
            content
          }
        }
      }
    `;

export const GET_STORY_AND_TRANSLATION_CONTENTS = (
  storyId: number,
  storyTranslationId: number,
) => gql`
  query GetStoryAndTranslationContents{
    storyById(id: ${storyId}) {
      title
      contents {
        id
        lineIndex
        content
      }
    }
    storyTranslationById(id: ${storyTranslationId}) {
      language
      stage
      translationContents {
        id
        lineIndex
        status
        content: translationContent
      }
      numTranslatedLines
      numApprovedLines
      translatorId
      reviewerId
    }
  }
`;

export type QueryInformation = {
  fieldName: string;
  string: DocumentNode;
};

const STORY_FIELDS = `
    title
    description
    youtubeLink
    level
    `;

export const buildHomePageStoriesQuery = (
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
            query StoriesAvailableForTranslation {
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
            query StoriesAvailableForTranslation {
              storyTranslationsAvailableForReview(
                language: "${language}",
                level: ${level}
              ) {
                storyId
                storyTranslationId: id
                ${STORY_FIELDS}
              }
            }
          `,
    };
  } else if (displayMyStories) {
    result = {
      fieldName: "storyTranslationsByUser",
      string: gql`
            query StoriesAvailableForTranslation {
              storyTranslationsByUser(
                userId: ${userId},
              ) {
                storyId
                storyTranslationId: id
                translatorId
                reviewerId
                language
                ${STORY_FIELDS}
              }
            }
          `,
    };
  }

  return result as QueryInformation;
};

export type StoryTranslation = {
  storyTranslationId: number;
  language: string;
  stage: string;
  translatorId: number;
  reviewerId: number;
  storyId: number;
  title: string;
  description: string;
  youtubeLink: string;
  level: number;
  translatorName: string;
  reviewerName: string | null;
  numTranslatedLines: number;
  numApprovedLines: number;
};

export type StoryTranslationEdge = {
  cursor: string;
  node: StoryTranslation;
};

export const buildStoriesQuery = (
  language?: string,
  level?: number,
  stage?: string,
  storyTitle?: string,
) => {
  let queryParams = language ? `language: "${language}", ` : "";
  queryParams += level ? `level: ${level}, ` : "";
  queryParams += stage ? `stage: "${stage}", ` : "";
  queryParams += storyTitle ? `storyTitle: "${storyTitle}", ` : "";
  queryParams = queryParams === "" ? queryParams : `( ${queryParams} )`;

  return {
    fieldName: "storyTranslations",
    string: gql`
      query StoryTranslations {
        storyTranslations ${queryParams} {
          edges {
            cursor
            node {
              storyTranslationId
              language
              stage
              translatorId
              reviewerId
              storyId
              title
              description
              youtubeLink
              level
              translatorName
              reviewerName
              numTranslatedLines
              numApprovedLines
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    `,
  };
};
