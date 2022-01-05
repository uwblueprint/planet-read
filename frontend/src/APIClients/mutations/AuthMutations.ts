import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      firstName
      lastName
      email
      role
      approvedLanguagesTranslation
      approvedLanguagesReview
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
      approvedLanguagesTranslation
      approvedLanguagesReview
      accessToken
      refreshToken
    }
  }
`;

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
