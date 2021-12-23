import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tooltip,
  Tr,
  Th,
  Td,
  Tfoot,
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { MdOutlineBlock } from "react-icons/md";
import { ApprovedLanguagesMap, generateSortFn } from "../../utils/Utils";
import { convertLanguageTitleCase } from "../../utils/LanguageUtils";

interface ApprovedLanguageFieldSortDict {
  [field: string]: {
    sortFn: (a: ApprovedLanguage, b: ApprovedLanguage) => number;
    isAscending: boolean;
    setIsAscending: Dispatch<SetStateAction<boolean>>;
  };
}

type ApprovedLanguage = {
  language: string;
  level: number;
  role: string;
  sliderValue: number;
};

export type ApprovedLanguagesTableComponentProps = {
  addNewLanguage: () => void;
  levelUpOnClick: (level: number, language: string) => void;
  removeLanguageOnClick: (isTranslate: boolean, language: string) => void;
  onSliderValueChange: (
    isTranslate: boolean,
    language: string,
    newLevel: number,
    oldLevel: number,
  ) => void;
  approvedLanguagesTranslation: ApprovedLanguagesMap | undefined;
  approvedLanguagesReview: ApprovedLanguagesMap | undefined;
  isAdmin?: boolean;
};

const ApprovedLanguagesTableComponent = ({
  addNewLanguage,
  levelUpOnClick,
  removeLanguageOnClick,
  onSliderValueChange,
  approvedLanguagesTranslation,
  approvedLanguagesReview,
  isAdmin = false,
}: ApprovedLanguagesTableComponentProps) => {
  const [approvedLanguages, setApprovedLanguages] = useState<
    ApprovedLanguage[]
  >([]);

  const [isAscendingLanguage, setIsAscendingLanguage] = useState(true);
  const [isAscendingRole, setIsAscendingRole] = useState(true);

  const fieldSortDict: ApprovedLanguageFieldSortDict = {
    language: {
      sortFn: generateSortFn<ApprovedLanguage>("language", isAscendingLanguage),
      isAscending: isAscendingLanguage,
      setIsAscending: setIsAscendingLanguage,
    },
    role: {
      sortFn: generateSortFn<ApprovedLanguage>("role", isAscendingRole),
      isAscending: isAscendingRole,
      setIsAscending: setIsAscendingRole,
    },
  };

  const sortApprovedLanguages = (field: string) => {
    const newApprovedLanguages = [...approvedLanguages];
    const { sortFn, isAscending, setIsAscending } = fieldSortDict[field];
    setIsAscending(!isAscending);
    newApprovedLanguages.sort(sortFn);
    setApprovedLanguages(newApprovedLanguages);
  };

  useEffect(() => {
    if (approvedLanguagesTranslation && approvedLanguagesReview) {
      const translationLanguages = Object.entries(
        approvedLanguagesTranslation,
      ).map(([language, level]) => {
        return { language, level, role: "Translator", sliderValue: level };
      });
      const reviewLanguages = Object.entries(approvedLanguagesReview).map(
        ([language, level]) => {
          return { language, level, role: "Reviewer", sliderValue: level };
        },
      );
      const combined = translationLanguages.concat(reviewLanguages);
      sortApprovedLanguages("language");
      setApprovedLanguages(combined);
    }
  }, [approvedLanguagesTranslation, approvedLanguagesReview]);

  const tableBody = approvedLanguages.map(
    (approvedLanguage: ApprovedLanguage, index: number) => (
      <Tr
        borderBottom={
          index === approvedLanguages.length - 1 ? "1px solid gray" : ""
        }
        key={`${approvedLanguage.language}/${approvedLanguage.role}`}
      >
        <Td>{convertLanguageTitleCase(approvedLanguage.language)}</Td>
        <Td>{approvedLanguage.role}</Td>
        <Td colSpan={4} align="center">
          <Slider
            isDisabled={!isAdmin}
            defaultValue={approvedLanguage.level}
            min={1}
            max={4}
            step={1}
            marginLeft="20px"
            size="lg"
            width="79%"
            onChange={(val: number) =>
              onSliderValueChange(
                approvedLanguage.role === "Translator",
                approvedLanguage.language,
                val,
                approvedLanguage.level,
              )
            }
          >
            <SliderTrack height="6px">
              <SliderFilledTrack bg="blue.500" />
            </SliderTrack>
            <SliderThumb boxShadow="0px 0px 3px black" />
            {[1, 2, 3, 4].map((val) => (
              <SliderMark
                key={val}
                value={val}
                height="6px"
                width="4px"
                marginTop="-3px"
                // #64A1CD is light blue, #ECF1F4 is light gray
                bg={approvedLanguage.sliderValue > val ? "#64A1CD" : "#ECF1F4"}
              />
            ))}
          </Slider>
        </Td>
        {isAdmin ? (
          <Td>
            <IconButton
              aria-label={`Remove approved language ${approvedLanguage.language}`}
              background="transparent"
              icon={<Icon as={MdOutlineBlock} />}
              width="fit-content"
              onClick={() =>
                removeLanguageOnClick(
                  approvedLanguage.role === "Translator",
                  approvedLanguage.language,
                )
              }
            />
          </Td>
        ) : (
          <Tooltip
            hasArrow
            label="Currently at maximum language level."
            isDisabled={approvedLanguage.level !== 4}
          >
            <Td>
              <Button
                aria-label="Level up approval language and level"
                background="white"
                size="sm"
                width="103px"
                variant="blueOutline"
                isDisabled={approvedLanguage.level === 4}
                onClick={() =>
                  levelUpOnClick(
                    approvedLanguage.level + 1,
                    approvedLanguage.language,
                  )
                }
              >
                Level Up
              </Button>
            </Td>
          </Tooltip>
        )}
      </Tr>
    ),
  );

  return (
    <Table
      borderRadius="12px"
      boxShadow="0px 0px 2px grey"
      theme="gray"
      variant="striped"
      width="100%"
      marginTop="20px"
    >
      <Thead>
        <Tr
          borderTop="1em solid transparent"
          borderBottom="0.5em solid transparent"
        >
          <Th
            cursor="pointer"
            onClick={() => sortApprovedLanguages("language")}
            width="12%"
          >
            {`LANGUAGE ${isAscendingLanguage ? "↑" : "↓"}`}
          </Th>
          <Th
            cursor="pointer"
            onClick={() => sortApprovedLanguages("role")}
            width="12%"
          >{`ROLE ${isAscendingRole ? "↑" : "↓"}`}</Th>
          {["LEVEL 1", "LEVEL 2", "LEVEL 3", "LEVEL 4"].map((level) => (
            <Th key={level}>{level}</Th>
          ))}
          <Th width="7%">ACTION</Th>
        </Tr>
      </Thead>
      <Tbody>{tableBody}</Tbody>
      <Tfoot padding="12px">
        <Button
          margin="16px 0px 16px 12px"
          size="secondary"
          variant="blueOutline"
          width="254px"
          onClick={addNewLanguage}
        >
          Add New Language
        </Button>
      </Tfoot>
    </Table>
  );
};

export default ApprovedLanguagesTableComponent;
