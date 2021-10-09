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
  };
};
