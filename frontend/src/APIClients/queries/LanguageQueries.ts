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
