import React, { useState } from "react";
import { Icon } from "@chakra-ui/icon";
import { MdDelete } from "react-icons/md";
import {
  Badge,
  Button,
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

  const titleSort = (t1: StoryTranslation, t2: StoryTranslation) =>
    isAscendingTitle
      ? t1.title.localeCompare(t2.title)
      : t2.title.localeCompare(t1.title);

  const roleSort = (t1: StoryTranslation, t2: StoryTranslation) =>
    isAscendingRole
      ? getRole(t1).localeCompare(getRole(t2))
      : getRole(t2).localeCompare(getRole(t1));

  const languageSort = (t1: StoryTranslation, t2: StoryTranslation) =>
    isAscendingLanguage
      ? t1.language.localeCompare(t2.language)
      : t2.language.localeCompare(t1.language);

  const stageSort = (t1: StoryTranslation, t2: StoryTranslation) =>
    isAscendingStage
      ? t1.stage.localeCompare(t2.stage)
      : t2.stage.localeCompare(t1.stage);

  const sort = (field: String) => {
    const newStoryTranslations = [...storyTranslations];
    switch (field) {
      case "title": {
        setIsAscendingTitle(!isAscendingTitle);

        newStoryTranslations.sort(titleSort);
        break;
      }
      case "role": {
        setIsAscendingRole(!isAscendingRole);

        newStoryTranslations.sort(roleSort);
        break;
      }
      case "language": {
        setIsAscendingLanguage(!isAscendingLanguage);

        newStoryTranslations.sort(languageSort);
        break;
      }
      case "stage": {
        setIsAscendingStage(!isAscendingStage);

        newStoryTranslations.sort(stageSort);
        break;
      }
      default: {
        break;
      }
    }
    setStoryTranslations(newStoryTranslations);
  };

  const tableBody = storyTranslations.map(
    (translation: StoryTranslation, index: number) => (
      <Tr
        borderBottom={
          index === storyTranslations.length - 1 ? "1em solid transparent" : ""
        }
        key={`${translation?.storyTranslationId}`}
      >
        <Td>{translation.title}</Td>
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
    ),
  );
  return (
    <Table
      borderRadius="12px"
      boxShadow="0px 0px 2px grey"
      size="sm"
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
          <Th>ACTION</Th>
        </Tr>
      </Thead>
      <Tbody>{tableBody}</Tbody>
      {/* <hr marginTop="-10px"/>  How do I add a horizontal line lol */}
      <Button
        variant="blueOutline"
        size="secondary"
        margin="5px 0px 15px 10px"
        width="200px"
        border="2px"
      >
        ASSIGN NEW STORY
      </Button>
    </Table>
  );
};

export default AssignedStoryTranslationsTable;
