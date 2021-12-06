import React, { useState, Dispatch, SetStateAction } from "react";
import { useMutation } from "@apollo/client";
import { Icon } from "@chakra-ui/icon";
import { MdDelete } from "react-icons/md";
import {
  Badge,
  Button,
  Link,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
} from "@chakra-ui/react";
import { StoryTranslation } from "../../APIClients/queries/StoryQueries";
import {
  ASSIGN_REVIEWER,
  AssignReviewerResponse,
  CREATE_TRANSLATION,
  CreateTranslationResponse,
} from "../../APIClients/mutations/StoryMutations";
import { getLevelVariant } from "../../utils/StatusUtils";
import convertStageTitleCase from "../../utils/StageUtils";
import { convertLanguageTitleCase } from "../../utils/LanguageUtils";
import { ApprovedLanguagesMap, generateSortFn } from "../../utils/Utils";
import ConfirmationModal from "../utils/ConfirmationModal";
import {
  ASSIGN_STORY_BUTTON,
  ASSIGN_STORY_CONFIRMATION,
} from "../../utils/Copy";
import AssignStoryModal, { StoryToAssign } from "../utils/AssignStoryModal";
import { StoryAssignStage } from "../../constants/Enums";

interface AssignedStoryTranslationsFieldSortDict {
  [field: string]: {
    sortFn: (a: StoryTranslation, b: StoryTranslation) => number;
    isAscending: boolean;
    setIsAscending: Dispatch<SetStateAction<boolean>>;
  };
}

export type AssignedStoryTranslationsTableProps = {
  storyTranslations: StoryTranslation[];
  setStoryTranslations: (newStoryTranslations: StoryTranslation[]) => void;
  userId: number;
  approvedLanguagesTranslation: ApprovedLanguagesMap | undefined;
  approvedLanguagesReview: ApprovedLanguagesMap | undefined;
  setStoryAssignStage: (newStage: StoryAssignStage) => void;
};

