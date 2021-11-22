import React from "react";

import { Button, Flex, Heading, Text, Tr, Td } from "@chakra-ui/react";

export type EmptyTableProps = {
  filters: { (data: string | null): void }[];
};

const EmptyTable = ({ filters }: EmptyTableProps) => {
  const clearFilters = () => {
    filters.forEach((setFilter) => {
      setFilter(null);
    });
  };
  return (
    <Tr>
      <Td background="white !important" colspan="100%">
        <Flex
          alignItems="center"
          direction="column"
          height="50vh"
          justify="center"
          minWidth="100%"
        >
          <Flex
            alignItems="center"
            direction="column"
            height="150px"
            justify="space-between"
          >
            <Heading variant="light">
              We can&apos;t seem to find a match :(
            </Heading>
            <Text>Would you like to clear up some filters?</Text>
            <Button colorScheme="blue" onClick={clearFilters} size="secondary">
              Clear Filters
            </Button>
          </Flex>
        </Flex>
      </Td>
    </Tr>
  );
};

export default EmptyTable;
