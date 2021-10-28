import React from "react";
import { useParams } from "react-router-dom";
import { Box } from "@chakra-ui/react";

type UserProfilePageProps = {
  userId: string | undefined;
};

const UserProfilePage = () => {
  const { userId } = useParams<UserProfilePageProps>();

  return (
    <Box textAlign="center">
      <h1>User Profile for {userId} :)</h1>
    </Box>
  );
};

export default UserProfilePage;
