import convertStringTitleCase from "./Utils";

function convertStageTitleCase(stage: string) {
  switch (stage) {
    case "TRANSLATE":
      return "In Translation";
    case "REVIEW":
      return "In Review";
    case "PUBLISH":
      return "Completed";
    default:
      return convertStringTitleCase(stage);
  }
}

export { convertStageTitleCase as default };
