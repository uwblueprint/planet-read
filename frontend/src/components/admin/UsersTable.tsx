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
  const approvedLanguanges = users.map((userObj: User) => {
    const approvedLanguange = isTranslators
      ? userObj?.approvedLanguagesTranslation
      : userObj?.approvedLanguagesReview;
    return approvedLanguange
      ? JSON.parse(approvedLanguange!!.trim().replace(/'/g, '"'))
      : "";
  });

  const generateBadges = (approvedLanguages: any) =>
    Object.keys(approvedLanguages).map((apprLang: string) => (
      // TODO: determine badge color by label
      <Badge background="orange.50">{`${convertLanguageTitleCase(
        apprLang,
      )} | Level ${approvedLanguages[apprLang]}`}</Badge>
    ));

  const tableBody = users.map((userObj: User, index: number) => (
    <Tr>
      <Td>
        <Link
          href={`/user/${userObj?.id}`}
        >{`${userObj?.firstName} ${userObj?.lastName}`}</Link>
      </Td>
      <Td>
        <Link href={`mailto:${userObj?.email}`}>{userObj?.email}</Link>
      </Td>
      <Td>{generateBadges(approvedLanguanges[index])}</Td>
      {/* TODO: make delete button functional */}
      <Td>
        <IconButton
          aria-label={`Delete user ${userObj?.firstName} ${userObj?.lastName}`}
          background="tranparent"
          width="fit-content"
          icon={<Icon as={MdDelete} />}
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
        <Tr border="1em solid transparent">
          <Th margin="30px">NAME</Th>
          <Th margin="30px">EMAIL</Th>
          <Th margin="30px">APPROVED LANGUAGES</Th>
          <Th margin="30px">ACTION</Th>
        </Tr>
      </Thead>
      <Tbody>{tableBody}</Tbody>
    </Table>
  );
};

export default UsersTable;
