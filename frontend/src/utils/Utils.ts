function convertStringTitleCase(s: string) {
  return s[0] + s.substring(1).toLowerCase();
}

export { convertStringTitleCase as default };
