import React from "react";
import Select from "react-select";
import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Heading,
  IconButton,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icon";
import { MdFolder } from "react-icons/md";
import Header from "../navigation/Header";

const DropdownIndicator = () => {
  return (
    <Box
      borderLeft="5px solid transparent"
      borderRight="5px solid transparent"
      borderTop="9px solid black"
      margin="10px"
    />
  );
};

const CompleteProfilePage = () => {
  const onSubmitClick = () => {
    window.location.href = `/`;
  };

  return (
    <Flex direction="column" height="100vh">
      <Header />
      <Flex direction="row" flex={1} marginLeft="50px">
        <Flex direction="column" margin="40px" flex={1} maxWidth="50%">
          <Heading size="lg">Complete your profile!</Heading>
          <Text marginBottom="20px">
            For the purposes of this platform, please enter your details
          </Text>
          <FormControl>
            <Heading size="sm" marginTop="24px">
              Full name*
            </Heading>
            <Input type="name" />
            <Heading size="sm" marginTop="24px">
              Email*
            </Heading>
            <Input type="email" />
            <Heading size="sm" marginTop="24px">
              Educational qualifications*
            </Heading>
            <Textarea type="qualifications" height="150px" />
            <Heading size="sm" marginTop="24px">
              Language experience*
            </Heading>
            <Textarea type="experience" height="150px" />
          </FormControl>
          <Heading size="sm" marginTop="24px">
            Select language*
          </Heading>
          <Text marginBottom="12px">
            Select the language that you would like to start with. Additional
            languages can be added after signing up.
          </Text>
          <Box width="60%">
            <Select
              placeholder="Select language"
              components={{ DropdownIndicator }}
            />
          </Box>
        </Flex>
        <Flex direction="column" marginTop="160px" flex={1} marginLeft="60px">
          <Heading size="sm">Upload your CV (optional)</Heading>
          <Flex
            direction="column"
            border="2px"
            borderColor="rgba(29, 108, 165, 0.4)"
            maxWidth="80%"
            height="250px"
            rounded="md"
            bg="#e8f0f6"
            align="center"
            justify="center"
          >
            <IconButton
              aria-label="Folder icon"
              background="transparent"
              icon={<Icon as={MdFolder} width={16} height={16} />}
              width="fit-content"
              marginBottom="16px"
              color="#1d6ca5"
            />
            <Text>Drag & drop your files here (.PDF, .docx)</Text>
            <Button colorScheme="blue" marginTop="16px" width="160px">
              Browse Files
            </Button>
          </Flex>
          <Heading size="sm" marginTop="24px">
            Uploaded files
          </Heading>
          <Text>Drag & drop a file or browse files to upload a CV.</Text>
        </Flex>
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
            width="240px"
            onClick={onSubmitClick}
          >
            SUBMIT FOR REVIEW
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};

export default CompleteProfilePage;
