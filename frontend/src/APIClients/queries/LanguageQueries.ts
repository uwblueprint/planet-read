import { gql } from "@apollo/client";

export type Languages = string[];

export const GET_LANGUAGES = gql`
  query GetLanguages {
    languages
  }
`;

export const getLanguagesQuery = {
  fieldName: "getLanguages",
  string: GET_LANGUAGES,
};

export const IS_RTL = (language: string) => gql`
  query IsRtl {
    isRtl (
      language: "${language}"
    ) {
      isRtl
    }
  }
`;
