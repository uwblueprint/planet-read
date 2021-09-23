import React from "react";
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
} from "@chakra-ui/react";
import { StoryTranslation } from "../../APIClients/queries/StoryQueries";
import { convertLanguageTitleCase } from "../../utils/LanguageUtils";
import convertStageTitleCase from "../../utils/StageUtils";
import { getLevelVariant } from "../../utils/StatusUtils";

export type StoryTranslationsTableProps = {
  storyTranslations: StoryTranslation[];
};

const StoryTranslationsTable = ({
  storyTranslations,
}: StoryTranslationsTableProps) => {
  const tableBody = storyTranslations.map(
    (storyTranslationObj: StoryTranslation, index: number) => (
      <Tr
        key={`${storyTranslationObj?.storyId}${storyTranslationObj?.id}`}
        borderBottom={
          index === storyTranslations.length - 1 ? "1em solid transparent" : ""
        }
      >
        <Td>
          <Link
            isExternal
            href={`/story/${storyTranslationObj?.storyId}/${storyTranslationObj?.id}`}
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
            {`${convertLanguageTitleCase(
              storyTranslationObj?.language,
            )} | Level ${storyTranslationObj?.level}`}
          </Badge>
        </Td>
        <Td>{convertStageTitleCase(storyTranslationObj?.stage)}</Td>
        <Td>
          <Link isExternal href={`/user/${storyTranslationObj?.translatorId}`}>
            {storyTranslationObj?.translatorName}
          </Link>
        </Td>
        <Td>
          <Link isExternal href={`/user/${storyTranslationObj?.reviewerId}`}>
            {storyTranslationObj?.reviewerName}
          </Link>
        </Td>
        <Td>
          <IconButton
            aria-label={`Delete story translation ${storyTranslationObj?.id} for story ${storyTranslationObj?.title}`}
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
          <Th>STORY TITLE</Th>
          <Th>LANGUAGE & LEVEL</Th>
          <Th>PROGRESS</Th>
          <Th>TRANSLATOR</Th>
          <Th>REVIEWER</Th>
          <Th>ACTION</Th>
        </Tr>
      </Thead>
      <Tbody>{tableBody}</Tbody>
    </Table>
  );
};

export default StoryTranslationsTable;