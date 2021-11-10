import { gql } from "@apollo/client";

export const SOFT_DELETE_USER = gql`
  mutation SoftDeleteUser($id: Int!) {
    softDeleteUser(id: $id) {
      ok
    }
  }
`;
export type SoftDeleteUserResponse = { ok: boolean };
