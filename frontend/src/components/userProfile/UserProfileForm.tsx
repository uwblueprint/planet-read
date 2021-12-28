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
import DropdownIndicator from "../utils/DropdownIndicator";
import { convertLanguageTitleCase } from "../../utils/LanguageUtils";
import { languageOptions } from "../../constants/Languages";

export type UserProfileFormProps = {
  isSignup?: boolean;
  setFullName: (name: string) => void;
  setEmail: (email: string) => void;
  setEducationalQualification: (email: string) => void;
  setLanguageExperience: (email: string) => void;
};

const UserProfileForm = ({
  isSignup = true,
  setFullName,
  setEmail,
  setEducationalQualification,
  setLanguageExperience,
}: UserProfileFormProps) => (
  <Flex direction="row" flex={1}>
    <Flex direction="column" flex={1} maxWidth="50%">
      <Heading size="lg">
        {isSignup ? "Complete your profile!" : "Personal Information"}
      </Heading>
      {isSignup && (
        <Text marginBottom="20px">
          For the purposes of this platform, please enter your details
        </Text>
      )}
      <FormControl>
        <Heading marginTop="24px" size="sm">
          Full name*
        </Heading>
        <Input type="name" onChange={(e) => setFullName(e.target.value)} />
        <Heading marginTop="24px" size="sm">
          Email*
        </Heading>
        <Input type="email" onChange={(e) => setEmail(e.target.value)} />
        <Heading marginTop="24px" size="sm">
          Educational qualifications*
        </Heading>
        <Textarea
          height="150px"
          type="qualifications"
          onChange={(e) => setEducationalQualification(e.target.value)}
        />
        <Heading marginTop="24px" size="sm">
          Language experience*
        </Heading>
        <Textarea
          height="150px"
          type="experience"
          onChange={(e) => setLanguageExperience(e.target.value)}
        />
      </FormControl>
      {isSignup && (
        <>
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
              getOptionLabel={(option: any) => `
                ${convertLanguageTitleCase(option.value || "")}
              `}
              components={{ DropdownIndicator }}
            />
          </Box>
        </>
      )}
    </Flex>
    <Flex direction="column" flex={1} marginLeft="60px" marginTop="75px">
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
);

export default UserProfileForm;
