import { DocumentNode, gql } from "@apollo/client";

export const STORY_FIELDS = `
    title
    description
    youtubeLink
    level
    `;

export type Story = {
  title: string;
  description: string;
  youtubeLink: string;
  level: number;
};

export const GET_STORY = (id: number) =>
  gql`
      query GetStory {
        storyById(
          id: ${id}
        ) {
          ${STORY_FIELDS}
        }
      }
    `;

export const GET_STORY_TRANSLATION = (id: number) =>
  gql`
      query GetStoryTranslation {
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
          numContentLines
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
      isTest
      translatorId
      translatorName
      reviewerId
      reviewerName
    }
  }
`;

export type QueryInformation = {
  fieldName: string;
  string: DocumentNode;
};

export const buildHomePageStoriesQuery = (
  displayMyStories: boolean,
  displayMyTests: boolean,
  language: string,
  isTranslator: boolean,
  level: number,
  userId: number,
): QueryInformation => {
  let result = {};

  if (displayMyTests) {
    result = {
      fieldName: "storyTranslationTests",
      string: gql`
            query StoryTranslationTests {
              storyTranslationTests (stage: "TRANSLATE")
              {
                storyTranslationId: id
                storyId
                translatorId
                language
                ${STORY_FIELDS}
              }
            }
        `,
    };
  } else if (isTranslator && !displayMyStories) {
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

export const buildAssignStoryQuery = (
  isTranslator: boolean,
  language: string,
  level: number,
  userId: number,
): QueryInformation => {
  const result = isTranslator
    ? {
        fieldName: "storiesAvailableForTranslation",
        string: gql`
          query StoriesAvailableForTranslation {
            storiesAvailableForTranslation(
              language: "${language}",
              level: ${level},
              userId: ${userId}
            ) {
              storyId: id
              ${STORY_FIELDS}
            }
          }
        `,
      }
    : {
        fieldName: "storyTranslationsAvailableForReview",
        string: gql`
          query StoriesAvailableForTranslation {
            storyTranslationsAvailableForReview(
              language: "${language}",
              level: ${level},
              userId: ${userId}
            ) {
              storyId
              storyTranslationId: id
              ${STORY_FIELDS}
            }
          }
        `,
      };
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
  translatorLastActivity: string | null;
  reviewerLastActivity: string | null;
};

export const buildStoryTranslationsQuery = (
  storyId?: number,
  language?: string,
  level?: number,
  stage?: string,
  storyTitle?: string,
) => {
  let queryParams = language ? `language: "${language}", ` : "";
  queryParams += level ? `level: ${level}, ` : "";
  queryParams += stage ? `stage: "${stage}", ` : "";
  queryParams += storyTitle ? `storyTitle: "${storyTitle}", ` : "";
  queryParams += storyId ? `storyId: ${storyId}, ` : "";

  return {
    fieldName: "storyTranslations",
    string: gql`
      query StoryTranslations(
        $first: Int
        $cursor: String
      ) {
        storyTranslations(
          ${queryParams}
          first: $first
          after: $cursor
        ) {
          totalCount
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
              translatorLastActivity
              reviewerLastActivity
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

export const GET_STORY_TRANSLATIONS_BY_USER = (userId: number) => gql`
  query GetStoryTranslationsByUser{
    storyTranslationsByUser(
      userId: ${userId},
    ) {
      storyId
      storyTranslationId: id
      translatorId
      reviewerId
      language
      ${STORY_FIELDS}
      stage
    }
  }
`;

export type StoryTestResult = {
  translate: number;
  review?: number;
};

export type StoryTranslationTest = {
  id: number;
  language: string;
  stage: string;
  translatorId: number;
  storyId: number;
  title: string;
  description: string;
  youtubeLink: string;
  level: number;
  translatorName: string;
  testGrade: number;
  testResult: StoryTestResult | null;
  testFeedback: string;
  dateSubmitted: Date;
};

export const buildStoryTranslationTestsQuery = (
  language?: string,
  level?: number,
  stage?: string,
  storyTitle?: string,
) => {
  let queryParams = language ? `language: "${language}", ` : "";
  queryParams += level ? `level: ${level}, ` : "";
  queryParams += stage ? `stage: "${stage}", ` : "";
  queryParams += storyTitle ? `storyTitle: "${storyTitle}", ` : "";
  queryParams = queryParams ? `(${queryParams})` : "";

  return {
    fieldName: "storyTranslationTests",
    string: gql`
      query StoryTranslationsTests {
        storyTranslationTests ${queryParams} {
          id
          language
          stage
          translatorId
          storyId
          title
          description
          youtubeLink
          level
          translatorName
          testGrade
          testResult
          testFeedback
          dateSubmitted
        }
      }
    `,
  };
};

export const GET_STORY_TRANSLATION_STATISTICS = gql`
  query GetStoryTranslationStatistics {
    storyTranslationStatistics {
      numTranslationsInTranslation
      numTranslationsInReview
      numTranslationsCompleted
    }
  }
`;
