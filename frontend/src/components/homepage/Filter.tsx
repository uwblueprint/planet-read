import React from "react";
import {
  Box,
  Flex,
  Heading,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  useStyleConfig,
} from "@chakra-ui/react";

import ToggleButton from "../utils/ToggleButton";
import "./Filter.css";

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
  const handleLevelChange = (nextLevel: number) => {
    setLevel(nextLevel);
  };
  const languageOptions = Object.keys(approvedLanguages).map((lang) => (
    <option key={lang} value={lang}>
      {lang}
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
      <Heading>Filter Stories</Heading>
      <Box>
        <Heading size="md">TRANSLATION LANGUAGE</Heading>
        <Select
          name="language"
          id="language"
          value={language}
          onChange={handleSelectChange}
        >
          {languageOptions}
        </Select>
      </Box>
      <Box>
        <Heading size="md">ROLE</Heading>
        <ToggleButton
          leftStateIsSelected={role}
          leftStateLabel="For Translation"
          rightStateLabel="For Review"
          onToggle={setRole}
        />
      </Box>
      <Box width="125px">
        <Heading size="md">LEVEL</Heading>
        <Slider
          min={1}
          max={maxLvl}
          step={1}
          list="tickmarks"
          defaultValue={level}
          onChangeEnd={handleLevelChange}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        {/* TODO: Move to Chakra */}
        <datalist id="tickmarks">{lvlOptions}</datalist>
      </Box>
    </Flex>
  );
};

export default Filter;
