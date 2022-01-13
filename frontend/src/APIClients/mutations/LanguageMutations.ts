import { gql } from "@apollo/client";

export type Languages = string[];

export const ADD_LANGUAGE = gql`
  mutation AddLanguage($language: String!, $isRtl: Boolean!) {
    addLanguage(language: $language, isRtl: $isRtl) {
      ok
    }
  }
`;

export type AddLanguageResponse = {
  ok: boolean;
};
