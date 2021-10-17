import { gql } from "@apollo/client";

const USER_FIELDS = `
  id
  firstName
  lastName
  role
  email
  resume
  profilePic
  approvedLanguagesTranslation
  approvedLanguagesReview
`;

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  approvedLanguagesTranslation: string;
  approvedLanguagesReview: string;
} | null;

export const buildUsersQuery = (
  isTranslators: boolean,
  language?: string,
  level?: number,
  nameOrEmail?: string,
) => {
  const queryParams = `
    ${language ? `language: "${language}", ` : ""} ${
    level ? `level: ${level}, ` : ""
  } ${nameOrEmail ? `nameOrEmail: "${nameOrEmail}", ` : ""}
  `;

  const queryString = gql`
    query Users {
      users( isTranslators: ${isTranslators} ${queryParams} ){
        ${USER_FIELDS}
      }
    }
  `;

  return {
    fieldName: "users",
    string: queryString,
  };
};
