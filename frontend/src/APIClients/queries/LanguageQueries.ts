import { gql } from "@apollo/client";

const GET_LANGUAGES = () =>
  gql`
    query GetLanguages {
      languages
    }
  `;

export default GET_LANGUAGES;
