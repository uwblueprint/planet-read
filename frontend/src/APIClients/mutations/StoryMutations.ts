import { gql } from "@apollo/client";
import { StoryTranslation, STORY_FIELDS } from "../queries/StoryQueries";

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
        storyTranslationId: id
        storyId
        translatorId
        reviewerId
        language
        stage
        translatorLastActivity
        reviewerLastActivity
        ${STORY_FIELDS}
      }
    }
  }
`;

export type CreateTranslationResponse = {
  story: StoryTranslation;
};

export const ASSIGN_REVIEWER = gql`
  mutation AssignUserAsReviewer($storyTranslationId: ID!, $userId: ID!) {
    assignUserAsReviewer(
      storyTranslationId: $storyTranslationId
      userId: $userId
    ) {
      story {
        storyTranslationId: id
        storyId
        translatorId
        reviewerId
        language
        stage
        translatorLastActivity
        reviewerLastActivity
        ${STORY_FIELDS}
      }
    }
  }
`;

export type AssignReviewerResponse = {
  story: StoryTranslation;
};

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
    $level: Int!
    $description: String!
    $youtubeLink: String!
  ) {
    updateStory(
      storyId: $storyId
      title: $title
      level: $level
      description: $description
      youtubeLink: $youtubeLink
    ) {
      ok
    }
  }
`;
export type UpdateStoryResponse = { ok: boolean };

export const CREATE_TRANSLATION_TEST = gql`
  mutation UpdateStory(
    $userId: ID!
    $level: Int!
    $language: String!
    $wantsReviewer: Boolean!
  ) {
    createStoryTranslationTest(
      userId: $userId
      level: $level
      language: $language
      wantsReviewer: $wantsReviewer
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

export const FINISH_GRADING_STORY_TRANSLATION = gql`
  mutation FinishGradingStoryTranslation(
    $storyTranslationTestId: Int!
    $testFeedback: String
    $testResult: JSONString!
  ) {
    finishGradingStoryTranslation(
      storyTranslationTestId: $storyTranslationTestId
      testFeedback: $testFeedback
      testResult: $testResult
    ) {
      ok
      storyTranslation {
        id
      }
    }
  }
`;

export type FinishGradingStoryTranslationResponse = {
  ok: boolean;
  storyTranslation: {
    id: number;
  };
};

export const SOFT_DELETE_STORY = gql`
  mutation SoftDeleteStory($id: Int!) {
    softDeleteStory(id: $id) {
      ok
    }
  }
`;

export type SoftDeleteStoryResponse = { ok: boolean };

export const IMPORT_STORY = gql`
  mutation ImportStory($storyFile: Upload!, $storyDetails: StoryRequestDTO!) {
    importStory(storyFile: $storyFile, storyDetails: $storyDetails) {
      story {
        id
      }
    }
  }
`;

export type ImportStoryResponse = {
  story: {
    id: number;
  };
};

export const PROCESS_STORY = gql`
  mutation ProcessStory($storyFile: Upload!) {
    processStory(storyFile: $storyFile) {
      storyContents
    }
  }
`;

export type ProcessStoryResponse = {
  storyContents: string[];
};
