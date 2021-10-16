import React, { useState } from "react";
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
import { getLevelVariant } from "../../utils/StatusUtils";

export type UsersTableProps = {
  isTranslators?: boolean;
  users: User[];
  setUsers: (newState: User[]) => void;
};

const getFullName = (user: User) => `${user?.firstName} ${user?.lastName}`;
export const alphabeticalCompare = (u1: User, u2: User) =>
  getFullName(u1!).localeCompare(getFullName(u2!));

const UsersTable = ({
  isTranslators = false,
  users,
  setUsers,
}: UsersTableProps) => {
  const [isAscending, setIsAscending] = useState(true);

  const sortUsers = () => {
    setIsAscending(!isAscending);
    const revAlphabeticalCompare = (u1: User, u2: User) =>
      getFullName(u2!).localeCompare(getFullName(u1!));
    const newUsers = [...users];
    newUsers.sort(!isAscending ? alphabeticalCompare : revAlphabeticalCompare);
    setUsers(newUsers);
  };

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
      <Badge
        background={getLevelVariant(appvdLanguages[apprLang])}
        marginBottom="3px"
        marginTop="3px"
      >{`${convertLanguageTitleCase(apprLang)} | Level ${
        appvdLanguages[apprLang]
      }`}</Badge>
    ));

  const tableBody = users.map((userObj: User, index: number) => (
    <Tr
      borderBottom={index === users.length - 1 ? "1em solid transparent" : ""}
      key={`${userObj?.id}`}
    >
      <Td>
        <Link isExternal href={`/user/${userObj?.id}`}>
          {getFullName(userObj)}
        </Link>
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
          <Th cursor="pointer" onClick={() => sortUsers()}>{`NAME ${
            isAscending ? "↑" : "↓"
          }`}</Th>
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
