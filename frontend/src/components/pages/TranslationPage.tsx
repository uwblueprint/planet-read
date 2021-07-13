import React, { useState } from "react";
import "./TranslationPage.css";
import { useParams } from "react-router-dom";
import TranslationProgressBar from "../translation/TranslationProgressBar";

type TranslationPageProps = {
  storyId: string | undefined;
  storyTranslationId: string | undefined;
};

const TranslationPage = () => {
  const { storyId, storyTranslationId } = useParams<TranslationPageProps>();
  // TODO: set percentageComplete based on return from get translation query,
  // and update when edits made to page
  // const [percentageComplete, setPercentageComplete] = useState(0);
  const [percentageComplete] = useState(25);
  if (storyId === undefined || storyTranslationId === undefined) {
    return (
      <div className="error">
        <p>Error loading page</p>
      </div>
    );
  }

  return (
    <div className="translation">
      <div className="translation-container" />
      <div className="translation-sidebar">
        <div className="translation-progress-bar">
          <TranslationProgressBar percentageComplete={percentageComplete} />
        </div>
      </div>
    </div>
  );
};

export default TranslationPage;
