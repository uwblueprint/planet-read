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
  versionSnapShotStack: Array<number[]>;
  setVersionSnapShotStack: (val: Array<number[]>) => void;
  snapShotLineIndexes: Set<number>;
  snapSnapShotLineIndexes: (val: Set<number>) => void;
  translatedStoryLines: StoryLine[];
  onChangeTranslationContent: (newContent: string, lineIndex: number) => void;
  MAX_STACK_SIZE: number;
};

const UndoRedo = ({
  currentVersion,
  setCurrentVersion,
  versionHistoryStack,
  setVersionHistoryStack,
  versionSnapShotStack,
  setVersionSnapShotStack,
  snapShotLineIndexes,
  snapSnapShotLineIndexes,
  translatedStoryLines,
  onChangeTranslationContent,
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
      setVersionSnapShotStack(
        versionSnapShotStack.length === MAX_STACK_SIZE
          ? [
              ...deepCopy(versionSnapShotStack.slice(1)),
              Array.from(snapShotLineIndexes),
            ]
          : [
              ...deepCopy(versionSnapShotStack),
              Array.from(snapShotLineIndexes),
            ],
      );
      setCurrentVersion(
        versionHistoryStack.length === MAX_STACK_SIZE
          ? MAX_STACK_SIZE - 1
          : versionHistoryStack.length,
      );
      snapSnapShotLineIndexes(new Set<number>());
    }
  };

  // Separate debouncing for undo/redo as undoing all changes the user Autosave'd is too agressive.
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
      const reverseChange = versionSnapShotStack[currentVersion - 1];
      const reverseContent = versionHistoryStack[currentVersion - 1];
      // eslint-disable-next-line no-restricted-syntax
      reverseChange.forEach((lineIndex: number) => {
        onChangeTranslationContent(
          reverseContent[lineIndex].translatedContent!,
          lineIndex,
        );
      });
      setCurrentVersion(currentVersion - 1);
    }
  };

  const redoChange = () => {
    if (currentVersion < versionHistoryStack.length - 1) {
      let newChangeIdx = currentVersion;
      if (currentVersion === versionSnapShotStack.length - 1) {
        newChangeIdx = versionSnapShotStack.length - 1;
      }
      const newChange = versionSnapShotStack[newChangeIdx];
      const newContent = versionHistoryStack[currentVersion + 1];
      // eslint-disable-next-line no-restricted-syntax
      newChange.forEach((lineIndex: number) => {
        onChangeTranslationContent(
          newContent[lineIndex].translatedContent!,
          lineIndex,
        );
      });
      setCurrentVersion(currentVersion + 1);
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
