import { gql } from "@apollo/client";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  approvedLanguagesTranslation: string;
  approvedLanguagesReview: string;
} | null;

export const buildUsersQuery = () => {
  // TODO: Modify when users query is modified
  return {
    fieldName: "users",
    string: gql`
      query Users {
        users {
          id
          firstName
          lastName
          role
          email
          resume
          profilePic
          approvedLanguagesTranslation
          approvedLanguagesReview
        }
      }
    `,
  };
};
