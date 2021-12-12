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
import DropdownIndicator from "../utils/DropdownIndicator";
import { languageOptions } from "../../constants/Languages";

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
            <Heading marginTop="24px" size="sm">
              Full name*
            </Heading>
            <Input type="name" />
            <Heading marginTop="24px" size="sm">
              Email*
            </Heading>
            <Input type="email" />
            <Heading marginTop="24px" size="sm">
              Educational qualifications*
            </Heading>
            <Textarea height="150px" type="qualifications" />
            <Heading marginTop="24px" size="sm">
              Language experience*
            </Heading>
            <Textarea height="150px" type="experience" />
          </FormControl>
          <Heading marginTop="24px" size="sm">
            Select language*
          </Heading>
          <Text marginBottom="12px">
            Select the language that you would like to start with. Additional
            languages can be added after signing up.
          </Text>
          <Box width="60%" marginBottom="200px">
            <Select
              placeholder="Select language"
              options={languageOptions}
              components={{ DropdownIndicator }}
            />
          </Box>
        </Flex>
        <Flex direction="column" flex={1} marginLeft="60px" marginTop="160px">
          <Heading size="sm">Upload your CV (optional)</Heading>
          <Flex
            align="center"
            background="#e8f0f6"
            border="2px"
            // this is blue.100 at 10% opacity
            borderColor="rgba(29, 108, 165, 0.1)"
            direction="column"
            height="250px"
            justify="center"
            maxWidth="80%"
            rounded="md"
          >
            <IconButton
              aria-label="Folder icon"
              background="transparent"
              color="blue.100"
              icon={<Icon as={MdFolder} width={16} height={16} />}
              marginBottom="16px"
              width="fit-content"
            />
            <Text>Drag & drop your files here (.PDF, .docx)</Text>
            <Button colorScheme="blue" marginTop="16px" width="160px">
              Browse Files
            </Button>
          </Flex>
          <Heading marginTop="24px" size="sm">
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
