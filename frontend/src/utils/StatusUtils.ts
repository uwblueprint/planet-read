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

const getLevelVariant = (level: number) => {
  switch (level) {
    case 1:
      return "green.50";
    case 2:
      return "red.50";
    case 3:
      return "purple.50";
    case 4:
      return "orange.50";
    default:
      return "green.50";
  }
};

export { convertStatusTitleCase, getStatusVariant, getLevelVariant };
