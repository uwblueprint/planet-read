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
  approvedLanguagesReview: { [name: string]: number };
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
  approvedLanguagesReview,
  level,
  setLevel,
  language,
  setLanguage,
  role,
  setIsTranslator,
  isDisabled = false,
}: FilterProps) => {
  const approvedLanguages = role
    ? approvedLanguagesTranslation
    : approvedLanguagesReview;

  // handles edge case of switching from higher approved level to lower level
  const handleLevelDecrease = (newLevel: number) => {
    if (level > newLevel) {
      setLevel(newLevel);
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
    handleLevelDecrease(approvedLanguages[event.target.value]);
  };

  const handleRoleChange = (nextRole: string) => {
    const newApprovedLanguages =
      nextRole === "Translator"
        ? approvedLanguagesTranslation
        : approvedLanguagesReview;
    const newLanguage = Object.keys(newApprovedLanguages)[0];
    setIsTranslator(nextRole === "Translator");
    setLanguage(newLanguage);

    handleLevelDecrease(newApprovedLanguages[newLanguage]);
  };

  const handleLevelChangeStr = (nextLevel: string) => {
    setLevel(parseInt(nextLevel.replace("Level ", ""), 10));
  };

  const languageOptions = isDisabled ? (
    <option key="undefined" value="undefined">
      {" "}
    </option>
  ) : (
    Object.keys(approvedLanguages).map((lang) => (
      <option key={lang} value={lang}>
        {convertLanguageTitleCase(lang)}
      </option>
    ))
  );

  const maxApprovedLevel = approvedLanguages[language];
  const levelOptions = Array.from(Array(maxApprovedLevel).keys()).map(
    (val) => `Level ${val + 1}`,
  );

  const filterStyle = useStyleConfig("Filter");
  const disabledStyle = useStyleConfig("Disabled");
  return (
    <Flex sx={filterStyle}>
      <Heading size="lg">Filters</Heading>
      {Object.keys(approvedLanguagesReview).length > 0 && (
        <>
          <Divider marginTop="24px" marginBottom="18px" />
          <Box sx={isDisabled ? disabledStyle : undefined}>
            <Heading size="sm">Role Required</Heading>
            <ButtonRadioGroup
              name="Role"
              options={["Translator", "Reviewer"]}
              onChange={handleRoleChange}
              defaultValue={role ? "Translator" : "Reviewer"}
            />
          </Box>
        </>
      )}
      <Divider marginTop="24px" marginBottom="18px" />
      <Box sx={isDisabled ? disabledStyle : undefined}>
        <Heading size="sm">Translation Language</Heading>
        <Select
          size="sm"
          variant="filled"
          id="language"
          value={isDisabled ? "undefined" : language}
          onChange={handleSelectChange}
        >
          {languageOptions}
        </Select>
      </Box>
      <Divider marginTop="24px" marginBottom="18px" />
      <Box sx={isDisabled ? disabledStyle : undefined}>
        <Heading size="sm">Access Level</Heading>
        <ButtonRadioGroup
          name="Level"
          options={levelOptions}
          onChange={handleLevelChangeStr}
          defaultValue={`Level ${level}`}
          isDisabled={isDisabled}
        />
      </Box>
    </Flex>
  );
};

export default Filter;
