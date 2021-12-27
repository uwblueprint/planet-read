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
  resume: number;
  approvedLanguagesTranslation: string;
  approvedLanguagesReview: string;
} | null;

export const GET_USER = (id: number) =>
  gql`
      query GetUser {
        userById(
          id: ${id}
        ) {
          ${USER_FIELDS}
        }
      }
  `;

export const buildUsersQuery = (
  isTranslators: boolean,
  language?: string,
  level?: number,
  nameOrEmail?: string,
) => {
  let queryParams = language ? `language: "${language}", ` : "";
  queryParams += level ? `level: ${level}, ` : "";
  queryParams += nameOrEmail ? `nameOrEmail: "${nameOrEmail}", ` : "";

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
