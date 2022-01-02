import { StoryTranslation } from "../APIClients/queries/StoryQueries";
import { convertStringTitleCase } from "./Utils";

export const convertStageTitleCase = (stage: string) => {
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
};

export const convertTitleCaseToStage = (stage: string) => {
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
};

export const getStoryTranslationProgress = (translation: StoryTranslation) => {
  const stage = convertStageTitleCase(translation.stage);
  if (translation.stage === "PUBLISH") {
    return stage;
  }

  const numProgressLines =
    translation.stage === "TRANSLATE"
      ? translation.numTranslatedLines
      : translation.numApprovedLines;

  const progress = (numProgressLines / translation.numContentLines) * 100;
  const percentage = Math.round(Number.isNaN(progress) ? 0 : progress);
  return `${stage} (${percentage}%)`;
};
