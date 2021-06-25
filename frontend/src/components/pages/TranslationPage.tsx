import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import "./TranslationPage.css";
import { useParams } from "react-router-dom";
import TranslationProgressBar from "../translation/TranslationProgressBar";

const GET_TRANSLATION_PROGRESS = gql`
  query storyTranslationProgress($storyId: Int!, $translationId: Int!) {
    storyTranslationProgress(storyId: $storyId, translationId: $translationId) {
      percentageComplete
    }
  }
`;

type TranslationPageProps = {
  storyId: string | undefined;
  storyTranslationId: string | undefined;
};

const TranslationPage = () => {
  const { storyId, storyTranslationId } = useParams<TranslationPageProps>();
  const [percentageComplete, setPercentageComplete] = useState(0);
  if (storyId === undefined || storyTranslationId === undefined) {
    return (
      <div className="error">
        <p>Error loading page</p>
      </div>
    );
  }

  useQuery(GET_TRANSLATION_PROGRESS, {
    variables: {
      storyId,
      translationId: storyTranslationId,
    },
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setPercentageComplete(data.storyTranslationProgress.percentageComplete);
    },
  });

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