const AssignedStoryTranslationsTable = ({
  storyTranslations,
  setStoryTranslations,
  userId,
  approvedLanguagesTranslation,
  approvedLanguagesReview,
  setStoryAssignStage,
}: AssignedStoryTranslationsTableProps) => {
  const [isAscendingTitle, setIsAscendingTitle] = useState(true);
  const [isAscendingRole, setIsAscendingRole] = useState(true);
  const [isAscendingLanguage, setIsAscendingLanguage] = useState(true);
  const [isAscendingStage, setIsAscendingStage] = useState(true);

  const [assignStory, setAssignStory] = useState(false);
  const [confirmAssignStory, setConfirmAssignStory] = useState(false);

  const [storyToAssign, setStoryToAssign] = useState<StoryToAssign | null>(
    null,
  );

  const closeAssignStoryModal = (cancelled = true) => {
    setAssignStory(false);
    if (cancelled) {
      setStoryAssignStage(StoryAssignStage.CANCELLED);
    }
  };
  const openAssignStoryModal = () => {
    setAssignStory(true);
  };

  const closeConfirmAssignStoryModal = () => {
    setConfirmAssignStory(false);
  };
  const openConfirmAssignStoryModal = () => {
    setConfirmAssignStory(true);
  };

  const getRole = (translation: StoryTranslation) => {
    if (userId === translation.translatorId) {
      return "Translator";
    }
    if (userId === translation.reviewerId) {
      return "Reviewer";
    }
    return "Error";
  };

  const roleSort = (t1: StoryTranslation, t2: StoryTranslation) =>
    isAscendingRole
      ? getRole(t1).localeCompare(getRole(t2))
      : getRole(t2).localeCompare(getRole(t1));

  const sortDict: AssignedStoryTranslationsFieldSortDict = {
    title: {
      sortFn: generateSortFn<StoryTranslation>("title", isAscendingTitle),
      isAscending: isAscendingTitle,
      setIsAscending: setIsAscendingTitle,
    },
    role: {
      sortFn: roleSort,
      isAscending: isAscendingRole,
      setIsAscending: setIsAscendingRole,
    },
    language: {
      sortFn: generateSortFn<StoryTranslation>("language", isAscendingLanguage),
      isAscending: isAscendingLanguage,
      setIsAscending: setIsAscendingLanguage,
    },
    stage: {
      sortFn: generateSortFn<StoryTranslation>("stage", isAscendingStage),
      isAscending: isAscendingStage,
      setIsAscending: setIsAscendingStage,
    },
  };

  const sort = (field: string) => {
    const newStoryTranslations = [...storyTranslations];
    const { sortFn, isAscending, setIsAscending } = sortDict[field];

    setIsAscending(!isAscending);
    newStoryTranslations.sort(sortFn);

    setStoryTranslations(newStoryTranslations);
  };

  const [createTranslation] = useMutation<{
    createStoryTranslation: CreateTranslationResponse;
  }>(CREATE_TRANSLATION);
  const assignTranslator = async (): Promise<string | null> => {
    try {
      const storyTranslationData = {
        storyId: storyToAssign!!.storyId,
        translatorId: userId,
        language: storyToAssign!!.language,
      };
      const result = await createTranslation({
        variables: { storyTranslationData },
      });
      return result.data?.createStoryTranslation.story.id
        ? null
        : "Error assigning user as translator!";
    } catch (err) {
      return err as string;
    }
  };

  const [assignUserAsReviewer] = useMutation<{
    assignUserAsReviewer: AssignReviewerResponse;
  }>(ASSIGN_REVIEWER);
  const assignReviewer = async (): Promise<string | null> => {
    try {
      const result = await assignUserAsReviewer({
        variables: {
          storyTranslationId: storyToAssign!!.storyTranslationId,
          userId,
        },
      });
      return result.data?.assignUserAsReviewer.ok
        ? null
        : "Error assigning user as reviewer!";
    } catch (err) {
      return err as string;
    }
  };

  const onConfirmAssignStory = async () => {
    const assignUser = storyToAssign!!.storyTranslationId
      ? assignReviewer
      : assignTranslator;

    const err = await assignUser();
    closeAssignStoryModal(false);
    closeConfirmAssignStoryModal();

    if (err !== null) {
      window.alert(err);
    } else {
      setStoryAssignStage(StoryAssignStage.SUCCESS);
      // TODO: remove this line and add story translation locally
      window.location.reload();
    }
  };

  const tableBody = storyTranslations.map((translation: StoryTranslation) => (
    <Tr key={`${translation?.storyTranslationId}`}>
      <Td>
        <Link
          isExternal
          href={`/story/${translation.storyId}/${translation.storyTranslationId}`}
        >
          {translation.title}
        </Link>
      </Td>
      <Td>{getRole(translation)}</Td>
      <Td>
        <Badge
          background={getLevelVariant(translation.level)}
          marginBottom="3px"
          marginTop="3px"
        >{`${convertLanguageTitleCase(translation.language)} | Level ${
          translation.level
        }`}</Badge>
      </Td>
      <Td>{convertStageTitleCase(translation.stage)}</Td>
      <Td>
        <IconButton
          aria-label={`Delete story translation for ${translation.title}`}
          background="transparent"
          icon={<Icon as={MdDelete} />}
          width="fit-content"
        />
      </Td>
    </Tr>
  ));
  return (
    <>
      <Table
        borderRadius="12px"
        boxShadow="0px 0px 2px grey"
        theme="gray"
        variant="striped"
        width="100%"
      >
        <Thead>
          <Tr
            borderTop="1em solid transparent"
            borderBottom="0.5em solid transparent"
          >
            <Th cursor="pointer" onClick={() => sort("title")}>
              {`BOOK TITLE ${isAscendingTitle ? "↑" : "↓"}`}{" "}
            </Th>
            <Th cursor="pointer" onClick={() => sort("role")}>{`ROLE ${
              isAscendingRole ? "↑" : "↓"
            }`}</Th>
            <Th
              cursor="pointer"
              onClick={() => sort("language")}
            >{`LANGUAGE & LEVEL ${isAscendingLanguage ? "↑" : "↓"}`}</Th>
            <Th cursor="pointer" onClick={() => sort("stage")}>{`PROGRESS ${
              isAscendingStage ? "↑" : "↓"
            }`}</Th>
            <Th width="7%">ACTION</Th>
          </Tr>
        </Thead>
        <Tbody>{tableBody}</Tbody>
        <Button
          border="2px"
          margin="10px 0px 15px 10px"
          size="secondary"
          variant="blueOutline"
          width="200px"
          onClick={openAssignStoryModal}
        >
          ASSIGN NEW STORY
        </Button>
      </Table>
      {assignStory && (
        <AssignStoryModal
          isOpen={assignStory}
          onClose={closeAssignStoryModal}
          onAssignStory={(story) => {
            openConfirmAssignStoryModal();
            setStoryToAssign(story);
          }}
          approvedLanguagesTranslation={approvedLanguagesTranslation!}
          approvedLanguagesReview={approvedLanguagesReview!}
        />
      )}
      {confirmAssignStory && (
        <ConfirmationModal
          confirmation={confirmAssignStory}
          onConfirmationClick={onConfirmAssignStory}
          onClose={closeConfirmAssignStoryModal}
          confirmationMessage={ASSIGN_STORY_CONFIRMATION}
          buttonMessage={ASSIGN_STORY_BUTTON}
        />
      )}
    </>
  );
};

export default AssignedStoryTranslationsTable;
