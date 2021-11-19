import { convertStringTitleCase } from "./Utils";

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

function convertTitleCaseToStage(stage: string) {
  switch (stage) {
    case "In Translation":
      return "TRANSLATE";
    case "In Review":
      return "REVIEW";
    case "Completed":
      return "PUBLISH";
    default:
      return stage;
  }
}
export { convertStageTitleCase as default, convertTitleCaseToStage };
