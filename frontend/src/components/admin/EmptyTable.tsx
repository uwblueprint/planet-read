import React from "react";

import { Button, Flex, Heading, Text, Tr, Td } from "@chakra-ui/react";

export type EmptyTableProps = {
  filters: { (data: string | null): void }[];
};

const EmptyTable = ({ filters }: EmptyTableProps) => {
  const clearFilters = () => {
    filters.forEach((f) => {
      f(null);
    });
  };
  return (
    <Tr>
      <Td colspan="100%" background="white !important">
        <Flex
          direction="column"
          alignItems="center"
          height="50vh"
          minWidth="100%"
          justify="center"
        >
          <Flex
            alignItems="center"
            justify="space-between"
            direction="column"
            height="150px"
          >
            <Heading variant="light">
              We can&apos;t seem to find a match :(
            </Heading>
            <Text>Would you like to clear up some filters?</Text>
            <Button size="secondary" colorScheme="blue" onClick={clearFilters}>
              Clear Filters
            </Button>
          </Flex>
        </Flex>
      </Td>
    </Tr>
  );
};

export default EmptyTable;
