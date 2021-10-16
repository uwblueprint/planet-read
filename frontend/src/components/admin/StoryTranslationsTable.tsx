import React from "react";
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
import { StoryTranslation } from "../../APIClients/queries/StoryQueries";
import convertLanguageTitleCase from "../../utils/LanguageUtils";
import convertStringTitleCase from "../../utils/Utils";

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
        <Td>{convertLanguageTitleCase(storyTranslationObj?.language)}</Td>
        <Td>{`Level ${storyTranslationObj?.level}`}</Td>
        <Td>{convertStringTitleCase(storyTranslationObj?.stage)}</Td>
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
            aria-label={`Delete story ${storyTranslationObj?.title}`}
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
          <Th>BOOK TITLE</Th>
          <Th>LANGUAGE</Th>
          <Th>LEVEL</Th>
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
