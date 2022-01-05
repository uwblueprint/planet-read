import React, { useState } from "react";
import Select from "react-select";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Heading,
  IconButton,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icon";
import { MdDelete, MdFolder } from "react-icons/md";
import DropdownIndicator from "../utils/DropdownIndicator";
import { convertLanguageTitleCase } from "../../utils/LanguageUtils";
import { languageOptions } from "../../constants/Languages";

export type UserProfileFormProps = {
  isSignup?: boolean;
  fullName: string;
  email: string;
  setFullName: (name: string) => void;
  setEmail: (email: string) => void;
  setEducationalQualification: (email: string) => void;
  setLanguageExperience: (email: string) => void;
  updateResume: (resume: File | null) => void;
};

const UserProfileForm = ({
  isSignup = true,
  fullName,
  email,
  setFullName,
  setEmail,
  setEducationalQualification,
  setLanguageExperience,
  updateResume,
}: UserProfileFormProps) => {
  const [file, setFile] = useState<File | null>(null);

  const onPreventDefault = (e: any) => {
    e.preventDefault();
    if (
      e.dataTransfer.items &&
      e.dataTransfer.items.length === 1 &&
      e.dataTransfer.items[0].kind === "file"
    ) {
      e.dataTransfer.dropEffect = "copy";
    }
  };

  const onFileDrop = (e: any) => {
    e.preventDefault();
    if (
      e.dataTransfer.items &&
      e.dataTransfer.items.length === 1 &&
      e.dataTransfer.items[0].kind === "file"
    ) {
      const newResume = e.dataTransfer.items[0].getAsFile();
      if (
        newResume.type === "application/pdf" ||
        newResume.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFile(newResume);
        updateResume(newResume);
      }
    } else if (e.dataTransfer.files && e.dataTransfer.files.length === 1) {
      const newResume = e.dataTransfer.files[0];
      if (
        newResume.type === "application/pdf" ||
        newResume.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFile(newResume);
        updateResume(newResume);
      }
    }
  };

  const onFileUpload = (e: any) => {
    setFile(e.target.files[0]);
    updateResume(e.target.files[0]);
  };

  const onFileDelete = () => {
    setFile(null);
    updateResume(null);
  };

  return (
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
          <Input
            type="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Heading marginTop="24px" size="sm">
            Email*
          </Heading>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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
          onDragEnter={(e: any) => onPreventDefault(e)}
          onDragLeave={(e: any) => onPreventDefault(e)}
          onDragOver={(e: any) => onPreventDefault(e)}
          onDrop={(e: any) => onFileDrop(e)}
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
          <Text>Drag & drop your file here (.PDF, .docx)</Text>
          <FormControl width="160px">
            <FormLabel cursor="pointer" htmlFor="browse-files" marginTop="16px">
              <Button colorScheme="blue" pointerEvents="none">
                Browse Files
              </Button>
            </FormLabel>
            <Input
              accept=".docx,.pdf"
              hidden
              id="browse-files"
              onChange={(e) => onFileUpload(e)}
              type="file"
            />
          </FormControl>
        </Flex>
        <Heading marginTop="24px" size="sm">
          Uploaded file
        </Heading>
        <Text marginBottom="10px">
          Drag & drop a file or browse files to upload a CV.
        </Text>
        {file && (
          <Flex key={file.name}>
            <Text marginTop="10px">{file.name}</Text>
            <IconButton
              aria-label="Delete icon"
              background="transparent"
              icon={<Icon as={MdDelete} height={5} width={5} />}
              marginTop="3px"
              onClick={() => onFileDelete()}
              width="fit-content"
            />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default UserProfileForm;
