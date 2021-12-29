import { gql } from "@apollo/client";

export type File = {
  id: number;
  file: string;
  ext: string;
};

export const GET_FILE = gql`
  query GetFile($id: Int!) {
    fileById(id: $id) {
      ext
      file
    }
  }
`;
