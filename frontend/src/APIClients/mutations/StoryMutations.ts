import { gql } from "@apollo/client";

// ASK:::
// How are tehse parameters passed in?
export const UPDATE_STORY_TRANSLATION_CONTENTS = gql`
  mutation UpdateStoryTranslationContents(
    $storyTranslationContents: [StoryTranslationContentRequestDTO]
  ) {
    updateStoryTranslationContents(
      storyTranslationContents: $storyTranslationContents
    ) {
      story {
        id
      }
    }
  }
`;

export const UPDATE_STORY_TRANSLATION_CONTENT_STATUS = () => gql`
  mutation UpdateStoryTranslationContent(
    $story_translation_id: Int!
    $status: String!
  ) {
    updateStoryTranslationContentStatus(
      story_translation_id: $story_translation_id
      status: $status
    ) {
      story {
        id
      }
    }
  }
`;

export const CREATE_TRANSLATION = gql`
  mutation CreateStoryTranslation(
    $storyTranslationData: CreateStoryTranslationRequestDTO!
  ) {
    createStoryTranslation(storyTranslationData: $storyTranslationData) {
      story {
        id
      }
    }
  }
`;
export type CreateTranslationResponse = {
  story: {
    id: number;
  };
};

export const ASSIGN_REVIEWER = gql`
  mutation AssignUserAsReviewer($storyTranslationId: ID!, $userId: ID!) {
    assignUserAsReviewer(
      storyTranslationId: $storyTranslationId
      userId: $userId
    ) {
      ok
    }
  }
`;
export type AssignReviewerResponse = { ok: boolean };
