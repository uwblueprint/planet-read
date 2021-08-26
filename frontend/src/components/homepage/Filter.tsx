import React from "react";
import {
  Box,
  Flex,
  Divider,
  Heading,
  Select,
  useStyleConfig,
} from "@chakra-ui/react";

import ButtonRadioGroup from "../utils/ButtonRadioGroup";
import convertLanguageTitleCase from "../../utils/LanguageUtils";

export type FilterProps = {
  approvedLanguages: { [name: string]: number };
  level: number;
  setLevel: (newState: number) => void;
  language: string;
  setLanguage: (newState: string) => void;
  role: boolean;
  setRole: (newState: boolean) => void;
};

const Filter = ({
  approvedLanguages,
  level,
  setLevel,
  language,
  setLanguage,
  role,
  setRole,
}: FilterProps) => {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };
  const handleRoleChange = (nextRole: string) => {
    setRole(nextRole === "Translator");
  };
  const handleLevelChangeStr = (nextLevel: string) => {
    setLevel(parseInt(nextLevel.replace("Level ", ""), 10));
  };
  const languageOptions = Object.keys(approvedLanguages).map((lang) => (
    <option key={lang} value={lang}>
      {convertLanguageTitleCase(lang)}
    </option>
  ));
  const maxLvl = approvedLanguages[language];
  const lvlOptions = [];
  for (let i = 1; i <= maxLvl; i += 1) {
    lvlOptions.push(
      <option key={i.toString()} value={i.toString()} label={i.toString()} />,
    );
  }
  const filterStyle = useStyleConfig("Filter");
  return (
    <Flex sx={filterStyle}>
      <Heading size="lg">Filters</Heading>
      <Divider />
      <Box>
        <Heading size="sm">Translation Language</Heading>
        <Select
          size="sm"
          variant="filled"
          id="language"
          value={language}
          onChange={handleSelectChange}
        >
          {languageOptions}
        </Select>
      </Box>
      <Divider />
      <Box>
        <Heading size="sm">Role Required</Heading>
        <ButtonRadioGroup
          name="Role"
          options={["Translator", "Reviewer"]}
          onChange={handleRoleChange}
          defaultValue={role ? "Translator" : "Reviewer"}
        />
      </Box>
      <Divider />
      <Box>
        <Heading size="sm">Access Level</Heading>
        <ButtonRadioGroup
          name="Level"
          options={["Level 1", "Level 2", "Level 3", "Level 4"]}
          onChange={handleLevelChangeStr}
          defaultValue={`Level ${level}`}
        />
      </Box>
    </Flex>
  );
};

export default Filter;
