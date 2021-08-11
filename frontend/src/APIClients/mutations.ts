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
  mutation loginWithGoogle($tokenId: String!) {
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

// Stories
// TODO: move mutation gql strings here
