import { CommentResponse } from "../APIClients/queries/CommentQueries";

export const convertStringTitleCase = (s: string) =>
  s[0] + s.substring(1).toLowerCase();

export type ApprovedLanguagesMap = { [language: string]: number };

export const parseApprovedLanguages = (
  input: string | undefined,
): ApprovedLanguagesMap => {
  return input ? JSON.parse(input.trim().replace(/'/g, '"')) : {};
};

export const embedLink = (originalYoutubeLink: string): string => {
  /*
  Transforms originalYoutubeLink into embed link appropriate for iframe.
    If already given link in the embed version, does nothing.

  Example:
  - Real link: https://www.youtube.com/watch?v=_OBlgSz8sSM
  - Embed link: https://www.youtube.com/embed/_OBlgSz8sSM
  */

  return originalYoutubeLink.replace("watch?v=", "embed/");
};

export const insertSortedComments = (
  existingComments: CommentResponse[],
  newComment: CommentResponse,
): CommentResponse[] => {
  let i = 0;
  while (i < existingComments.length) {
    if (existingComments[i].lineIndex > newComment.lineIndex) break;
    i += 1;
    if (
      existingComments[i].lineIndex === newComment.lineIndex &&
      existingComments[i].commentIndex === newComment.commentIndex - 1
    ) {
      break;
    }
  }

  const comments = [
    ...existingComments.slice(0, i),
    newComment,
    ...existingComments.slice(i),
  ];
  return comments;
};
