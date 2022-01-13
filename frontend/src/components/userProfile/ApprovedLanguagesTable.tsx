import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { ApprovedLanguagesMap } from "../../utils/Utils";
import {
  UPDATE_USER_APPROVED_LANGUAGES,
  UpdateUserApprovedLanguagesResponse,
} from "../../APIClients/mutations/UserMutations";
import AdminNewLanguageModal, {
  NewApprovedLanguage,
} from "./AdminNewLanguageModal";
import UserNewLanguageModal from "./UserNewLanguageModal";
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
  DEMOTE_LEVEL_CONFIRMATION,
  DEMOTE_LEVEL_BUTTON,
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

export type UpdateApprovedLanguageArgs = {
  isTranslate: boolean;
  language: string;
  oldLevel: number;
  newLevel: number;
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

  /* State */
  const [confirmDemoteLevel, setConfirmDemoteLevel] = useState(false);
  const [confirmLevelUp, setConfirmLevelUp] = useState(false);
  const [alertNewTest, setAlertNewTest] = useState(false);
  const [testLevel, setTestLevel] = useState(0);
  const [testLanguage, setTestLanguage] = useState("");
  const [languageToRemove, setLanguageToRemove] = useState("");
  const [isRemoveTranslatorLanguage, setIsRemoveTranslatorLanguage] =
    useState(false);

  const [approveNewLanguage, setApproveNewLanguage] = useState(false);
  const [removeLanguage, setRemoveLanguage] = useState(false);

  const [updateApprovedLanguageArgs, setUpdateApprovedLanguageArgs] =
    useState<UpdateApprovedLanguageArgs>();

  const resetAlertTimeout = () => {
    window.clearTimeout(alertTimeout);
    const timeout: number = window.setTimeout(() => setAlert(false), 5000);
    setAlertTimeout(timeout);
  };

  /* UI Logic */
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
      return `A new language was approved for the user: ${language}`;
    }
    return `${
      isTranslate ? "Translator" : "Reviewer"
    }'s approval for ${language} has been updated: Level ${oldLevel} → Level ${level}.`;
  };

  /* GQL Requests */
  const [updateUserApprovedLanguages] = useMutation<{
    response: UpdateUserApprovedLanguagesResponse;
  }>(UPDATE_USER_APPROVED_LANGUAGES);

  const [createTranslationTest] = useMutation<{
    response: CreateTranslationTestResponse;
  }>(CREATE_TRANSLATION_TEST);

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
      const approvedLanguagesMap = isTranslate
        ? approvedLanguagesTranslation
        : approvedLanguagesReview;
      const setApprovedLanguagesMap = isTranslate
        ? setApprovedLanguagesTranslation
        : setApprovedLanguagesReview;

      // update local state
      const newApprovedLanguages = { ...approvedLanguagesMap };
      if (isRemoveLanguage) {
        delete newApprovedLanguages[language];
      } else {
        newApprovedLanguages[language] = level;
      }
      setApprovedLanguagesMap(newApprovedLanguages);

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

  // Opening and Closing Modals
  const openAddNewLanguageModal = () => {
    setApproveNewLanguage(true);
  };

  const closeAddNewLanguageModal = (cancelled = true) => {
    setApproveNewLanguage(false);
    if (cancelled) {
      setAlert(true);
      setAlertText("No new language was assigned to the user.");
      resetAlertTimeout();
    }
  };

  const closeNewTestModal = () => {
    setAlertNewTest(false);
  };

  const openRemoveLanguageModal = (isTranslate: boolean, language: string) => {
    setLanguageToRemove(language);
    setIsRemoveTranslatorLanguage(isTranslate);
    setRemoveLanguage(true);
  };

  const closeRemoveLanguageModal = () => {
    setRemoveLanguage(false);
  };

  const openLevelUpModal = (level: number, language: string) => {
    setTestLevel(level);
    setTestLanguage(language);
    setConfirmLevelUp(true);
  };

  const closeLevelUpModal = () => {
    setTestLevel(0);
    setTestLanguage("");
    setConfirmLevelUp(false);
  };

  /* Confirm Modal Logic */
  const onAdminAddNewLanguage = (newLanguage: NewApprovedLanguage) => {
    callUpdateUserApprovedLanguagesMutation(
      newLanguage.role === "Translator",
      newLanguage.language,
      newLanguage.level,
      0,
      true,
    );
    closeAddNewLanguageModal(false);
  };

  const onUserAddNewLanguage = async (newLanguage: string) => {
    try {
      await createTranslationTest({
        variables: {
          userId,
          level: 2,
          language: newLanguage,
        },
      });
      closeAddNewLanguageModal(false);
      setAlertNewTest(true);
    } catch (err) {
      // eslint-disable-next-line no-alert
      window.alert(err);
      closeAddNewLanguageModal(false);
    }
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

  const onLevelUp = async () => {
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
      // eslint-disable-next-line no-alert
      window.alert(err);
      closeLevelUpModal();
      closeNewTestModal();
    }
  };

  const onDemoteUserLevel = () => {
    callUpdateUserApprovedLanguagesMutation(
      updateApprovedLanguageArgs!!.isTranslate,
      updateApprovedLanguageArgs!!.language,
      updateApprovedLanguageArgs!!.newLevel,
      updateApprovedLanguageArgs!!.oldLevel,
    );
    setConfirmDemoteLevel(false);
  };

  /* Other Logic */
  const onSliderValueChange = (
    isTranslate: boolean,
    language: string,
    newLevel: number,
    oldLevel: number,
  ) => {
    if (newLevel < oldLevel) {
      setUpdateApprovedLanguageArgs({
        isTranslate,
        language,
        newLevel,
        oldLevel,
      });
      setConfirmDemoteLevel(true);
    } else {
      callUpdateUserApprovedLanguagesMutation(
        isTranslate,
        language,
        newLevel,
        oldLevel,
      );
    }
  };

  return (
    <>
      <ApprovedLanguagesTableComponent
        addNewLanguage={openAddNewLanguageModal}
        levelUpOnClick={openLevelUpModal}
        removeLanguageOnClick={openRemoveLanguageModal}
        onSliderValueChange={onSliderValueChange}
        approvedLanguagesTranslation={approvedLanguagesTranslation}
        approvedLanguagesReview={approvedLanguagesReview}
        isAdmin={isAdmin}
      />
      {approveNewLanguage &&
        (isAdmin ? (
          <AdminNewLanguageModal
            isOpen={approveNewLanguage}
            onClose={closeAddNewLanguageModal}
            onAssign={onAdminAddNewLanguage}
            approvedLanguagesTranslation={approvedLanguagesTranslation!}
            approvedLanguagesReview={approvedLanguagesReview!}
          />
        ) : (
          <UserNewLanguageModal
            isOpen={approveNewLanguage}
            onClose={closeAddNewLanguageModal}
            onSubmit={onUserAddNewLanguage}
            approvedLanguagesTranslation={approvedLanguagesTranslation}
          />
        ))}
      <ConfirmationModal
        confirmation={alertNewTest}
        onClose={closeNewTestModal}
        onConfirmationClick={() => history.push("/?tab=2#/")}
        confirmationHeading={NEW_BOOK_TEST_ADDED_HEADING}
        confirmationMessage={NEW_BOOK_TEST_ADDED_MESSAGE}
        buttonMessage={NEW_BOOK_TEST_ADDED_BUTTON}
      />
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
        onConfirmationClick={onLevelUp}
        confirmationMessage={LEVEL_UP_LANGUAGE_CONFIRMATION}
        buttonMessage={LEVEL_UP_LANGUAGE_BUTTON}
      />
      <ConfirmationModal
        confirmation={confirmDemoteLevel}
        onClose={() => setConfirmDemoteLevel(false)}
        onConfirmationClick={onDemoteUserLevel}
        confirmationMessage={DEMOTE_LEVEL_CONFIRMATION}
        buttonMessage={DEMOTE_LEVEL_BUTTON}
      />
    </>
  );
};

export default ApprovedLanguagesTable;
