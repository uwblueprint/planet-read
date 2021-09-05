// Change status mysql enum to title case
function convertStatusTitleCase(status: string) {
  const statusEnum = status.replace("StoryTranslationContentStatus.", "");
  switch (statusEnum) {
    case "DEFAULT":
      return "Pending";
    case "APPROVED":
      return "Approved";
    case "ACTION_REQUIRED":
      return "Action";
    default:
      return statusEnum.replace(/_/g, " ");
  }
}

function getStatusVariant(status: string | undefined) {
  switch (status) {
    case "Pending":
      return "pending";
    case "Approved":
      return "approved";
    case "Action":
      return "action";
    default:
      return status?.toLowerCase();
  }
}

export { convertStatusTitleCase, getStatusVariant };
