import { useCallback, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_STORY_TRANSLATION_CONTENTS } from "../../APIClients/mutations/StoryMutations";

import debounce from "../../utils/DebounceUtils";

export type StoryLine = {
  lineIndex: number;
  originalContent: string;
  status: string;
  translatedContent?: string;
  storyTranslationContentId?: number;
};

type AutosaveProps = {
  storylines: StoryLine[];
  onSuccess: () => void;
};

// Inspiration from https://www.synthace.com/autosave-with-react-hooks/
const Autosave = ({ storylines, onSuccess }: AutosaveProps) => {
  const handleError = (errorMessage: string) => {
    alert(errorMessage);
  };

  const [updateTranslation] = useMutation<{}>(
    UPDATE_STORY_TRANSLATION_CONTENTS,
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

        if (result.data == null) {
          handleError("Unable to save translation");
        } else {
          onSuccess();
        }
      } catch (err) {
        handleError(err ?? "Error occurred, please try again.");
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
