import React from "react";
import { Text, Flex, Button } from "@chakra-ui/react";
import { CommentResponse } from "../../APIClients/queries/CommentQueries";

export type ExistingCommentProps = {
  comment: CommentResponse;
  handleReply?: () => void;
  isFirstReply: boolean;
  isThreadHead: boolean;
  resolveExistingComment?: () => void;
  userName: string;
};

const ExistingComment = ({
  comment,
  handleReply,
  isFirstReply,
  isThreadHead,
  resolveExistingComment,
  userName,
}: ExistingCommentProps) => {
  const { content, lineIndex: storyContentId, resolved, time } = comment;

  const newTime = new Date(time);
  const displayTime = new Date(
    newTime.getTime() - newTime.getTimezoneOffset() * 60000,
  );

  return (
    <Flex
      backgroundColor="transparent"
      borderRadius="8"
      direction="column"
      padding="14px 14px"
      width={`${!isThreadHead ? 300 : 320}px`}
      margin={`${!isThreadHead ? 20 : 0}px`}
    >
      {(isThreadHead || isFirstReply) && (
        <Text fontWeight="bold" marginBottom="15px">
          {isFirstReply && "Replies to "}
          Line {storyContentId + 1}
        </Text>
      )}
      <Flex justify="space-between" marginBottom="10px">
        <p>{userName}</p>
        <p>
          {displayTime.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </p>
      </Flex>
      <Text fontSize="sm" marginBottom="5px">
        {content}
      </Text>
      <Flex>
        {!resolved && isThreadHead && (
          <>
            <Button
              onClick={handleReply ? () => handleReply() : undefined}
              variant="commentLabel"
            >
              Reply
            </Button>
            <Button onClick={resolveExistingComment} variant="commentLabel">
              Resolve
            </Button>
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default ExistingComment;
