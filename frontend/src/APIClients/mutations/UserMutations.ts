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
  mutation UpdateMe($userData: UpdateUserDTO!, $resume: Upload) {
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
