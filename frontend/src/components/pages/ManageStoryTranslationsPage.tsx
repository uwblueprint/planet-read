import React from "react";
import { useParams } from "react-router-dom";

type ManageStoryTranslationsPageProps = {
  storyIdParam: string | undefined;
  storyTranslationIdParam: string | undefined;
};

const ManageStoryTranslationsPage = () => {
  const {
    storyIdParam,
    storyTranslationIdParam,
  } = useParams<ManageStoryTranslationsPageProps>();

  return (
    <div style={{ textAlign: "center" }}>
      <h1>
        Manage story translation {storyIdParam} {storyTranslationIdParam} :)
      </h1>
    </div>
  );
};

export default ManageStoryTranslationsPage;
