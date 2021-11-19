function convertStringTitleCase(s: string) {
  return s[0] + s.substring(1).toLowerCase();
}

export type ApprovedLanguagesMap = { [language: string]: number };

const parseApprovedLanguages = (
  input: string | undefined,
): ApprovedLanguagesMap => {
  return input ? JSON.parse(input.trim().replace(/'/g, '"')) : {};
};

export { convertStringTitleCase, parseApprovedLanguages };
