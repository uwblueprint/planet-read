import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Heading } from "@chakra-ui/react";
import UsersTable from "./UsersTable";
import { buildUsersQuery, User } from "../../APIClients/queries/UserQueries";

const ManageReviewers = () => {
  const query = buildUsersQuery();
  const [users, setUsers] = useState<User[]>([]);
  useQuery(query.string, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setUsers(data[query.fieldName]);
    },
  });
  return (
    <div style={{ textAlign: "center" }}>
      <Heading float="left" margin="20px 30px" size="lg">
        Manage Reviewers
      </Heading>
      {/* TODO: add filter component */}
      <UsersTable users={users} />
    </div>
  );
};

export default ManageReviewers;
