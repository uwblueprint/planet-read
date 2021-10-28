import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Box, Flex, Heading } from "@chakra-ui/react";
import UsersTable, { alphabeticalCompare } from "./UsersTable";
import { buildUsersQuery, User } from "../../APIClients/queries/UserQueries";
import UsersTableFilter from "./UsersTableFilter";
import { convertTitleCaseToLanguage } from "../../utils/LanguageUtils";

export type ManageUsersProps = {
  isTranslators: boolean;
};

const ManageUsers = ({ isTranslators }: ManageUsersProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [language, setLanguage] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string | null>(null);
  const query = buildUsersQuery(
    isTranslators,
    convertTitleCaseToLanguage(language || ""),
    parseInt(level || "", 10) || 0,
    searchText || "",
  );

  useQuery(query.string, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      const newUsers = [...data[query.fieldName]];
      newUsers.sort(alphabeticalCompare);
      setUsers(newUsers);
    },
  });
  return (
    <Box textAlign="center">
      <Flex>
        <Heading float="left" margin="20px 30px" size="lg">
          {`Manage ${isTranslators ? "Translators" : "Reviewers"}`}
        </Heading>
      </Flex>
      <UsersTableFilter
        language={language}
        setLanguage={setLanguage}
        level={level}
        setLevel={setLevel}
        searchText={searchText}
        setSearchText={setSearchText}
      />
      <UsersTable
        isTranslators={isTranslators}
        users={users}
        setUsers={setUsers}
      />
    </Box>
  );
};

export default ManageUsers;
