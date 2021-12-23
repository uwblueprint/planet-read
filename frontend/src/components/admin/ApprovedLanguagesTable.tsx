import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { ApprovedLanguagesMap } from "../../utils/Utils";
import { convertLanguageTitleCase } from "../../utils/LanguageUtils";
import {
  UPDATE_USER_APPROVED_LANGUAGES,
  UpdateUserApprovedLanguagesResponse,
} from "../../APIClients/mutations/UserMutations";
import ApproveLanguageModal, {
  NewApprovedLanguage,
} from "../utils/ApproveLanguageModal";
import {
  CREATE_TRANSLATION_TEST,
  CreateTranslationTestResponse,
} from "../../APIClients/mutations/StoryMutations";
import ApprovedLanguagesTableComponent from "./ApprovedLanguagesTableComponent";
import ConfirmationModal from "../utils/ConfirmationModal";

import {
  LEVEL_UP_LANGUAGE_CONFIRMATION,
  LEVEL_UP_LANGUAGE_BUTTON,
  NEW_BOOK_TEST_ADDED_HEADING,
  NEW_BOOK_TEST_ADDED_MESSAGE,
  NEW_BOOK_TEST_ADDED_BUTTON,
  REMOVE_LANGUAGE_CONFIRMATION,
  REMOVE_LANGUAGE_BUTTON,
} from "../../utils/Copy";

export type ApprovedLanguagesTableProps = {
  approvedLanguagesTranslation: ApprovedLanguagesMap | undefined;
  approvedLanguagesReview: ApprovedLanguagesMap | undefined;
  setApprovedLanguagesTranslation: (
    approvedLanguages: ApprovedLanguagesMap,
  ) => void;
  setApprovedLanguagesReview: (approvedLanguages: ApprovedLanguagesMap) => void;
  userId: number;
  setAlertText: (newText: string) => void;
  setAlert: (open: boolean) => void;
  alertTimeout: number;
  setAlertTimeout: (id: number) => void;
  isAdmin?: boolean;
};

