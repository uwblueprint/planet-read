import React from "react";
import { Icon } from "@chakra-ui/icon";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { Flex, IconButton, Text } from "@chakra-ui/react";

export type PaginatorProps = {
  first: number;
  last: number;
  total: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
};

const Paginator = ({
  first,
  last,
  total,
  hasPreviousPage,
  hasNextPage,
  onPreviousPage,
  onNextPage,
}: PaginatorProps) => {
  return (
    <Flex justify="flex-end" align="center">
      <Text marginRight={2}>
        <b>
          {first}-{last}
        </b>{" "}
        of {total}
      </Text>
      <IconButton
        aria-label="Previous page"
        background="transparent"
        onClick={onPreviousPage}
        icon={<Icon as={MdChevronLeft} />}
        width="fit-content"
        isDisabled={!hasPreviousPage}
      />
      <IconButton
        aria-label="Next page"
        background="transparent"
        onClick={onNextPage}
        icon={<Icon as={MdChevronRight} />}
        width="fit-content"
        isDisabled={!hasNextPage}
      />
    </Flex>
  );
};

export default Paginator;
