import React from "react";
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
  const handleStatusChange = async (newStatus: string) => {
    const result = await updateStatus({
      variables: {
        storyTranslationContentId: storyLine.storyTranslationContentId!!,
        status: newStatus,
      },
    });
    if (result) {
      const prevState = translatedStoryLines[storyLine.lineIndex].status;

      const updatedStatusArray = [...translatedStoryLines!];
      updatedStatusArray[storyLine.lineIndex].status = convertStatusTitleCase(
        newStatus,
      );

      setTranslatedStoryLines(updatedStatusArray);
      if (
        prevState !== convertStatusTitleCase("APPROVED") &&
        newStatus === "APPROVED"
      ) {
        setNumApprovedLines!!(numApprovedLines!! + 1);
      } else if (
        prevState === convertStatusTitleCase("APPROVED") &&
        newStatus !== "APPROVED"
      ) {
        setNumApprovedLines!!(numApprovedLines!! - 1);
      }
    }
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
    </Menu>
  );
};

export default StatusBadge;
