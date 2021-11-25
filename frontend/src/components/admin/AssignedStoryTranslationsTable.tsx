import React, { useState, Dispatch, SetStateAction } from "react";
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
import { getLevelVariant } from "../../utils/StatusUtils";
import convertStageTitleCase from "../../utils/StageUtils";
import { convertLanguageTitleCase } from "../../utils/LanguageUtils";
import { generateSortFn } from "../../utils/Utils";

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
};

const AssignedStoryTranslationsTable = ({
  storyTranslations,
  setStoryTranslations,
  userId,
}: AssignedStoryTranslationsTableProps) => {
  const [isAscendingTitle, setIsAscendingTitle] = useState(true);
  const [isAscendingRole, setIsAscendingRole] = useState(true);
  const [isAscendingLanguage, setIsAscendingLanguage] = useState(true);
  const [isAscendingStage, setIsAscendingStage] = useState(true);

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
      >
        ASSIGN NEW STORY
      </Button>
    </Table>
  );
};

export default AssignedStoryTranslationsTable;
