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
import { useMutation } from "@apollo/client";
import { User } from "../../APIClients/queries/UserQueries";
import { convertLanguageTitleCase } from "../../utils/LanguageUtils";
import { getLevelVariant } from "../../utils/StatusUtils";
import {
  MANAGE_USERS_TABLE_DELETE_USER_BUTTON,
  MANAGE_USERS_TABLE_DELETE_USER_CONFIRMATION,
} from "../../utils/Copy";
import ConfirmationModal from "../utils/ConfirmationModal";
import {
  SoftDeleteUserResponse,
  SOFT_DELETE_USER,
} from "../../APIClients/mutations/UserMutations";
import { parseApprovedLanguages } from "../../utils/Utils";
import EmptyTable from "./EmptyTable";

export type UsersTableProps = {
  isTranslators?: boolean;
  users: User[];
  setUsers: (newState: User[]) => void;
  filters: { (data: string | null): void }[];
  loading: Boolean;
};

const getFullName = (user: User) => `${user?.firstName} ${user?.lastName}`;
export const alphabeticalCompare = (u1: User, u2: User) =>
  getFullName(u1!).localeCompare(getFullName(u2!));

const UsersTable = ({
  isTranslators = false,
  users,
  filters,
  setUsers,
  loading,
}: UsersTableProps) => {
  const [isAscending, setIsAscending] = useState(true);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(false);
  const [idToDelete, setIdToDelete] = useState(0);

  const [deleteUser] = useMutation<{
    response: SoftDeleteUserResponse;
  }>(SOFT_DELETE_USER);

  const closeModal = () => {
    setIdToDelete(0);
    setConfirmDeleteUser(false);
  };

  const openModal = (id: number) => {
    setIdToDelete(id);
    setConfirmDeleteUser(true);
  };

  const callSoftDeleteUserMutation = async () => {
    await deleteUser({
      variables: {
        id: idToDelete,
      },
    });
    closeModal();
    window.location.reload();
  };

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

    return parseApprovedLanguages(approvedLanguage);
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
        <Link isExternal to={`/user/${userObj?.id}`}>
          {getFullName(userObj)}
        </Link>
      </Td>
      <Td>
        <Link href={`mailto:${userObj?.email}`}>{userObj?.email}</Link>
      </Td>
      <Td>{generateBadges(approvedLanguages[index])}</Td>
      <Td>
        <IconButton
          aria-label={`Delete user ${userObj?.firstName} ${userObj?.lastName}`}
          background="transparent"
          icon={<Icon as={MdDelete} />}
          width="fit-content"
          onClick={() => openModal(parseInt(userObj?.id!, 10))}
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
      <Tbody>
        {users.length === 0 && !loading ? (
          <EmptyTable filters={filters} />
        ) : (
          tableBody
        )}
      </Tbody>
      {confirmDeleteUser && (
        <ConfirmationModal
          confirmation={confirmDeleteUser}
          onClose={closeModal}
          onConfirmationClick={callSoftDeleteUserMutation}
          confirmationMessage={MANAGE_USERS_TABLE_DELETE_USER_CONFIRMATION}
          buttonMessage={MANAGE_USERS_TABLE_DELETE_USER_BUTTON}
        />
      )}
    </Table>
  );
};

export default UsersTable;
