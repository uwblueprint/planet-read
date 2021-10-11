import React from "react";

import { Icon } from "@chakra-ui/icon";
import { MdDelete } from "react-icons/md";
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
} from "@chakra-ui/react";
import { User } from "../../APIClients/queries/UserQueries";
import convertLanguageTitleCase from "../../utils/LanguageUtils";

export type UsersTableProps = {
  isTranslators?: boolean;
  users: User[];
};

const UsersTable = ({ isTranslators = false, users }: UsersTableProps) => {
  const approvedLanguages = users.map((userObj: User) => {
    const approvedLanguage = isTranslators
      ? userObj?.approvedLanguagesTranslation
      : userObj?.approvedLanguagesReview;
    return approvedLanguage
      ? JSON.parse(approvedLanguage!!.trim().replace(/'/g, '"'))
      : "";
  });

  const generateBadges = (appvdLanguages: any) =>
    Object.keys(appvdLanguages).map((apprLang: string) => (
      // TODO: determine badge color by label
      <Badge
        background="orange.50"
        marginBottom="3px"
        marginTop="3px"
      >{`${convertLanguageTitleCase(apprLang)} | Level ${
        appvdLanguages[apprLang]
      }`}</Badge>
    ));

  const tableBody = users.map((userObj: User, index: number) => (
    <Tr
      borderBottom={index === users.length - 1 ? "1em solid transparent" : ""}
    >
      <Td>
        <Link
          isExternal
          href={`/user/${userObj?.id}`}
        >{`${userObj?.firstName} ${userObj?.lastName}`}</Link>
      </Td>
      <Td>
        <Link href={`mailto:${userObj?.email}`}>{userObj?.email}</Link>
      </Td>
      <Td>{generateBadges(approvedLanguages[index])}</Td>
      {/* TODO: make delete button functional */}
      <Td>
        <IconButton
          aria-label={`Delete user ${userObj?.firstName} ${userObj?.lastName}`}
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
      borderCollapse="collapse"
      borderSpacing="0px"
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
          <Th>NAME</Th>
          <Th>EMAIL</Th>
          <Th>APPROVED LANGUAGES</Th>
          <Th>ACTION</Th>
        </Tr>
      </Thead>
      <Tbody>{tableBody}</Tbody>
    </Table>
  );
};

export default UsersTable;
