import { CommentResponse } from "../APIClients/queries/CommentQueries";
import { AdditionalExperiences } from "../APIClients/queries/UserQueries";

export const convertStringTitleCase = (s: string) =>
  s[0] + s.substring(1).toLowerCase();

export type ApprovedLanguagesMap = { [language: string]: number };

export const parseApprovedLanguages = (
  input: string | undefined,
): ApprovedLanguagesMap => {
  return input ? JSON.parse(input.trim().replace(/'/g, '"')) : {};
};

export const parseUserBackground = (
  input: string | undefined | null,
): AdditionalExperiences => {
  const additionalExperiences = input
    ? JSON.parse(input.trim().replace(/'/g, '"'))
    : {};
  return {
    languageExperience: additionalExperiences.languageExperience ?? "",
    educationalQualification:
      additionalExperiences.educationalQualification ?? "",
  };
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
    if (
      existingComments[i].lineIndex === newComment.lineIndex &&
      existingComments[i].commentIndex === newComment.commentIndex - 1
    ) {
      i += 1;
      break;
    }
    i += 1;
  }

  const comments = [
    ...existingComments.slice(0, i),
    newComment,
    ...existingComments.slice(i),
  ];
  return comments;
};

export const generateSortFn =
  <T extends { [field: string]: any }>(field: string, isAscending: boolean) =>
  (t1: T, t2: T) =>
    isAscending
      ? t1[field].localeCompare(t2[field])
      : t2[field].localeCompare(t1[field]);

export const isObjEmpty = (o: object): boolean => {
  return Object.keys(o).length === 0;
};

// Retrieved from: https://stackoverflow.com/a/11818658
export const truncate = (num: number, decimals: number): string => {
  if (Number.isNaN(num)) {
    return "0";
  }
  const re = new RegExp(`^-?\\d+(?:.\\d{0,${decimals || -1}})?`);
  return num.toString().match(re)![0];
};
