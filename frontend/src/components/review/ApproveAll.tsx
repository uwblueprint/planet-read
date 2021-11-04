import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import {
  Checkbox,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icon";
import { MdArrowDropDown } from "react-icons/md";

import ConfirmationModal from "../utils/ConfirmationModal";
import {
  APPROVE_ALL_STORY_TRANSLATION_CONTENT,
  ApproveAllStoryTranslationContentResponse,
} from "../../APIClients/mutations/StoryMutations";
import {
  REVIEW_PAGE_APPROVE_ALL_CONFIRMATION,
  REVIEW_PAGE_BUTTON_MESSAGE,
} from "../../utils/Copy";

export type ApproveAllProps = {
  numApprovedLines: number;
  setNumApprovedLines: (numLines: number) => void;
  totalLines: number;
  storyTranslationId: number;
};

const ApproveAll = ({
  numApprovedLines,
  setNumApprovedLines,
  totalLines,
  storyTranslationId,
}: ApproveAllProps) => {
  const [sendAsApproved, setSendAsApproved] = useState(false);

  const [approveAll] = useMutation<{
    response: ApproveAllStoryTranslationContentResponse;
  }>(APPROVE_ALL_STORY_TRANSLATION_CONTENT);

  const closeModal = () => {
    setSendAsApproved(false);
  };

  const openModal = () => {
    setSendAsApproved(true);
  };

  const callApproveAllMutation = async () => {
    const result = await approveAll({
      variables: {
        storyTranslationId,
      },
    });

    if (result) {
      setNumApprovedLines(totalLines);
    }
    closeModal();
    window.location.reload();
  };

  return (
    <Menu closeOnSelect={false} matchWidth placement="bottom-start">
      <MenuButton as={Text}>
        <Text variant="statusHeader">
          Status
          <Icon as={MdArrowDropDown} height={5} width={5} />
        </Text>
      </MenuButton>
      <MenuList height="42px" align="center">
        <Flex paddingLeft="13px">
          <Checkbox
            size="md"
            width="100%"
            isDisabled={numApprovedLines === totalLines}
            isChecked={numApprovedLines === totalLines}
            onChange={openModal}
          >
            <Text> Mark all as approved </Text>
          </Checkbox>
        </Flex>
      </MenuList>
      {sendAsApproved && (
        <ConfirmationModal
          confirmation={sendAsApproved}
          onClose={closeModal}
          onConfirmationClick={callApproveAllMutation}
          confirmationMessage={REVIEW_PAGE_APPROVE_ALL_CONFIRMATION}
          buttonMessage={REVIEW_PAGE_BUTTON_MESSAGE}
        />
      )}
    </Menu>
  );
};

export default ApproveAll;
