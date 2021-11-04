import React, { useState } from "react";
import { Badge, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { Icon } from "@chakra-ui/icon";
import { MdCheck, MdTimer, MdArrowDropDown } from "react-icons/md";
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
};

const StatusBadge = ({
  translatedStoryLines,
  setTranslatedStoryLines,
  storyLine,
  numApprovedLines,
  setNumApprovedLines,
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

  return (
    <Menu>
      <MenuButton
        as={Badge}
        textTransform="capitalize"
        variant={getStatusVariant(storyLine.status)}
        marginBottom="10px"
        text-align="center"
      >
        {storyLine.status}
        <Icon as={MdArrowDropDown} height={6} width={6} />
      </MenuButton>
      <MenuList>
        <MenuItem
          icon={<Icon as={MdCheck} height={6} width={6} />}
          onClick={async () => {
            handleStatusChange("APPROVED");
          }}
        >
          Approve
        </MenuItem>
        <MenuItem
          icon={<Icon as={MdTimer} height={6} width={6} />}
          onClick={async () => {
            handleStatusChange("DEFAULT");
          }}
        >
          Pending
        </MenuItem>
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
