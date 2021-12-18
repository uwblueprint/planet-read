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
  UnassignReviewerResponse,
  SoftDeleteStoryTranslationResponse,
  SOFT_DELETE_STORY_TRANSLATION,
  UNASSIGN_REVIEWER,
} from "../../APIClients/mutations/StoryMutations";
import { getLevelVariant } from "../../utils/StatusUtils";
import convertStageTitleCase from "../../utils/StageUtils";
import { convertLanguageTitleCase } from "../../utils/LanguageUtils";
import { ApprovedLanguagesMap, generateSortFn } from "../../utils/Utils";
import ConfirmationModal from "../utils/ConfirmationModal";
import {
  ASSIGN_STORY_BUTTON,
  ASSIGN_STORY_CONFIRMATION,
  UNASSIGN_REVIEWER_FROM_STORY_TRANSLATION_CONFIRMATION,
  UNASSIGN_TRANSLATOR_FROM_STORY_TRANSLATION_CONFIRMATION,
  UNASSIGN_USER_FROM_STORY_TRANSLATION_BUTTON,
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
  isAdmin?: boolean;
};

const AssignedStoryTranslationsTable = ({
  storyTranslations,
  setStoryTranslations,
  userId,
  approvedLanguagesTranslation,
  approvedLanguagesReview,
  setStoryAssignStage,
  isAdmin = false,
}: AssignedStoryTranslationsTableProps) => {
  const [isAscendingTitle, setIsAscendingTitle] = useState(true);
  const [isAscendingRole, setIsAscendingRole] = useState(true);
  const [isAscendingLanguage, setIsAscendingLanguage] = useState(true);
  const [isAscendingStage, setIsAscendingStage] = useState(true);

  const [confirmUnassignUser, setConfirmUnassignUser] = useState(false);
  const [translationToRemoveUser, setTranslationToRemoveUser] =
    useState<StoryTranslation | null>(null);

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

  const closeConfirmUnassignUserModal = () => {
    setTranslationToRemoveUser(null);
    setConfirmUnassignUser(false);
  };
  const openConfirmUnassignUserModal = (translation: StoryTranslation) => {
    setTranslationToRemoveUser(translation);
    setConfirmUnassignUser(true);
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

  const [deleteStoryTranslation] = useMutation<{
    response: SoftDeleteStoryTranslationResponse;
  }>(SOFT_DELETE_STORY_TRANSLATION);
  const unassignTranslator = async (storyTranslationId: number) => {
    await deleteStoryTranslation({
      variables: {
        id: storyTranslationId,
      },
    });
    return null;
  };

  const [removeReviewer] = useMutation<{
    removeReviewerFromStoryTranslation: UnassignReviewerResponse;
  }>(UNASSIGN_REVIEWER);
  const unassignReviewer = async (
    storyTranslationId: number,
  ): Promise<string | null> => {
    try {
      const result = await removeReviewer({
        variables: {
          storyTranslationId,
        },
      });
      return result.data?.removeReviewerFromStoryTranslation.ok
        ? null
        : "Error removing user from story translation!";
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

  const onConfirmUnassignUser = async () => {
    const storyTranslation = translationToRemoveUser!;
    const removeUser =
      getRole(storyTranslation) === "Translator"
        ? unassignTranslator
        : unassignReviewer;

    const err = await removeUser(storyTranslation.storyTranslationId);
    closeConfirmUnassignUserModal();

    if (err !== null) {
      window.alert(err);
    } else {
      window.location.reload();
    }
  };

  const generateStoryTranslationLink = (translation: StoryTranslation) => {
    const suffix = `${translation.storyId}/${translation.storyTranslationId}`;
    if (isAdmin) {
      return `/story/${suffix}`;
    }
    if (getRole(translation) === "Translator") {
      return `/translation/${suffix}`;
    }
    return `/review/${suffix}`;
  };

  const tableBody = storyTranslations.map((translation: StoryTranslation) => (
    <Tr key={`${translation?.storyTranslationId}`}>
      <Td>
        <Link isExternal href={generateStoryTranslationLink(translation)}>
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
      {isAdmin && (
        <Td>
          <IconButton
            aria-label={`Delete story translation for ${translation.title}`}
            background="transparent"
            icon={<Icon as={MdDelete} />}
            width="fit-content"
            onClick={() => openConfirmUnassignUserModal(translation)}
          />
        </Td>
      )}
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
            {isAdmin && <Th width="7%">ACTION</Th>}
          </Tr>
        </Thead>
        <Tbody>{tableBody}</Tbody>
        {isAdmin && (
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
        )}
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
      {confirmUnassignUser && (
        <ConfirmationModal
          confirmation={confirmUnassignUser}
          onConfirmationClick={onConfirmUnassignUser}
          onClose={closeConfirmUnassignUserModal}
          confirmationMessage={
            /* eslint-disable */
            translationToRemoveUser
              ? getRole(translationToRemoveUser) === "Translator"
                ? UNASSIGN_TRANSLATOR_FROM_STORY_TRANSLATION_CONFIRMATION
                : UNASSIGN_REVIEWER_FROM_STORY_TRANSLATION_CONFIRMATION
              : ""
            /* eslint-enable */
          }
          buttonMessage={UNASSIGN_USER_FROM_STORY_TRANSLATION_BUTTON}
        />
      )}
    </>
  );
};

export default AssignedStoryTranslationsTable;