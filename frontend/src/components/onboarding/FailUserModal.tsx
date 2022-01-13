import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import {
  FINISH_GRADING_STORY_TRANSLATION,
  FinishGradingStoryTranslationResponse,
} from "../../APIClients/mutations/StoryMutations";
import {
  GRADING_PAGE_FAIL_USER_CONFIRMATION,
  GRADING_PAGE_FAIL_USER_BUTTON,
} from "../../utils/Copy";
import ConfirmationModal from "../utils/ConfirmationModal";
import TestFeedbackModal from "./TestFeedbackModal";

export type FailUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  storyTranslationId: number;
};

const FailUserModal = ({
  isOpen,
  onClose,
  storyTranslationId,
}: FailUserModalProps) => {
  const [enterFeedback, setEnterFeedback] = useState<boolean>(false);
  const [testFeedback, setTestFeedback] = useState<string>("");

  const history = useHistory();

  const [finishGradingStoryTranslation] = useMutation<{
    finishGradingStoryTranslation: FinishGradingStoryTranslationResponse;
  }>(FINISH_GRADING_STORY_TRANSLATION);

  const failGrade = async (feedback: string) => {
    const result = await finishGradingStoryTranslation({
      variables: {
        storyTranslationTestId: storyTranslationId,
        testFeedback: feedback,
        testResult: "{}",
      },
    });
    if (result.data?.finishGradingStoryTranslation.ok) {
      history.push("/?tab=4");
    } else {
      // eslint-disable-next-line no-alert
      window.alert("Could not mark story translation as failed.");
    }
  };

  return (
    <>
      <ConfirmationModal
        confirmation={isOpen && !enterFeedback}
        onConfirmationClick={() => setEnterFeedback(true)}
        onClose={onClose}
        confirmationMessage={GRADING_PAGE_FAIL_USER_CONFIRMATION}
        buttonMessage={GRADING_PAGE_FAIL_USER_BUTTON}
      />
      <TestFeedbackModal
        isCentered
        isOpen={isOpen && enterFeedback}
        testFeedback={testFeedback}
        setTestFeedback={setTestFeedback}
        onConfirm={() => {
          failGrade(testFeedback);
          setEnterFeedback(false);
          onClose();
        }}
      />
    </>
  );
};

export default FailUserModal;
