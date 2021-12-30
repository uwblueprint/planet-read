import { gql } from "@apollo/client";

export type File = {
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

export const getFileQuery = {
  fieldName: "fileById",
  string: GET_FILE,
};

export const EXPORT_STORY_TRANSLATION = gql`
  query ExportStoryTranslation($id: Int!) {
    exportStoryTranslation(id: $id) {
      ext
      file
    }
  }
`;

export const exportStoryTranslationQuery = {
  fieldName: "exportStoryTranslation",
  string: EXPORT_STORY_TRANSLATION,
};
