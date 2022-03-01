import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useMutation } from "@apollo/client";
import { Icon } from "@chakra-ui/icon";
import { MdDelete, MdOutlineFileDownload } from "react-icons/md";
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
  Tooltip,
  Box,
} from "@chakra-ui/react";
import { StoryTranslation } from "../../APIClients/queries/StoryQueries";
import { getStoryTranslationProgress } from "../../utils/StageUtils";
import { getLevelVariant } from "../../utils/StatusUtils";
import ConfirmationModal from "../utils/ConfirmationModal";
import {
  SOFT_DELETE_STORY_TRANSLATION,
  SoftDeleteStoryTranslationResponse,
} from "../../APIClients/mutations/StoryMutations";
import {
  EXPORT_TOOL_TIP_COPY,
  MANAGE_STORY_TRANSLATIONS_TABLE_DELETE_TRANSLATION_BUTTON,
  MANAGE_STORY_TRANSLATIONS_TABLE_DELETE_TRANSLATION_CONFIRMATION,
} from "../../utils/Copy";
import EmptyTable from "./EmptyTable";
import { useFileDownload } from "../../utils/FileUtils";
import { exportStoryTranslationQuery } from "../../APIClients/queries/FileQueries";

export type StoryTranslationsTableProps = {
  storyTranslationSlice: StoryTranslation[];
  paginator: ReactNode;
  filters: { (data: string | null): void }[];
  loading: Boolean;
  width?: string;
  setQueryIsAscendingLastEdited?: Dispatch<SetStateAction<boolean>>;
};

interface StoryTranslationFieldSortDict {
  [field: string]: {
    sortFn: (a: StoryTranslation, b: StoryTranslation) => number;
    isAscending: boolean;
    setIsAscending: Dispatch<SetStateAction<boolean>>;
  };
}

const StoryTranslationsTable = ({
  storyTranslationSlice,
  paginator,
  filters,
  loading,
  width = "95%",
  setQueryIsAscendingLastEdited,
}: StoryTranslationsTableProps) => {
  const [isAscendingLastEdited, setIsAscendingLastEdited] = useState(false);
  const [confirmDeleteTranslation, setConfirmDeleteTranslation] =
    useState(false);
  const [idToDelete, setIdToDelete] = useState(0);

  const [storyTranslations, setStoryTranslations] = useState<
    StoryTranslation[]
  >(storyTranslationSlice);

  useEffect(() => {
    setStoryTranslations(storyTranslationSlice);
  }, [storyTranslationSlice]);

  const [deleteStoryTranslation] = useMutation<{
    response: SoftDeleteStoryTranslationResponse;
  }>(SOFT_DELETE_STORY_TRANSLATION);

  const [downloadFile] = useFileDownload(
    "story-translation",
    exportStoryTranslationQuery,
  );

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
        storyTranslationId: idToDelete,
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

  const dateSort = (t1: StoryTranslation, t2: StoryTranslation) => {
    const dateT1 = lastEditedDate(t1) || 0;
    const dateT2 = lastEditedDate(t2) || 0;
    const forwardCompare = +(dateT2 > dateT1); // 1 if dateT2 > dateT1
    const reverseCompare = +(dateT1 > dateT2); // 1 if dateT1 > dateT2
    return isAscendingLastEdited
      ? forwardCompare - reverseCompare
      : reverseCompare - forwardCompare;
  };
  const sortDict: StoryTranslationFieldSortDict = {
    lastEditedDate: {
      sortFn: dateSort,
      isAscending: isAscendingLastEdited,
      setIsAscending: setIsAscendingLastEdited,
    },
  };
  const sort = (field: string) => {
    const newStoryTranslations = [...storyTranslationSlice];
    const { sortFn, isAscending, setIsAscending } = sortDict[field];
    setIsAscending(!isAscending);
    newStoryTranslations.sort(sortFn);
    setStoryTranslations(newStoryTranslations);
  };

  const sortQuery = () => {
    if (setQueryIsAscendingLastEdited) {
      setQueryIsAscendingLastEdited(!isAscendingLastEdited);
      setIsAscendingLastEdited(!isAscendingLastEdited);
    }
  };

  const tableBody = storyTranslations.map(
    (storyTranslationObj: StoryTranslation, index: number) => (
      <Tr
        key={`${storyTranslationObj?.storyId}${storyTranslationObj?.storyTranslationId}`}
        borderBottom={
          index === storyTranslations.length - 1 ? "1em solid transparent" : ""
        }
      >
        <Td>
          <Link
            isExternal
            href={`#/review/${storyTranslationObj?.storyId}/${storyTranslationObj?.storyTranslationId}`}
          >
            {storyTranslationObj?.title}
          </Link>
        </Td>

        <Td>
          <Badge
            background={getLevelVariant(storyTranslationObj?.level)}
            marginBottom="3px"
            marginTop="3px"
          >
            {`${storyTranslationObj?.language} | Level ${storyTranslationObj?.level}`}
          </Badge>
        </Td>
        <Td>{getStoryTranslationProgress(storyTranslationObj)}</Td>
        <Td>
          <Link isExternal href={`#/user/${storyTranslationObj?.translatorId}`}>
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
          <Tooltip
            hasArrow
            label={EXPORT_TOOL_TIP_COPY}
            isDisabled={storyTranslationObj.stage === "PUBLISH"}
            placement="top"
          >
            <Box width="fit-content">
              <IconButton
                aria-label={`Export story translation ${storyTranslationObj?.storyTranslationId}`}
                background="transparent"
                icon={<Icon as={MdOutlineFileDownload} />}
                width="fit-content"
                isDisabled={storyTranslationObj.stage !== "PUBLISH"}
                onClick={() =>
                  downloadFile(storyTranslationObj.storyTranslationId)
                }
              />
            </Box>
          </Tooltip>
        </Td>
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
          <Th>STORY LINK</Th>

          <Th>LANGUAGE & LEVEL</Th>
          <Th>PROGRESS</Th>
          <Th>TRANSLATOR</Th>
          <Th>REVIEWER</Th>
          <Th
            cursor="pointer"
            onClick={
              setQueryIsAscendingLastEdited
                ? sortQuery
                : () => sort("lastEditedDate")
            }
          >{`LAST EDITED ${isAscendingLastEdited ? "↑" : "↓"}`}</Th>
          <Th>EXPORT</Th>
          <Th>ACTION</Th>
        </Tr>
      </Thead>
      <Tbody>
        {storyTranslations.length === 0 && !loading ? (
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
