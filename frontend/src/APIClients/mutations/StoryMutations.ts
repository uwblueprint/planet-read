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
    $storyTranslationContentId: Int!
    $status: String!
  ) {
    updateStoryTranslationContentStatus(
      storyTranslationContentId: $storyTranslationContentId
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

export const APPROVE_ALL_STORY_TRANSLATION_CONTENT = gql`
  mutation ApproveAllStoryTranslationContent($storyTranslationId: Int!) {
    approveAllStoryTranslationContent(storyTranslationId: $storyTranslationId) {
      ok
    }
  }
`;

export type ApproveAllStoryTranslationContentResponse = { ok: boolean };

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

export const UPDATE_STORY_TRANSLATION_STAGE = gql`
  mutation UpdateStoryTranslationStage(
    $storyTranslationData: UpdateStoryTranslationStageRequestDTO!
  ) {
    updateStoryTranslationStage(storyTranslationData: $storyTranslationData) {
      ok
    }
  }
`;
export type UpdateStoryTranslationStageResponse = { ok: boolean };

export const SOFT_DELETE_STORY_TRANSLATION = gql`
  mutation SoftDeleteStoryTranslation($id: Int!) {
    softDeleteStoryTranslation(id: $id) {
      ok
    }
  }
`;
export type SoftDeleteStoryTranslationResponse = { ok: boolean };
