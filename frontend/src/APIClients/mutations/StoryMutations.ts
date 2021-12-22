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

// TODO: update mutation to retrieve story translation fields
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

// TODO: update mutation to retrieve story translation fields
export type AssignReviewerResponse = { ok: boolean };

export const UNASSIGN_REVIEWER = gql`
  mutation UnassignReviewer($storyTranslationId: ID!) {
    removeReviewerFromStoryTranslation(
      storyTranslationId: $storyTranslationId
    ) {
      ok
    }
  }
`;

export type UnassignReviewerResponse = { ok: boolean };

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

export const UPDATE_STORY = gql`
  mutation UpdateStory(
    $storyId: Int!
    $title: String!
    $description: String!
    $youtubeLink: String!
  ) {
    updateStory(
      storyId: $storyId
      title: $title
      description: $description
      youtubeLink: $youtubeLink
    ) {
      ok
    }
  }
`;
export type UpdateStoryResponse = { ok: boolean };

export const CREATE_TRANSLATION_TEST = gql`
  mutation UpdateStory($userId: ID!, $level: Int!, $language: String!) {
    createStoryTranslationTest(
      userId: $userId
      level: $level
      language: $language
    ) {
      story {
        id
      }
    }
  }
`;
export type CreateTranslationTestResponse = {
  story: {
    id: number;
  };
};
