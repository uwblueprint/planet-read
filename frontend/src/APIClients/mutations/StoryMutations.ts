import { gql } from "@apollo/client";

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

export const UPDATE_STORY_TRANSLATION_CONTENT_STATUS = gql`
  mutation UpdateStoryTranslationContent(
    $storyTranslationId: Int!
    $status: String!
  ) {
    updateStoryTranslationContentStatus(
      storyTranslationId: $storyTranslationId
      status: $status
    ) {
      story {
        id
      }
    }
  }
`;

export const UPDATE_ALL_STORY_TRANSLATION_CONTENT_STATUS = gql`
  mutation UpdateAllStoryTranslationContent(
    $storyTranslationIds: [Int!]
    $status: String!
  ) {
    updateAllStoryTranslationContentStatus(
      storyTranslationIds: $storyTranslationId
      status: $status
    ) {
      story {
        id
      }
    }
  }
`;

export type UpdateStoryTranslationContentStatusResponse = {
  story: {
    id: number;
  };
};

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
