import React, { useEffect, useRef } from "react";

import { Icon } from "@chakra-ui/icon";
import { MdRedo, MdUndo } from "react-icons/md";
import { Flex, IconButton } from "@chakra-ui/react";

import { StoryLine } from "./Autosave";
import deepCopy from "../../utils/DeepCopyUtils";

export type UndoRedoProps = {
  currentVersion: number;
  setCurrentVersion: (val: number) => void;
  versionHistoryStack: Array<StoryLine[]>;
  setVersionHistoryStack: (val: Array<StoryLine[]>) => void;
  translatedStoryLines: StoryLine[];
  setTranslatedStoryLines: (val: StoryLine[]) => void;
  setNumTranslatedLines: (val: number) => void;
  MAX_STACK_SIZE: number;
};

const UndoRedo = ({
  currentVersion,
  setCurrentVersion,
  versionHistoryStack,
  setVersionHistoryStack,
  translatedStoryLines,
  setTranslatedStoryLines,
  setNumTranslatedLines,
  MAX_STACK_SIZE,
}: UndoRedoProps) => {
  const versionUpdateTimeout = useRef(false);
  const saveVersionState = () => {
    if (
      versionHistoryStack.length > 0 &&
      currentVersion === versionHistoryStack.length &&
      JSON.stringify(translatedStoryLines) !==
        JSON.stringify(versionHistoryStack[currentVersion])
    ) {
      setVersionHistoryStack(
        versionHistoryStack.length === MAX_STACK_SIZE
          ? [
              ...deepCopy(versionHistoryStack.slice(1)),
              deepCopy(translatedStoryLines),
            ]
          : [...deepCopy(versionHistoryStack), deepCopy(translatedStoryLines)],
      );
      setCurrentVersion(
        versionHistoryStack.length === MAX_STACK_SIZE
          ? MAX_STACK_SIZE - 1
          : versionHistoryStack.length,
      );
    }
  };

  // Approach from https://leewarrick.com/blog/how-to-debounce/ (the throttling stuff)
  useEffect(() => {
    if (versionUpdateTimeout.current) return;
    versionUpdateTimeout.current = true;
    setTimeout(() => {
      versionUpdateTimeout.current = false;
      saveVersionState();
    }, 750);
  }, [translatedStoryLines]);

  const undoChange = () => {
    if (currentVersion > 0) {
      const newContent = versionHistoryStack[currentVersion - 1];
      setCurrentVersion(currentVersion - 1);
      setTranslatedStoryLines(newContent);
      setNumTranslatedLines(newContent.length);
    }
  };

  const redoChange = () => {
    if (currentVersion < versionHistoryStack.length - 1) {
      const newContent = versionHistoryStack[currentVersion + 1];
      setCurrentVersion(currentVersion + 1);
      setTranslatedStoryLines(newContent);
      setNumTranslatedLines(newContent.length);
    }
  };
  return (
    <Flex direction="row">
      <IconButton
        size="undoRedo"
        variant="ghost"
        aria-label="Undo Change"
        onClick={undoChange}
        icon={<Icon as={MdUndo} />}
        isDisabled={!(currentVersion > 0)}
      />
      <IconButton
        variant="ghost"
        size="undoRedo"
        aria-label="Redo Change"
        onClick={redoChange}
        icon={<Icon as={MdRedo} />}
        isDisabled={!(currentVersion < versionHistoryStack.length - 1)}
      />
    </Flex>
  );
};

export default UndoRedo;
