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
  approvedLanguagesTranslation: { [name: string]: number };
  level: number;
  setLevel: (newState: number) => void;
  language: string;
  setLanguage: (newState: string) => void;
  role: boolean;
  setIsTranslator: (newState: boolean) => void;
  isDisabled?: boolean;
};

const Filter = ({
  approvedLanguagesTranslation,
  level,
  setLevel,
  language,
  setLanguage,
  role,
  setIsTranslator,
  isDisabled = false,
}: FilterProps) => {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };
  const handleRoleChange = (nextRole: string) => {
    setIsTranslator(nextRole === "Translator");
  };
  const handleLevelChangeStr = (nextLevel: string) => {
    setLevel(parseInt(nextLevel.replace("Level ", ""), 10));
  };
  const languageOptions = Object.keys(approvedLanguagesTranslation).map(
    (lang) => (
      <option key={lang} value={lang}>
        {convertLanguageTitleCase(lang)}
      </option>
    ),
  );
  const maxLvl = approvedLanguagesTranslation[language];
  const lvlOptions = [];
  for (let i = 1; i <= maxLvl; i += 1) {
    lvlOptions.push(
      <option key={i.toString()} value={i.toString()} label={i.toString()} />,
    );
  }
  const filterStyle = useStyleConfig("Filter");
  const disabledStyle = useStyleConfig("Disabled");
  return (
    <Flex sx={filterStyle}>
      <Heading size="lg">Filters</Heading>
      <Divider />
      <Box sx={isDisabled ? disabledStyle : undefined}>
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
      <Box sx={isDisabled ? disabledStyle : undefined}>
        <Heading size="sm">Role Required</Heading>
        <ButtonRadioGroup
          name="Role"
          options={["Translator", "Reviewer"]}
          onChange={handleRoleChange}
          defaultValue={role ? "Translator" : "Reviewer"}
        />
      </Box>
      <Divider />
      <Box sx={isDisabled ? disabledStyle : undefined}>
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
