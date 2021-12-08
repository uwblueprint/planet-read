import React from "react";
import Select from "react-select";
import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Heading,
  Text,
  Textarea,
} from "@chakra-ui/react";
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
  return (
    <Flex direction="column" height="100vh">
      <Header />
      <Flex direction="row" flex={1} width="60%">
        <Flex direction="column" margin="40px" flex={1}>
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
          <Box width="80%">
            <Select
              placeholder="Select language"
              components={{ DropdownIndicator }}
            />
          </Box>
        </Flex>
        <Flex>
          <Heading size="sm" marginTop="36px">
            Inprogress
          </Heading>
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
          <Button colorScheme="blue" variant="blueOutline">
            Cancel
          </Button>
          <Button colorScheme="blue" marginLeft="24px" marginRight="48px">
            Save Changes
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};

export default CompleteProfilePage;
