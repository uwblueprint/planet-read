import React, { useState } from "react";
import { Badge, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { Icon } from "@chakra-ui/icon";
import {
  MdCheck,
  MdTimer,
  MdArrowDropDown,
  MdPriorityHigh,
  MdErrorOutline,
} from "react-icons/md";
import { IconType } from "react-icons";
import {
  getStatusVariant,
  convertStatusTitleCase,
} from "../../utils/StatusUtils";
import {
  UPDATE_STORY_TRANSLATION_CONTENT_STATUS,
  UpdateStoryTranslationContentStatusResponse,
} from "../../APIClients/mutations/StoryMutations";
import { StoryLine } from "../translation/Autosave";
import ConfirmationModal from "../utils/ConfirmationModal";
import {
  REVIEW_PAGE_APPROVE_LAST_LINE_CONFIRMATION,
  REVIEW_PAGE_BUTTON_MESSAGE,
} from "../../utils/Copy";

export type StatusBadgeProps = {
  translatedStoryLines: StoryLine[];
  setTranslatedStoryLines: (storyLines: StoryLine[]) => void;
  storyLine: StoryLine;
  numApprovedLines: number;
  setNumApprovedLines: (numLines: number) => void;
  isTest: boolean;
};

type StatusOption = {
  icon: IconType;
  stage: string;
  value: string;
};

const REVIEW_STATUS_OPTIONS: StatusOption[] = [
  { icon: MdCheck, stage: "APPROVED", value: "Approve" },
  { icon: MdTimer, stage: "DEFAULT", value: "Pending" },
  { icon: MdPriorityHigh, stage: "ACTION_REQUIRED", value: "Action Required" },
];

const TEST_GRADING_STATUS_OPTIONS: StatusOption[] = [
  { icon: MdTimer, stage: "DEFAULT", value: "Pending" },
  { icon: MdCheck, stage: "TEST_CORRECT", value: "Correct" },
  {
    icon: MdErrorOutline,
    stage: "TEST_PARTIALLY_CORRECT",
    value: "Partially correct",
  },
  { icon: MdPriorityHigh, stage: "TEST_INCORRECT", value: "Incorrect" },
];

const StatusBadge = ({
  translatedStoryLines,
  setTranslatedStoryLines,
  storyLine,
  numApprovedLines,
  setNumApprovedLines,
  isTest,
}: StatusBadgeProps) => {
  const [updateStatus] = useMutation<{
    response: UpdateStoryTranslationContentStatusResponse;
  }>(UPDATE_STORY_TRANSLATION_CONTENT_STATUS);

  const [sendAsApprovedLastLine, setSendAsApprovedLastLine] = useState(false);

  const closeModal = async () => {
    setSendAsApprovedLastLine(false);
  };

  const changeStatus = async (newStatus: string) => {
    const result = await updateStatus({
      variables: {
        storyTranslationContentId: storyLine.storyTranslationContentId!!,
        status: newStatus,
      },
    });
    if (result) {
      const prevState = translatedStoryLines[storyLine.lineIndex].status;

      const updatedStatusArray = [...translatedStoryLines!];
      updatedStatusArray[storyLine.lineIndex].status =
        convertStatusTitleCase(newStatus);

      setTranslatedStoryLines(updatedStatusArray);
      if (
        prevState !== convertStatusTitleCase("APPROVED") &&
        newStatus === "APPROVED"
      ) {
        setNumApprovedLines(numApprovedLines + 1);
      } else if (
        prevState === convertStatusTitleCase("APPROVED") &&
        newStatus !== "APPROVED"
      ) {
        setNumApprovedLines(numApprovedLines - 1);
      }
    }
  };

  const handleStatusChange = (newStatus: string) => {
    const prevStatus = translatedStoryLines[storyLine.lineIndex].status;

    if (
      prevStatus !== convertStatusTitleCase(newStatus) &&
      (newStatus !== "APPROVED" ||
        numApprovedLines + 1 < translatedStoryLines.length)
    ) {
      changeStatus(newStatus);
    } else if (
      prevStatus !== convertStatusTitleCase(newStatus) &&
      newStatus === "APPROVED" &&
      numApprovedLines + 1 === translatedStoryLines.length
    ) {
      setSendAsApprovedLastLine(true);
    }
  };

  const handleLastLine = () => {
    changeStatus("APPROVED");
    closeModal();
  };

  const statusOptions = isTest
    ? TEST_GRADING_STATUS_OPTIONS
    : REVIEW_STATUS_OPTIONS;

  return (
    <Menu>
      <MenuButton
        as={Badge}
        textTransform="capitalize"
        variant={getStatusVariant(storyLine.status)}
      >
        {storyLine.status}
        <Icon as={MdArrowDropDown} height={6} width={6} />
      </MenuButton>
      <MenuList>
        {statusOptions.map((option) => (
          <MenuItem
            icon={<Icon as={option.icon} height={6} width={6} />}
            onClick={async () => {
              handleStatusChange(option.stage);
            }}
          >
            {option.value}
          </MenuItem>
        ))}
      </MenuList>
      {sendAsApprovedLastLine && (
        <ConfirmationModal
          confirmation={sendAsApprovedLastLine}
          onConfirmationClick={handleLastLine}
          onClose={closeModal}
          confirmationMessage={REVIEW_PAGE_APPROVE_LAST_LINE_CONFIRMATION}
          buttonMessage={REVIEW_PAGE_BUTTON_MESSAGE}
        />
      )}
    </Menu>
  );
};

export default StatusBadge;
