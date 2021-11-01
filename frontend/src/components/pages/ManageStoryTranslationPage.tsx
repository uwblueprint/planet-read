import React from "react";
import { useParams } from "react-router-dom";
import { Box } from "@chakra-ui/react";

type ManageStoryTranslationPageProps = {
  storyIdParam: string | undefined;
  storyTranslationIdParam: string | undefined;
};

const ManageStoryTranslationPage = () => {
  const { storyIdParam, storyTranslationIdParam } =
    useParams<ManageStoryTranslationPageProps>();

  return (
    <Box textAlign="center">
      <h1>
        Manage story translation {storyIdParam} {storyTranslationIdParam} :)
      </h1>
    </Box>
  );
};

export default ManageStoryTranslationPage;
