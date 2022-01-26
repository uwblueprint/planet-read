import { gql } from "@apollo/client";

export const SOFT_DELETE_USER = gql`
  mutation SoftDeleteUser($id: Int!) {
    softDeleteUser(id: $id) {
      ok
    }
  }
`;
export type SoftDeleteUserResponse = { ok: boolean };

export const UPDATE_USER_APPROVED_LANGUAGES = gql`
  mutation UpdateUserApprovedLanguages(
    $userId: ID!
    $isTranslate: Boolean!
    $language: String!
    $level: Int!
  ) {
    updateUserApprovedLanguage(
      userId: $userId
      isTranslate: $isTranslate
      language: $language
      level: $level
    ) {
      user {
        id
      }
    }
  }
`;

export type UpdateUserApprovedLanguagesResponse = {
  user: {
    id: number;
  };
};

export const UPDATE_ME = gql`
  mutation Updateme($userData: UpdateUserDTO!, $resume: Upload) {
    updateMe(user: $userData, resume: $resume) {
      user {
        id
      }
    }
  }
`;

export type UpdateMeResponse = {
  user: {
    id: number;
  };
};

export const COMPLETE_SIGN_UP = gql`
  mutation CompleteSignUp(
    $userData: UpdateUserDTO!
    $userId: ID!
    $level: Int!
    $language: String!
    $wantsReviewer: Boolean!
    $resume: Upload
  ) {
    updateMe(user: $userData, resume: $resume) {
      user {
        id
      }
    }

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

export type CompleteSignUpResponse = {
  user: {
    id: number;
  };
  story: {
    id: number;
  };
};
