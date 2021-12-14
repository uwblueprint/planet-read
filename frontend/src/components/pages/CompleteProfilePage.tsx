import React from "react";
import { Box, Button, Flex } from "@chakra-ui/react";
import Header from "../navigation/Header";
import UserProfileForm from "../userProfile/UserProfileForm";

const CompleteProfilePage = () => {
  const onSubmitClick = () => {
    window.location.href = `/`;
  };

  return (
    <Flex direction="column" height="100vh">
      <Header />
      <Flex direction="row" flex={1} margin="40px" marginLeft="90px">
        <UserProfileForm />
      </Flex>
      <Flex
        alignItems="center"
        boxShadow="0 0 12px -9px rgba(0, 0, 0, 0.7)"
        direction="row"
        height="90px"
        justify="flex-end"
        padding="20px 30px"
      >
        <Box>
          <Button
            colorScheme="blue"
            marginLeft="24px"
            marginRight="48px"
            onClick={onSubmitClick}
            width="240px"
          >
            SUBMIT FOR REVIEW
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};

export default CompleteProfilePage;
