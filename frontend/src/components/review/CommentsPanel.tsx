import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Box, Button, Flex, Select, Text } from "@chakra-ui/react";
import {
  CommentResponse,
  buildCommentsQuery,
} from "../../APIClients/queries/CommentQueries";
import CommentThread from "./CommentThread";
import WIPComment from "./WIPComment";

export type CommentPanelProps = {
  storyTranslationId: number;
  translatorId: number;
  translatorName: string;
  reviewerId: number | null;
  reviewerName: string;
  commentLine: number;
  setCommentLine: (line: number) => void;
  storyTranslationContentId: number;
};

const CommentsPanel = ({
  storyTranslationId,
  translatorId,
  reviewerId,
  translatorName,
  reviewerName,
  commentLine,
  storyTranslationContentId,
  setCommentLine,
}: CommentPanelProps) => {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [filterIndex, setFilterIndex] = useState(2);
  const [threadHeadMap, setThreadHeadMap] = useState<boolean[]>([]);

  const filterOptions = ["All", "Resolved", "Unresolved"];
  const filterToResolved = [null, true, false];
  const commentsQuery = buildCommentsQuery(
    storyTranslationId,
    filterToResolved[filterIndex],
  );

  const updateThreadHeadMap = (cmts: CommentResponse[]) => {
    /* A comment is a thread head if
     * * It has the smallest lineIndex of all present comments for a story line
     * * It's thread predecessor is resolved
     */
    const newThreadHeadMap = cmts.map((c: CommentResponse, i: number) => {
      if (
        i ===
        cmts.findIndex(
          (_c) => _c.storyTranslationContentId === c.storyTranslationContentId,
        )
      )
        return true;
      const lastC = cmts[i - 1];
      return (
        !c?.resolved &&
        lastC?.resolved &&
        lastC?.storyTranslationContentId === c?.storyTranslationContentId
      );
    });
    setThreadHeadMap(newThreadHeadMap);
  };

  useQuery(commentsQuery.string, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setComments(data.commentsByStoryTranslation);
      updateThreadHeadMap(data.commentsByStoryTranslation);
    },
  });

  const handleCommentFilterSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setFilterIndex(event.target.selectedIndex);
  };

  const updateCommentsAsResolved = (index: number) => {
    const newComments = [...comments];
    const commentsStateIdx = newComments.findIndex((c) => c.id === index);
    const updatedComment = { ...newComments[commentsStateIdx] };
    // Resolving one comment resolves the entire thread
    if (filterOptions[filterIndex] === "Unresolved") {
      // Remove all resolved comments
      setComments(
        newComments.filter(
          (c) =>
            c.storyTranslationContentId !==
            updatedComment.storyTranslationContentId,
        ),
      );
    } else {
      // Resolve entire thread
      const updatedCommentIdxs: number[] = [];
      newComments.forEach((c, i) => {
        if (
          c.storyTranslationContentId ===
            updatedComment.storyTranslationContentId &&
          !c.resolved
        ) {
          updatedCommentIdxs.push(i);
        }
      });
      updatedCommentIdxs.forEach((i) => {
        const updatedC = { ...newComments[i] };
        updatedC.resolved = true;
        newComments[i] = updatedC;
      });
      setComments(newComments);
    }
    updateThreadHeadMap(newComments);
  };

  const CommentsList = () => {
    if (comments.length > 0) {
      return (
        <Box>
          {comments.map((comment: CommentResponse, i: number) => {
            if (threadHeadMap[i]) {
              return (
                <CommentThread
                  comments={comments}
                  commentsIdx={i}
                  key={comment.id}
                  setComments={setComments}
                  updateCommentsAsResolved={updateCommentsAsResolved}
                  updateThreadHeadMap={updateThreadHeadMap}
                  threadHeadMap={threadHeadMap}
                  translatorId={translatorId}
                  translatorName={translatorName}
                  reviewerId={reviewerId}
                  reviewerName={reviewerName}
                />
              );
            }
            return null;
          })}
        </Box>
      );
    }
    if (commentLine <= 0) {
      return (
        <Text variant="comment">
          Looks like there aren&apos;t any comments yet! Select the Comment
          button above to begin leaving comments.
        </Text>
      );
    }
    return null;
  };

  const filterOptionsComponent = filterOptions.map((op) => (
    <option key={op} value={op}>
      {op}
    </option>
  ));

  const handleCommentButton = () => {
    if (commentLine === -1) setCommentLine(0);
    else setCommentLine(-1);
  };

  return (
    <Box
      backgroundColor="gray.100"
      float="right"
      overflow="auto"
      padding="20px"
      width="450px"
    >
      <Flex marginBottom="50px">
        <Box>
          <Button
            colorScheme="blue"
            size="secondary"
            marginRight="10px"
            onClick={handleCommentButton}
          >
            Comment
          </Button>
        </Box>
        <Select
          name="comment filter"
          id="comment filter"
          value={filterOptions[filterIndex]}
          variant="commentsFilter"
          onChange={handleCommentFilterSelectChange}
          width="160px"
        >
          {filterOptionsComponent}
        </Select>
      </Flex>
      {commentLine > 0 && (
        <WIPComment
          comments={comments}
          isReply={false}
          setCommentLine={setCommentLine}
          setComments={setComments}
          storyTranslationContentId={storyTranslationContentId}
          updateThreadHeadMap={updateThreadHeadMap}
          WIPLineIndex={commentLine}
        />
      )}
      <CommentsList />
    </Box>
  );
};

export default CommentsPanel;
