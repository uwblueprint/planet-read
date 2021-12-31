import React, { Dispatch, SetStateAction, useState } from "react";
import { Icon } from "@chakra-ui/icon";
import { MdDelete } from "react-icons/md";
import {
  Link,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
} from "@chakra-ui/react";
import { useMutation } from "@apollo/client";

import {
  MANAGE_STORY_TABLE_DELETE_STORY_BUTTON,
  MANAGE_STORY_TABLE_DELETE_STORY_CONFIRMATION,
} from "../../utils/Copy";
import ConfirmationModal from "../utils/ConfirmationModal";
import { generateSortFn } from "../../utils/Utils";
import { Story } from "../../APIClients/queries/StoryQueries";
import {
  SOFT_DELETE_STORY,
  SoftDeleteStoryResponse,
} from "../../APIClients/mutations/StoryMutations";
import EmptyTable from "./EmptyTable";

interface StoriesFieldSortDict {
  [field: string]: {
    sortFn: (a: Story, b: Story) => number;
    isAscending: boolean;
    setIsAscending: Dispatch<SetStateAction<boolean>>;
  };
}

export type StoriesTableProps = {
  stories: Story[];
  setStories: (newState: Story[]) => void;
  filters: { (data: any | null): void }[];
  loading: boolean;
};

const StoriesTable = ({
  stories,
  setStories,
  filters,
  loading,
}: StoriesTableProps) => {
  const [isAscendingName, setIsAscendingName] = useState(true);
  const [isAscendingDate, setIsAscendingDate] = useState(true);

  const [confirmDeleteStory, setConfirmDeleteStory] = useState(false);
  const [idToDelete, setIdToDelete] = useState(0);

  const [softDeleteStory] = useMutation<{
    softDeleteStory: SoftDeleteStoryResponse;
  }>(SOFT_DELETE_STORY);

  const closeModal = () => {
    setIdToDelete(0);
    setConfirmDeleteStory(false);
  };

  const openModal = (id: number) => {
    setIdToDelete(id);
    setConfirmDeleteStory(true);
  };

  const callSoftDeleteStoryMutation = async () => {
    try {
      await softDeleteStory({
        variables: {
          id: idToDelete,
        },
      });
      window.location.reload();
    } catch (error) {
      window.alert(`Error occurred, please try again. Error: ${error}`);
    }
  };

  /*
   * Compare the date submitted of two Stories based on
   * ascending/descending order
   */
  const dateSort = (t1: Story, t2: Story) => {
    const dateT1 = t1.dateUploaded;
    const dateT2 = t2.dateUploaded;
    const forwardCompare = +(dateT2 > dateT1); // 1 if dateT2 > dateT1
    const reverseCompare = +(dateT1 > dateT2); // 1 if dateT1 > dateT2
    return isAscendingDate
      ? forwardCompare - reverseCompare
      : reverseCompare - forwardCompare;
  };

  const sortDict: StoriesFieldSortDict = {
    name: {
      sortFn: generateSortFn<Story>("title", isAscendingName),
      isAscending: isAscendingName,
      setIsAscending: setIsAscendingName,
    },
    date: {
      sortFn: dateSort,
      isAscending: isAscendingDate,
      setIsAscending: setIsAscendingDate,
    },
  };

  const sort = (field: string) => {
    const newStories = [...stories];
    const { sortFn, isAscending, setIsAscending } = sortDict[field];
    setIsAscending(!isAscending);
    newStories.sort(sortFn);
    setStories(newStories);
  };

  const tableBody = stories.map((story: Story, index: number) => (
    <Tr
      borderBottom={index === stories.length - 1 ? "1em solid transparent" : ""}
      key={`${story.id}`}
    >
      <Td>
        <Link isExternal href={`#/story/${story.id}`}>
          {story.title}
        </Link>
      </Td>
      <Td>{new Date(story.dateUploaded).toLocaleDateString()}</Td>
      <Td>
        <IconButton
          aria-label={`Delete story ${story.title}`}
          background="transparent"
          icon={<Icon as={MdDelete} />}
          width="fit-content"
          onClick={() => openModal(story.id)}
        />
      </Td>
    </Tr>
  ));

  return (
    <Table
      borderRadius="12px"
      boxShadow="0px 0px 2px grey"
      margin="auto"
      size="sm"
      theme="gray"
      variant="striped"
      width="95%"
    >
      <Thead>
        <Tr
          borderTop="1em solid transparent"
          borderBottom="0.5em solid transparent"
        >
          <Th cursor="pointer" onClick={() => sort("name")}>{`STORY TITLE ${
            isAscendingName ? "↑" : "↓"
          }`}</Th>
          <Th cursor="pointer" onClick={() => sort("date")}>{`DATE UPLOADED ${
            isAscendingDate ? "↑" : "↓"
          }`}</Th>
          <Th width="18%">ACTION</Th>
        </Tr>
      </Thead>
      <Tbody>
        {stories.length === 0 && !loading ? (
          <EmptyTable filters={filters} />
        ) : (
          tableBody
        )}
      </Tbody>
      {confirmDeleteStory && (
        <ConfirmationModal
          confirmation={confirmDeleteStory}
          onClose={closeModal}
          onConfirmationClick={() => callSoftDeleteStoryMutation()}
          confirmationMessage={MANAGE_STORY_TABLE_DELETE_STORY_CONFIRMATION}
          buttonMessage={MANAGE_STORY_TABLE_DELETE_STORY_BUTTON}
        />
      )}
    </Table>
  );
};

export default StoriesTable;
