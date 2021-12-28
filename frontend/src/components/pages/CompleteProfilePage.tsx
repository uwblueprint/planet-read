import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Box, Button, Flex } from "@chakra-ui/react";
import Header from "../navigation/Header";
import UserProfileForm from "../userProfile/UserProfileForm";
import {
  UPDATE_ME,
  UpdateMeResponse,
} from "../../APIClients/mutations/UserMutations";

const CompleteProfilePage = () => {
  const [name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [educationalQualification, setEducationalQualification] = useState("");
  const [languageExperience, setLanguageExperience] = useState("");

  const [updateMe] = useMutation<{
    response: UpdateMeResponse;
  }>(UPDATE_ME);

  const onSubmitClick = async () => {
    try {
      const [firstName, lastName] = name.split(" ");
      const tempAdditionalExperiences = {
        educationalQualification,
        languageExperience,
      };
      const additionalExperiences = JSON.stringify(tempAdditionalExperiences);
      const userData = {
        firstName,
        lastName,
        email,
        additionalExperiences,
      };
      await updateMe({
        variables: { userData },
      });
      window.location.href = `#/?welcome=true`;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Flex direction="column" height="100vh">
      <Header />
      <Flex direction="row" flex={1} margin="40px" marginLeft="90px">
        <UserProfileForm
          setFullName={setFullName}
          setEmail={setEmail}
          setEducationalQualification={setEducationalQualification}
          setLanguageExperience={setLanguageExperience}
        />
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
