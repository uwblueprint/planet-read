import React, { ReactNode, useState } from "react";
import { useMutation } from "@apollo/client";
import { Icon } from "@chakra-ui/icon";
import { MdDelete } from "react-icons/md";
import {
  Badge,
  IconButton,
  Link,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react";
import { StoryTranslation } from "../../APIClients/queries/StoryQueries";
import { convertLanguageTitleCase } from "../../utils/LanguageUtils";
import convertStageTitleCase from "../../utils/StageUtils";
import { getLevelVariant } from "../../utils/StatusUtils";
import ConfirmationModal from "../utils/ConfirmationModal";
import {
  SOFT_DELETE_STORY_TRANSLATION,
  SoftDeleteStoryTranslationResponse,
} from "../../APIClients/mutations/StoryMutations";
import {
  MANAGE_STORY_TRANSLATIONS_TABLE_DELETE_TRANSLATION_BUTTON,
  MANAGE_STORY_TRANSLATIONS_TABLE_DELETE_TRANSLATION_CONFIRMATION,
} from "../../utils/Copy";
import EmptyTable from "./EmptyTable";

export type StoryTranslationsTableProps = {
  storyTranslationSlice: StoryTranslation[];
  paginator: ReactNode;
  filters: { (data: string | null): void }[];
  loading: Boolean;
  showStoryTitle?: Boolean;
  width?: string;
};

const StoryTranslationsTable = ({
  storyTranslationSlice,
  paginator,
  filters,
  loading,
  showStoryTitle = true,
  width = "95%",
}: StoryTranslationsTableProps) => {
  const [confirmDeleteTranslation, setConfirmDeleteTranslation] =
    useState(false);
  const [idToDelete, setIdToDelete] = useState(0);

  const [deleteStoryTranslation] = useMutation<{
    response: SoftDeleteStoryTranslationResponse;
  }>(SOFT_DELETE_STORY_TRANSLATION);

  const closeModal = () => {
    setIdToDelete(0);
    setConfirmDeleteTranslation(false);
  };

  const openModal = (id: number) => {
    setIdToDelete(id);
    setConfirmDeleteTranslation(true);
  };

  const callSoftDeleteStoryTranslationMutation = async () => {
    await deleteStoryTranslation({
      variables: {
        id: idToDelete,
      },
    });
    closeModal();
    window.location.reload();
  };

  const lastEditedDate = (storyTranslation: StoryTranslation): Date | null => {
    const translatorLastActivity = storyTranslation?.translatorLastActivity
      ? new Date(storyTranslation.translatorLastActivity)
      : null;
    const reviewerLastActivity = storyTranslation?.reviewerLastActivity
      ? new Date(storyTranslation.reviewerLastActivity)
      : null;

    if (!translatorLastActivity) {
      return reviewerLastActivity;
    }
    if (!reviewerLastActivity) {
      return translatorLastActivity;
    }

    return new Date(
      Math.max(
        translatorLastActivity.getTime(),
        reviewerLastActivity.getTime(),
      ),
    );
  };

  const tableBody = storyTranslationSlice.map(
    (storyTranslationObj: StoryTranslation, index: number) => (
      <Tr
        key={`${storyTranslationObj?.storyId}${storyTranslationObj?.storyTranslationId}`}
        borderBottom={
          index === storyTranslationSlice.length - 1
            ? "1em solid transparent"
            : ""
        }
      >
        {showStoryTitle && (
          <Td>
            <Link isExternal href={`#/story/${storyTranslationObj?.storyId}`}>
              {storyTranslationObj?.title}
            </Link>
          </Td>
        )}

        <Td>
          <Badge
            background={getLevelVariant(storyTranslationObj?.level)}
            marginBottom="3px"
            marginTop="3px"
          >
            {`${convertLanguageTitleCase(
              storyTranslationObj?.language,
            )} | Level ${storyTranslationObj?.level}`}
          </Badge>
        </Td>
        <Td>{convertStageTitleCase(storyTranslationObj?.stage)}</Td>
        <Td>
          <Link
            isExternal
            href={`/#/user/${storyTranslationObj?.translatorId}`}
          >
            {storyTranslationObj?.translatorName}
          </Link>
        </Td>
        <Td>
          <Link isExternal href={`#/user/${storyTranslationObj?.reviewerId}`}>
            {storyTranslationObj?.reviewerName}
          </Link>
        </Td>
        <Td>{lastEditedDate(storyTranslationObj)?.toLocaleDateString?.()}</Td>
        <Td>
          <IconButton
            aria-label={`Delete story translation ${storyTranslationObj?.storyTranslationId} for story ${storyTranslationObj?.title}`}
            background="transparent"
            icon={<Icon as={MdDelete} />}
            width="fit-content"
            onClick={() => openModal(storyTranslationObj?.storyTranslationId)}
          />
        </Td>
      </Tr>
    ),
  );

  return (
    <Table
      borderRadius="12px"
      boxShadow="0px 0px 2px grey"
      margin="auto"
      size="sm"
      theme="gray"
      variant="striped"
      width={width}
    >
      <Thead>
        <Tr
          borderTop="1em solid transparent"
          borderBottom="0.5em solid transparent"
        >
          {showStoryTitle && <Th>STORY TITLE</Th>}

          <Th>LANGUAGE & LEVEL</Th>
          <Th>PROGRESS</Th>
          <Th>TRANSLATOR</Th>
          <Th>REVIEWER</Th>
          <Th>LAST EDITED</Th>
          <Th>ACTION</Th>
        </Tr>
      </Thead>
      <Tbody>
        {storyTranslationSlice.length === 0 && !loading ? (
          <EmptyTable filters={filters} />
        ) : (
          tableBody
        )}
      </Tbody>
      {confirmDeleteTranslation && (
        <ConfirmationModal
          confirmation={confirmDeleteTranslation}
          onClose={closeModal}
          onConfirmationClick={callSoftDeleteStoryTranslationMutation}
          confirmationMessage={
            MANAGE_STORY_TRANSLATIONS_TABLE_DELETE_TRANSLATION_CONFIRMATION
          }
          buttonMessage={
            MANAGE_STORY_TRANSLATIONS_TABLE_DELETE_TRANSLATION_BUTTON
          }
        />
      )}
      <TableCaption marginTop={1} paddingRight={0}>
        {paginator}
      </TableCaption>
    </Table>
  );
};

export default StoryTranslationsTable;
