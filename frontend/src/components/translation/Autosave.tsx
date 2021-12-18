import { useCallback, useEffect } from "react";
import { useMutation } from "@apollo/client";
import {
  UPDATE_STORY_TRANSLATION_CONTENTS,
  UPDATE_STORY_TRANSLATION_LAST_ACTIVITY,
} from "../../APIClients/mutations/StoryMutations";

import debounce from "../../utils/DebounceUtils";

export type StoryLine = {
  lineIndex: number;
  originalContent: string;
  status?: string;
  translatedContent?: string;
  storyTranslationContentId?: number;
};

type AutosaveProps = {
  storyTranslationId: number;
  isTranslator: boolean;
  storylines: StoryLine[];
  onSuccess: () => void;
};

// Inspiration from https://www.synthace.com/autosave-with-react-hooks/
const Autosave = ({
  storyTranslationId,
  isTranslator,
  storylines,
  onSuccess,
}: AutosaveProps) => {
  const handleError = (errorMessage: string) => {
    alert(errorMessage);
  };

  const [updateTranslation] = useMutation<{}>(
    UPDATE_STORY_TRANSLATION_CONTENTS,
  );

  const [updateActivity] = useMutation<{}>(
    UPDATE_STORY_TRANSLATION_LAST_ACTIVITY,
  );

  const debouncedSave = useCallback(
    debounce(async (linesToUpdate: StoryLine[]) => {
      if (linesToUpdate.length === 0) {
        return;
      }

      const storyTranslationContents = linesToUpdate.map((line: StoryLine) => {
        return {
          id: line.storyTranslationContentId,
          translationContent: line.translatedContent,
        };
      });

      try {
        const result = await updateTranslation({
          variables: { storyTranslationContents },
        });
        updateActivity({
          variables: {
            storyTranslationId,
            isTranslator,
          },
        });

        if (result.data == null) {
          handleError("Unable to save translation");
        } else {
          onSuccess();
        }
      } catch (err) {
        if (typeof err === "string") {
          handleError(err);
        } else {
          console.log(err);
          handleError("Error occurred, please try again.");
        }
      }
    }, 1000),
    [],
  );

  useEffect(() => {
    debouncedSave(storylines);
  }, [storylines, debouncedSave]);

  return null;
};

export default Autosave;