const ApprovedLanguagesTable = ({
  approvedLanguagesTranslation,
  approvedLanguagesReview,
  setApprovedLanguagesTranslation,
  setApprovedLanguagesReview,
  userId,
  setAlertText,
  setAlert,
  alertTimeout,
  setAlertTimeout,
  isAdmin = false,
}: ApprovedLanguagesTableProps) => {
  const history = useHistory();

  const [confirmLevelUp, setConfirmLevelUp] = useState(false);
  const [alertNewTest, setAlertNewTest] = useState(false);
  const [testLevel, setTestLevel] = useState(0);
  const [testLanguage, setTestLanguage] = useState("");
  const [languageToRemove, setLanguageToRemove] = useState("");
  const [isRemoveTranslatorLanguage, setIsRemoveTranslatorLanguage] =
    useState(false);

  const [approveNewLanguage, setApproveNewLanguage] = useState(false);
  const [removeLanguage, setRemoveLanguage] = useState(false);

  const resetAlertTimeout = () => {
    window.clearTimeout(alertTimeout);
    const timeout: number = window.setTimeout(() => setAlert(false), 5000);
    setAlertTimeout(timeout);
  };

  const openApproveLanguageModal = () => {
    setApproveNewLanguage(true);
  };

  const closeApproveLanguageModal = (cancelled = true) => {
    setApproveNewLanguage(false);
    if (cancelled) {
      setAlert(true);
      setAlertText("No new language was assigned to the user.");
      resetAlertTimeout();
    }
  };

  const [updateUserApprovedLanguages] = useMutation<{
    response: UpdateUserApprovedLanguagesResponse;
  }>(UPDATE_USER_APPROVED_LANGUAGES);
  const [createTranslationTest] = useMutation<{
    response: CreateTranslationTestResponse;
  }>(CREATE_TRANSLATION_TEST);

  const getAlertText = (
    isTranslate: boolean,
    language: string,
    level: number,
    oldLevel: number,
    isNewLanguage: boolean,
    isRemoveLanguage: boolean,
  ) => {
    if (isRemoveLanguage) {
      return `Language has been removed for the user`;
    }
    if (isNewLanguage) {
      return `A new language was approved for the user: ${convertLanguageTitleCase(
        language,
      )}`;
    }
    return `${
      isTranslate ? "Translator" : "Reviewer"
    }'s approval for ${convertLanguageTitleCase(
      language,
    )} has been updated: Level ${oldLevel} → Level ${level}.`;
  };

  const callUpdateUserApprovedLanguagesMutation = async (
    isTranslate: boolean,
    language: string,
    level: number,
    oldLevel: number,
    isNewLanguage = false,
  ) => {
    const isRemoveLanguage = level === -1;
    const result = await updateUserApprovedLanguages({
      variables: {
        userId,
        isTranslate,
        language,
        level,
      },
    });

    if (result.data !== undefined) {
      if (isNewLanguage || isRemoveLanguage) {
        const approvedLanguagesMap = isTranslate
          ? approvedLanguagesTranslation
          : approvedLanguagesReview;
        const setApprovedLanguagesMap = isTranslate
          ? setApprovedLanguagesTranslation
          : setApprovedLanguagesReview;

        // update local state
        const newApprovedLanguages = { ...approvedLanguagesMap };
        if (isNewLanguage) {
          newApprovedLanguages[language] = level;
        } else {
          delete newApprovedLanguages[language];
        }
        setApprovedLanguagesMap(newApprovedLanguages);
      }

      setAlert(true);
      setAlertText(
        getAlertText(
          isTranslate,
          language,
          level,
          oldLevel,
          isNewLanguage,
          isRemoveLanguage,
        ),
      );
      resetAlertTimeout();
    }
  };

  const onSliderValueChange = (
    isTranslate: boolean,
    language: string,
    newLevel: number,
    oldLevel: number,
  ) => {
    callUpdateUserApprovedLanguagesMutation(
      isTranslate,
      language,
      newLevel,
      oldLevel,
    );
  };

  const onApproveLanguage = (newLanguage: NewApprovedLanguage) => {
    callUpdateUserApprovedLanguagesMutation(
      newLanguage.role === "Translator",
      newLanguage.language,
      newLanguage.level,
      0,
      true,
    );
    closeApproveLanguageModal(false);
  };

  const closeNewTestModal = () => {
    setAlertNewTest(false);
  };

  const closeLevelUpModal = () => {
    setTestLevel(0);
    setTestLanguage("");
    setConfirmLevelUp(false);
  };

  const openLevelUpModal = (level: number, language: string) => {
    setTestLevel(level);
    setTestLanguage(language);
    setConfirmLevelUp(true);
  };

  const openRemoveLanguageModal = (isTranslate: boolean, language: string) => {
    setLanguageToRemove(language);
    setIsRemoveTranslatorLanguage(isTranslate);
    setRemoveLanguage(true);
  };

  const closeRemoveLanguageModal = () => {
    setRemoveLanguage(false);
  };

  const onRemoveLanguage = () => {
    callUpdateUserApprovedLanguagesMutation(
      isRemoveTranslatorLanguage,
      languageToRemove,
      -1,
      0,
    );
    closeRemoveLanguageModal();
  };

  const callCreateTranslationTestMutation = async () => {
    try {
      await createTranslationTest({
        variables: {
          userId,
          level: testLevel,
          language: testLanguage,
        },
      });
      closeLevelUpModal();
      setAlertNewTest(true);
    } catch (err) {
      window.alert(err);
      closeLevelUpModal();
      closeNewTestModal();
    }
  };

  return (
    <>
      <ApprovedLanguagesTableComponent
        addNewLanguage={isAdmin ? openApproveLanguageModal : () => undefined}
        levelUpOnClick={openLevelUpModal}
        removeLanguageOnClick={openRemoveLanguageModal}
        onSliderValueChange={onSliderValueChange}
        approvedLanguagesTranslation={approvedLanguagesTranslation}
        approvedLanguagesReview={approvedLanguagesReview}
        isAdmin={isAdmin}
      />
      {approveNewLanguage && (
        <ApproveLanguageModal
          isOpen={approveNewLanguage}
          onClose={closeApproveLanguageModal}
          onAssign={onApproveLanguage}
          approvedLanguagesTranslation={approvedLanguagesTranslation!}
          approvedLanguagesReview={approvedLanguagesReview!}
        />
      )}
      <ConfirmationModal
        confirmation={removeLanguage}
        onClose={closeRemoveLanguageModal}
        onConfirmationClick={onRemoveLanguage}
        confirmationMessage={REMOVE_LANGUAGE_CONFIRMATION}
        buttonMessage={REMOVE_LANGUAGE_BUTTON}
      />
      <ConfirmationModal
        confirmation={confirmLevelUp}
        onClose={closeLevelUpModal}
        onConfirmationClick={callCreateTranslationTestMutation}
        confirmationMessage={LEVEL_UP_LANGUAGE_CONFIRMATION}
        buttonMessage={LEVEL_UP_LANGUAGE_BUTTON}
      />
      <ConfirmationModal
        confirmation={alertNewTest}
        onClose={closeNewTestModal}
        onConfirmationClick={() => history.push("/")}
        confirmationHeading={NEW_BOOK_TEST_ADDED_HEADING}
        confirmationMessage={NEW_BOOK_TEST_ADDED_MESSAGE}
        buttonMessage={NEW_BOOK_TEST_ADDED_BUTTON}
      />
    </>
  );
};

export default ApprovedLanguagesTable;
