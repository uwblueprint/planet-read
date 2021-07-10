// Change language string to title case
function changeLanguageToTitleCase(language: string) {
  // Handles 4 edge cases: ENGLISH_US, ENGLISH_UK, ENGLISH_INDIA, ASANTE_TWI
  switch (language) {
    case "ENGLISH_US":
      return "English (US)";

    case "ENGLISH_UK":
      return "English (UK)";

    case "ENGLISH_INDIA":
      return "English (India)";

    case "ASANTE_TWI":
      return "Asante Twi";

    default:
      return language[0] + language.substring(1).toLowerCase();
  }
}

export { changeLanguageToTitleCase as default };
