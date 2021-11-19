import { gql } from "@apollo/client";

export const CREATE_COMMMENT = gql`
  mutation CreateComment($commentData: CreateCommentDTO!) {
    createComment(commentData: $commentData) {
      ok
      comment {
        id
        userId
        commentIndex
        time
        resolved
        content
        lineIndex
        storyTranslationContentId
      }
    }
  }
`;

export type CreateCommentResponse = {
  ok: boolean;
  comment: {
    id: number;
    userId: number;
    commentIndex: number;
    time: string;
    resolved: boolean;
    content: string;
    lineIndex: number;
    storyTranslationContentId: number;
  };
};

export const UPDATE_COMMENT_BY_ID = gql`
  mutation UpdateCommentById($commentData: UpdateCommentRequestDTO!) {
    updateCommentById(commentData: $commentData) {
      ok
      comment {
        id
        commentIndex
        resolved
        content
      }
    }
  }
`;

export type UpdateCommentResponse = {
  ok: boolean;
  comment: {
    id: number;
    commentIndex: number;
    resolved: boolean;
    content: string;
  };
};
