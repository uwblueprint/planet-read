import React, { Dispatch, SetStateAction, useState } from "react";
import { Icon } from "@chakra-ui/icon";
import { MdDelete } from "react-icons/md";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import {
  Badge,
  Link,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Button,
} from "@chakra-ui/react";
import { convertLanguageTitleCase } from "../../utils/LanguageUtils";
import { getLevelVariant } from "../../utils/StatusUtils";
import {
  MANAGE_TESTS_TABLE_DELETE_TEST_BUTTON,
  MANAGE_TESTS_TABLE_DELETE_TEST_CONFIRMATION,
} from "../../utils/Copy";
import ConfirmationModal from "../utils/ConfirmationModal";
import { generateSortFn } from "../../utils/Utils";
import { StoryTranslationTest } from "../../APIClients/queries/StoryQueries";
import {
  SoftDeleteStoryTranslationResponse,
  SOFT_DELETE_STORY_TRANSLATION,
} from "../../APIClients/mutations/StoryMutations";

interface StoryTranslationTestsFieldSortDict {
  [field: string]: {
    sortFn: (a: StoryTranslationTest, b: StoryTranslationTest) => number;
    isAscending: boolean;
    setIsAscending: Dispatch<SetStateAction<boolean>>;
  };
}

export type StoryTestsTableProps = {
  storyTests: StoryTranslationTest[];
  setStoryTests: (newState: StoryTranslationTest[]) => void;
};

const StoryTestsTable = ({
  storyTests,
  setStoryTests,
}: StoryTestsTableProps) => {
  const [isAscendingName, setIsAscendingName] = useState(true);
  const [isAscendingDate, setIsAscendingDate] = useState(true);

  const [confirmDeleteTranslation, setConfirmDeleteTranslation] =
    useState(false);
  const [idToDelete, setIdToDelete] = useState(0);

  const [deleteStoryTranslation] = useMutation<{
    response: SoftDeleteStoryTranslationResponse;
  }>(SOFT_DELETE_STORY_TRANSLATION);

  const history = useHistory();

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

  /*
   * Compare the date submitted of two StoryTranslationTests based on
   * ascending/descending order
   */
  const dateSort = (t1: StoryTranslationTest, t2: StoryTranslationTest) => {
    const dateT1 = t1.dateSubmitted;
    const dateT2 = t2.dateSubmitted;
    const forwardCompare = +(dateT2 > dateT1); // 1 if dateT2 > dateT1
    const reverseCompare = +(dateT1 > dateT2); // 1 if dateT1 > dateT2
    return isAscendingDate
      ? forwardCompare - reverseCompare
      : reverseCompare - forwardCompare;
  };

  const sortDict: StoryTranslationTestsFieldSortDict = {
    name: {
      sortFn: generateSortFn<StoryTranslationTest>(
        "translatorName",
        isAscendingName,
      ),
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
    const newStoryTests = [...storyTests];
    const { sortFn, isAscending, setIsAscending } = sortDict[field];

    setIsAscending(!isAscending);
    newStoryTests.sort(sortFn);

    setStoryTests(newStoryTests);
  };

  const tableBody = storyTests.map(
    (storyTest: StoryTranslationTest, index: number) => (
      <Tr
        borderBottom={
          index === storyTests.length - 1 ? "1em solid transparent" : ""
        }
        key={`${storyTest.id}`}
      >
        <Td>
          <Link isExternal href={`/user/${storyTest.translatorId}`}>
            {storyTest.translatorName}
          </Link>
        </Td>
        <Td>
          <Badge
            background={getLevelVariant(storyTest.level)}
            marginBottom="3px"
            marginTop="3px"
          >
            {`${convertLanguageTitleCase(storyTest.language)} | Level ${
              storyTest.level
            }`}
          </Badge>
        </Td>
        <Td>{storyTest.dateSubmitted?.toLocaleDateString()}</Td>
        <Td>
          <Button
            borderRadius="8px"
            colorScheme="blue"
            size="secondary"
            onClick={() =>
              history.push(`/grade/${storyTest.storyId}/${storyTest.id}`)
            }
            width="110px"
            marginRight="32px"
          >
            Grade
          </Button>
          <IconButton
            aria-label={`Delete story test ${storyTest.id} for story ${storyTest.title}`}
            background="transparent"
            icon={<Icon as={MdDelete} />}
            width="fit-content"
            onClick={() => openModal(storyTest.id)}
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
      width="95%"
    >
      <Thead>
        <Tr
          borderTop="1em solid transparent"
          borderBottom="0.5em solid transparent"
        >
          <Th cursor="pointer" onClick={() => sort("name")}>{`NAME ${
            isAscendingName ? "↑" : "↓"
          }`}</Th>
          <Th>LANGUAGE & LEVEL</Th>
          <Th cursor="pointer" onClick={() => sort("date")}>{`DATE SUBMITTED ${
            isAscendingDate ? "↑" : "↓"
          }`}</Th>
          <Th width="18%">ACTION</Th>
        </Tr>
      </Thead>
      <Tbody>{tableBody}</Tbody>
      {confirmDeleteTranslation && (
        <ConfirmationModal
          confirmation={confirmDeleteTranslation}
          onClose={closeModal}
          onConfirmationClick={callSoftDeleteStoryTranslationMutation}
          confirmationMessage={MANAGE_TESTS_TABLE_DELETE_TEST_CONFIRMATION}
          buttonMessage={MANAGE_TESTS_TABLE_DELETE_TEST_BUTTON}
        />
      )}
    </Table>
  );
};

export default StoryTestsTable;
