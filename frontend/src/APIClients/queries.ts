import { DocumentNode, gql } from "@apollo/client";

// Stories
export const GET_STORY_CONTENTS = (id: number) =>
  gql`
      query {
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
      contents {
        id
        lineIndex
        content
      }
    }
    storyTranslationById(id: ${storyTranslationId}) {
      translationContents {
        id
        lineIndex
        content: translationContent
      },
      numTranslatedLines
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
            query {
              storyTranslationsByUser(
                userId: ${userId},
                translator: ${isTranslator},
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
  }

  return result as QueryInformation;
};
