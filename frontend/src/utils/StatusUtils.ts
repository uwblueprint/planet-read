// Change status mysql enum to title case
function convertStatusTitleCase(status: string) {
  const statusEnum = status.replace("StoryTranslationContentStatus.", "");
  switch (statusEnum) {
    case "DEFAULT":
      return "Pending";
    case "APPROVED":
      return "Approved";
    case "ACTION_REQUIRED":
      return "Action Required";
    default:
      return statusEnum.replace(/_/g, " ");
  }
}

export { convertStatusTitleCase as default };
