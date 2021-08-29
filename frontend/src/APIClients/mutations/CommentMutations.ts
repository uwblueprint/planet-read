import { gql } from "@apollo/client";

export const CREATE_COMMMENT = gql`
  mutation CreateComment($commentData: CreateCommentDTO!) {
    createComment(commentData: $commentData) {
      ok
      comment {
        id
        commentIndex
        content
      }
    }
  }
`;

export type CreateCommentResponse = {
  ok: boolean;
  comment: {
    id: number;
    commentIndex: number;
    content: string;
  };
};
