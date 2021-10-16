import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Heading } from "@chakra-ui/react";
import UsersTable, { alphabeticalCompare } from "./UsersTable";
import { buildUsersQuery, User } from "../../APIClients/queries/UserQueries";

export type ManageUsersProps = {
  isTranslators: boolean;
};

const ManageUsers = ({ isTranslators }: ManageUsersProps) => {
  const query = buildUsersQuery();
  const [users, setUsers] = useState<User[]>([]);
  useQuery(query.string, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      const newUsers = [...data[query.fieldName]];
      newUsers.sort(alphabeticalCompare);
      setUsers(newUsers);
    },
  });
  return (
    <div style={{ textAlign: "center" }}>
      <Heading float="left" margin="20px 30px" size="lg">
        {`Manage ${isTranslators ? "Translators" : "Reviewers"}`}
      </Heading>
      {/* TODO: add filter component */}
      <UsersTable
        isTranslators={isTranslators}
        users={users}
        setUsers={setUsers}
      />
    </div>
  );
};

export default ManageUsers;
