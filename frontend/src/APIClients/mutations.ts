import { gql } from "@apollo/client";

// Auth
export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      firstName
      lastName
      email
      role
      approvedLanguages
      accessToken
      refreshToken
    }
  }
`;

export const LOGIN_WITH_GOOGLE = gql`
  mutation LoginWithGoogle($tokenId: String!) {
    loginWithGoogle(tokenId: $tokenId) {
      id
      firstName
      lastName
      email
      role
      approvedLanguages
      accessToken
      refreshToken
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout($userId: ID!) {
    logout(userId: $userId) {
      ok
    }
  }
`;

export interface LogoutResponse {
  ok: boolean;
}

export const REFRESH = gql`
  mutation Refresh {
    refresh {
      accessToken
      refreshToken
      ok
    }
  }
`;

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  ok: boolean;
}

export const RESET_PASSWORD = gql`
  mutation ResetPassword($email: String!) {
    resetPassword(email: $email) {
      ok
    }
  }
`;

export interface ResetPasswordResponse {
  ok: boolean;
}

export const SIGNUP = gql`
  mutation SignUp(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    signup(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    ) {
      id
      firstName
      lastName
      email
      role
      accessToken
      refreshToken
    }
  }
`;

// Stories
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
export type CreateTranslation = {
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
export type AssignReviewer = { ok: boolean };
