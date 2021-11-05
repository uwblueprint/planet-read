import React from "react";
import Select, { StylesConfig } from "react-select";
import { MdSearch } from "react-icons/md";
import { Icon } from "@chakra-ui/icon";
import {
  Badge,
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Tooltip,
} from "@chakra-ui/react";
import { languageOptions } from "../../constants/Languages";
import { levelOptions } from "../../constants/Levels";
import { stageOptions } from "../../constants/Stage";
import { convertLanguageTitleCase } from "../../utils/LanguageUtils";
import { FILTER_TOOL_TIP_COPY } from "../../utils/Copy";

export type TableFilterProps = {
  language: string | null;
  setLanguage: (newLang: string | null) => void;
  level: string | null;
  setLevel: (newLevel: string | null) => void;
  stage?: string | null;
  setStage?: (newStage: string | null) => void;
  searchText: string | null;
  setSearchText: (newText: string | null) => void;
  useLevel?: boolean;
  useLanguage?: boolean;
  useStage?: boolean;
  searchBarPlaceholder?: string;
};

export type FilterBadgesProps = {
  filterValue: string;
  setFilterValue: (newValue: null) => void;
};

const FilterBadges = ({ filterValue, setFilterValue }: FilterBadgesProps) => {
  return (
    <Badge variant="filter" textTransform="none">
      {filterValue}
      <Button variant="clear" size="clear" onClick={() => setFilterValue(null)}>
        ✕
      </Button>
    </Badge>
  );
};

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

const colourStyles: StylesConfig = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "#F1F4F7", // #F1F4F7 is gray.100
    border: "none",
  }),
  option: (styles, { isSelected }) => {
    return {
      ...styles,
      color: "black",
      backgroundColor: isSelected ? "#F1F4F7" : "white", // #F1F4F7 is gray.100
      "&:hover": {
        backgroundColor: "#F1F4F7", // #F1F4F7 is gray.100
      },
    };
  },
  indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
  placeholder: (styles) => ({ ...styles, color: "black" }),
};

const TableFilter = ({
  language,
  level,
  stage,
  searchText,
  setLanguage,
  setLevel,
  setStage,
  setSearchText,
  useLevel = false,
  useLanguage = false,
  useStage = false,
  searchBarPlaceholder = "",
}: TableFilterProps) => {
  return (
    <Flex direction="column">
      <Flex
        textAlign="left"
        width="95%"
        border="1px solid white"
        margin="20px auto 10px"
      >
        {useLanguage && (
          <Tooltip
            hasArrow
            label={FILTER_TOOL_TIP_COPY}
            isDisabled={language == null}
          >
            <Box flex={1}>
              <Select
                isDisabled={language != null}
                placeholder="Language"
                options={languageOptions}
                onChange={(option: any) => setLanguage(option?.value || "")}
                getOptionLabel={(option: any) => `
                ${convertLanguageTitleCase(option.value || "")}
              `}
                value={language ? { value: language } : null}
                styles={colourStyles}
                components={{ DropdownIndicator }}
              />
            </Box>
          </Tooltip>
        )}
        {useLevel && (
          <Tooltip
            hasArrow
            label={FILTER_TOOL_TIP_COPY}
            isDisabled={level == null}
          >
            <Box flex={1} margin="0 15px">
              <Select
                placeholder="Level"
                options={levelOptions}
                onChange={(option: any) => setLevel(option?.value || "")}
                getOptionLabel={(option: any) => `Level ${option.value}`}
                value={level ? { value: level } : null}
                styles={colourStyles}
                components={{ DropdownIndicator }}
                isDisabled={level != null}
              />
            </Box>
          </Tooltip>
        )}
        {useStage && setStage && (
          <Tooltip
            hasArrow
            label={FILTER_TOOL_TIP_COPY}
            isDisabled={stage == null}
          >
            <Box flex={1} margin="0 15px">
              <Select
                placeholder="Progress"
                options={stageOptions}
                onChange={(option: any) => setStage(option?.value || "")}
                getOptionLabel={(option: any) => `${option.value}`}
                value={stage ? { value: stage } : null}
                styles={colourStyles}
                components={{ DropdownIndicator }}
                isDisabled={stage != null}
              />
            </Box>
          </Tooltip>
        )}
        <Box flex={2} colorScheme="blue" size="secondary">
          <Stack spacing={4}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={MdSearch} />
              </InputLeftElement>
              <Input
                placeholder={searchBarPlaceholder}
                value={searchText || ""}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </InputGroup>
          </Stack>
        </Box>
        <Box marginLeft="15px">
          <Button
            disabled={language == null && level == null && searchText == null}
            colorScheme="blue"
            size="secondary"
            onClick={() => {
              setLanguage(null);
              setLevel(null);
              setSearchText(null);
            }}
          >
            Clear filters
          </Button>
        </Box>
      </Flex>
      <Flex margin="10px auto 24px" width="95%">
        {language && (
          <FilterBadges
            filterValue={convertLanguageTitleCase(language)}
            setFilterValue={setLanguage}
          />
        )}
        {level && (
          <FilterBadges
            filterValue={`Level ${level}`}
            setFilterValue={setLevel}
          />
        )}
        {stage && setStage && (
          <FilterBadges filterValue={`${stage}`} setFilterValue={setStage} />
        )}
        {searchText && (
          <FilterBadges
            filterValue={searchText}
            setFilterValue={setSearchText}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default TableFilter;
