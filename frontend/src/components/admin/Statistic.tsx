import React from "react";

import { Box, Heading, Text } from "@chakra-ui/react";

export type StatisticProps = {
  header: string;
  num: number;
};

const Statistic = ({ header, num }: StatisticProps) => {
  return (
    <Box
      backgroundColor="blue.50"
      border="1px solid"
      borderRadius="10px"
      color="blue.500"
      flexGrow="1"
      height="150px"
      margin="10px"
      padding="30px 50px"
      textAlign="left"
    >
      <Heading size="sm" textTransform="uppercase">
        {header}
      </Heading>
      <Text fontSize="4xl">{num}</Text>
    </Box>
  );
};

export default Statistic;
