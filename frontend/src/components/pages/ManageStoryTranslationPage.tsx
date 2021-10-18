import React from "react";
import { useParams } from "react-router-dom";

type ManageStoryTranslationPageProps = {
  storyIdParam: string | undefined;
  storyTranslationIdParam: string | undefined;
};

const ManageStoryTranslationPage = () => {
  const {
    storyIdParam,
    storyTranslationIdParam,
  } = useParams<ManageStoryTranslationPageProps>();

  return (
    <div style={{ textAlign: "center" }}>
      <h1>
        Manage story translation {storyIdParam} {storyTranslationIdParam} :)
      </h1>
    </div>
  );
};

export default ManageStoryTranslationPage;
