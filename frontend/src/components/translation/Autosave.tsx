import { useCallback, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";

import debounce from "../../utils/DebounceUtils";

export type StoryLine = {
  lineIndex: number;
  originalContent: string;
  translatedContent?: string;
  storyTranslationContentId?: number;
};

const UPDATE_TRANSLATION = gql`
  mutation updateStoryTranslationContents(
    $storyTranslationContents: [StoryTranslationContentRequestDTO]
  ) {
    updateStoryTranslationContents(
      storyTranslationContents: $storyTranslationContents
    ) {
      story {
        id
      }
    }
  }
`;

type AutosaveProps = {
  storylines: StoryLine[];
  onSuccess: () => void;
};

// Inspiration from https://www.synthace.com/autosave-with-react-hooks/
const Autosave = ({ storylines, onSuccess }: AutosaveProps) => {
  const handleError = (errorMessage: string) => {
    alert(errorMessage);
  };

  const [updateTranslation] = useMutation<{}>(UPDATE_TRANSLATION);

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
          variables: {
            storyTranslationContents,
          },
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
