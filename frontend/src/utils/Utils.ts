export const convertStringTitleCase = (s: string) =>
  s[0] + s.substring(1).toLowerCase();

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
