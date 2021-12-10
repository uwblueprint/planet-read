import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import {
  Table,
  Thead,
  Tbody,
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
} from "@chakra-ui/react";
import { ApprovedLanguagesMap, generateSortFn } from "../../utils/Utils";
import { convertLanguageTitleCase } from "../../utils/LanguageUtils";
import {
  UPDATE_USER_APPROVED_LANGUAGES,
  UpdateUserApprovedLanguagesResponse,
} from "../../APIClients/mutations/UserMutations";

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

type ApprovedLanguagesTableProps = {
  approvedLanguagesTranslation: ApprovedLanguagesMap | undefined;
  approvedLanguagesReview: ApprovedLanguagesMap | undefined;
  userId: number;
  setAlertText: (newText: string) => void;
  setAlert: (open: boolean) => void;
};

const ApprovedLanguagesTable = ({
  approvedLanguagesTranslation,
  approvedLanguagesReview,
  userId,
  setAlertText,
  setAlert,
}: ApprovedLanguagesTableProps) => {
  const [approvedLanguages, setApprovedLanguages] = useState<
    ApprovedLanguage[]
  >([]);

  const [isAscendingLanguage, setIsAscendingLanguage] = useState(true);
  const [isAscendingRole, setIsAscendingRole] = useState(true);

  const [updateUserApprovedLanguages] = useMutation<{
    response: UpdateUserApprovedLanguagesResponse;
  }>(UPDATE_USER_APPROVED_LANGUAGES);

  const getAlertText = (
    isTranslate: boolean,
    language: string,
    level: number,
    oldLevel: number,
  ) => {
    return `${
      isTranslate ? "Translator" : "Reviewer"
    }'s approval for ${convertLanguageTitleCase(
      language,
    )} has been updated to Level ${level} from Level ${oldLevel}.`;
  };

  const callUpdateUserApprovedLanguagesMutation = async (
    isTranslate: boolean,
    language: string,
    level: number,
    oldLevel: number,
  ) => {
    const result = await updateUserApprovedLanguages({
      variables: {
        userId,
        isTranslate,
        language,
        level,
      },
    });

    if (result.data !== undefined) {
      setAlert(true);
      setAlertText(getAlertText(isTranslate, language, level, oldLevel));
    }
  };

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

  const onSliderValueChange = (
    isTranslate: boolean,
    language: string,
    newLevel: number,
    oldLevel: number,
  ) => {
    callUpdateUserApprovedLanguagesMutation(
      isTranslate,
      language,
      newLevel,
      oldLevel,
    );
    setTimeout(() => setAlert(false), 5000);
  };

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
        </Tr>
      </Thead>
      <Tbody>{tableBody}</Tbody>
      <Tfoot padding="12px">
        <Button
          margin="16px 0px 16px 12px"
          size="secondary"
          variant="blueOutline"
          width="254px"
        >
          Approve New Language/Level
        </Button>
      </Tfoot>
    </Table>
  );
};

export default ApprovedLanguagesTable;
