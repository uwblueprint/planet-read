import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Box, Flex, Divider, Heading, useStyleConfig } from "@chakra-ui/react";

import ButtonRadioGroup from "../utils/ButtonRadioGroup";
import { StoryCardProps } from "./StoryCard";

export type StoriesFilterFn = (story: StoryCardProps) => boolean;

export type MyWorkFilterProps = {
  setFilter: Dispatch<SetStateAction<StoriesFilterFn | null>>;
};

const MyWorkFilter = ({ setFilter }: MyWorkFilterProps) => {
  const generateFilterFn = (stage: string) => {
    return (story: StoryCardProps) => story?.stage === stage;
  };

  useEffect(() => {
    // default to show stories in translation
    setFilter(() => generateFilterFn("TRANSLATE"));
  }, []);

  const handleStageChange = (stage: string) => {
    let filterStage = "PUBLISH";
    if (stage === "In Translation") {
      filterStage = "TRANSLATE";
    } else if (stage === "In Review") {
      filterStage = "REVIEW";
    }
    setFilter(() => generateFilterFn(filterStage));
  };

  const filterStyle = useStyleConfig("Filter");
  return (
    <Flex sx={filterStyle}>
      <Heading size="lg">Filters</Heading>
      <Divider marginTop="24px" marginBottom="18px" />
      <Box>
        <Heading size="sm">Progress</Heading>
        <ButtonRadioGroup
          name="Level"
          options={["In Translation", "In Review", "Completed"]}
          onChange={handleStageChange}
          defaultValue="In Translation"
        />
      </Box>
    </Flex>
  );
};

export default MyWorkFilter;
