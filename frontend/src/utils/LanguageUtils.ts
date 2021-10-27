import convertStringTitleCase from "./Utils";

// Change language string to title case
function convertLanguageTitleCase(language: string) {
  // Handles 4 edge cases: ENGLISH_US, ENGLISH_UK, ENGLISH_INDIA, ASANTE_TWI
  switch (language) {
    case "ENGLISH_US":
      return "English (US)";

    case "ENGLISH_UK":
      return "English (UK)";

    case "ENGLISH_INDIAN":
      return "English (Indian)";

    case "ASANTE_TWI":
      return "Asante Twi";

    default:
      return convertStringTitleCase(language);
  }
}

function convertTitleCaseToLanguage(language: string) {
  switch (language) {
    case "English (US)":
      return "ENGLISH_US";

    case "English (UK)":
      return "ENGLISH_UK";

    case "English (Indian)":
      return "ENGLISH_INDIAN";

    case "Asante Twi":
      return "ASANTE_TWI";

    default:
      return language.toUpperCase();
  }
}

export { convertLanguageTitleCase, convertTitleCaseToLanguage };
