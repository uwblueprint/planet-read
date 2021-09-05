import { gql } from "@apollo/client";
import { QueryInformation } from "./StoryQueries";

const COMMENT_FIELDS = `
    id
    commentIndex
    content
    storyTranslationContentId
    `;

export type CommentResponse = {
  id: number;
  userId: number;
  commentIndex: number;
  time: string;
  resolved: boolean;
  content: string;
};

export const buildCommentsQuery = (
  storyTranslationId: number,
  resolved: boolean | null,
): QueryInformation => {
  let queryString = gql`
    query CommentsByStoryTranslation {
      commentsByStoryTranslation( storyTranslationId: ${storyTranslationId} ){
        ${COMMENT_FIELDS}
      }
    }
  `;

  if (resolved === true || resolved === false) {
    queryString = gql`
    query CommentsByStoryTranslation {
      commentsByStoryTranslation( storyTranslationId: ${storyTranslationId}, resolved: ${resolved} ){
        ${COMMENT_FIELDS}
      }
    }
  `;
  }

  return {
    fieldName: "commentsByStoryTranslation",
    string: queryString,
  } as QueryInformation;
};
