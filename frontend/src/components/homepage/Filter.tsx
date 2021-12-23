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
import { convertLanguageTitleCase } from "../../utils/LanguageUtils";

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

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  const handleRoleChange = (nextRole: string) => {
    const newApprovedLanguages =
      nextRole === "Translator"
        ? approvedLanguagesTranslation
        : approvedLanguagesReview;

    let newLanguage = language;

    // if user isn't permitted to translate/review in the same language, default
    // to the first language
    if (!Object.keys(newApprovedLanguages).find((x) => x === language)) {
      [newLanguage] = Object.keys(newApprovedLanguages);
    }
    setIsTranslator(nextRole === "Translator");
    setLanguage(newLanguage);
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

  // if not disabled, display levels only up to the maxApprovedLevel
  const levelOptions = isDisabled
    ? ["Level 1", "Level 2", "Level 3", "Level 4"]
    : [...Array(maxApprovedLevel + 1).keys()]
        .slice(1)
        .map((val) => `Level ${val}`);

  const filterStyle = useStyleConfig("Filter");
  const disabledStyle = useStyleConfig("Disabled");
  return (
    <Flex sx={filterStyle}>
      {!isDisabled && (
        <>
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
              dependentValue={language + role}
            />
          </Box>
        </>
      )}
    </Flex>
  );
};

export default Filter;
