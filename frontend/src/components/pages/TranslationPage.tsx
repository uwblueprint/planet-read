import React, { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

import "./TranslationPage.css";
import { useParams } from "react-router-dom";
import Cell from "../translation/Cell";
import EditableCell from "../translation/EditableCell";
import TranslationProgressBar from "../translation/TranslationProgressBar";
import CheckmarkIcon from "../../assets/checkmark.svg";
import CommentIcon from "../../assets/comment_no_number.svg";

type TranslationPageProps = {
  storyIdParam: string | undefined;
  storyTranslationIdParam: string | undefined;
};

// array that sorted by lineIndex -> does this need sorting at any point?
// this works since back half can be null
// but front half HAS to be defined, with the ocmplete num of lines on query
// back half -> null or optional?
// and can use map
// lineIndex starts at 0 we good ==> this isn't true, db starts at 1
type StoryLine = {
  lineIndex: number;
  originalContent: string;
  storyContentId: number;
  translatedContent?: string;
  storyTranslationContentId?: number;
};

type Content = {
  id: number;
  lineIndex: number;
  content: string;
};
// TODO fix up the storyTranslationById mutation
const GET_STORY_CONTENTS = (storyId: number, storyTranslationId: number) => gql`
  query {
    storyById(id: ${storyId}) {
      contents {
        id
        lineIndex
        content
      }
    }
    storyTranslationById(id: ${storyTranslationId}) {
      translationContents {
        id
        lineIndex
        content: translationContent
      }
    }
  }
`;

type UpdateTranslationResponse = {
  story: { lineIndex: number };
};
const UPDATE_TRANSLATION = gql`
  mutation updateStoryTranslationContentById(
    $storyTranslationContentId: Int!
    $newTranslationContent: String!
  ) {
    updateStoryTranslationContentById(
      storyTranslationContentData: {
        id: $storyTranslationContentId
        translationContent: $newTranslationContent
      }
    ) {
      story {
        lineIndex
      }
    }
  }
`;

const TranslationPage = () => {
  const {
    storyIdParam,
    storyTranslationIdParam,
  } = useParams<TranslationPageProps>();

  // do we need to catch these?
  const storyId = +storyIdParam!!;
  const storyTranslationId = +storyTranslationIdParam!!;

  const [translatedStoryLines, setTranslatedStoryLines] = useState<StoryLine[]>(
    [],
  );
  const [percentageComplete] = useState(25);


  const handleError = (errorMessage: string) => {
    alert(errorMessage);
  };

  const arrayIndex = (lineIndex: number): number =>
    lineIndex - (translatedStoryLines[0].lineIndex - 1);

  // TODO replace with real logic
  const addIcon = (): JSX.Element | null => {
    const randomNum = Math.floor(Math.random() * 3);

    switch (randomNum) {
      case 0:
        return <img src={CheckmarkIcon} alt="Approved line" />;
      case 1:
        return <img src={CommentIcon} alt="Line with feedback" />;
      default:
        return null;
    }
  };

  const [updateTranslation] = useMutation<{
    updateStoryTranslationContentById: UpdateTranslationResponse;
  }>(UPDATE_TRANSLATION);
  const onChangeTranslationContent = async (
    storyTranslationContentId: number,
    newContent: string,
  ) => {
    try {
      const result = await updateTranslation({
        variables: {
          storyTranslationContentId,
          newTranslationContent: newContent,
        },
      });

      const lineIndex =
        result.data?.updateStoryTranslationContentById.story.lineIndex;
      if (lineIndex !== undefined) {
        // this is update only, so id already set
        // not convinced this is the best strateg, this will re-redner the page
        // and the box that has already been updated right?
        // should only update whatever is storingi nfo without re-rendering if possible
        const updatedContentArray = [...translatedStoryLines];
        const index = arrayIndex(lineIndex);
        updatedContentArray[index].translatedContent = newContent;

        setTranslatedStoryLines(updatedContentArray);
      } else {
        handleError("Unable to save translation.");
      }
    } catch (err) {
      handleError(err ?? "Error occurred, please try again.");
    }
  };

  useQuery(GET_STORY_CONTENTS(storyId, storyTranslationId), {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      const storyContent = data.storyById.contents;
      const translatedContent = data.storyTranslationById.translationContents;

      const contentArray: StoryLine[] = [];
      // would callign directly onto state object rather than this array re-render
      // expect an ordered response
      storyContent.forEach(({ id, content, lineIndex }: Content) => {
        contentArray.push({
          lineIndex,
          originalContent: content,
          storyContentId: id,
        });
      });
      translatedContent.forEach(({ id, content, lineIndex }: Content) => {
        // why is "" registering as undefined
        contentArray[lineIndex].translatedContent = content ?? "";
        contentArray[lineIndex].storyTranslationContentId = id;
      });

      setTranslatedStoryLines(contentArray);
    },
  });

  // TODO not in order? maybe fix it via css -> is it possible since not guaranteed order (what div properties needed)
  // array might help then
  // pagination will give us troubles in this format -> will need to subtract firsti ndex or smth
  // is that super inefficient

  // double loop from response?
  const storyCells = translatedStoryLines.map((storyLine: StoryLine) => {
    return (
      <div
        className="row-translation"
        key={`row-${arrayIndex(storyLine.lineIndex)}`}
      >
        <p className="line-index">{storyLine.lineIndex}</p>
        <Cell text={storyLine.originalContent} />
        <EditableCell
          text={storyLine.translatedContent!!}
          storyTranslationContentId={storyLine.storyTranslationContentId!!}
          onChange={onChangeTranslationContent}
        />
        {addIcon()}
      </div>
    );
  });

  return (
    <div className="translation-page">
      <h1>Story Title Here</h1>
      <h4>View story details</h4>
      <div className="translation-container">
        <div className="translation-content">{storyCells}</div>
      </div>
      <div className="translation-sidebar">
        <div className="translation-progress-bar">
          <TranslationProgressBar percentageComplete={percentageComplete} />
        </div>
      </div>
    </div>
  );
};

export default TranslationPage;
