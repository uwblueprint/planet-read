import React from "react";

import { Box, Heading, Text } from "@chakra-ui/react";

export type BlockProps = {
  header: string;
  text: string;
};

const Block = ({ header, text }: BlockProps) => {
  return (
    <Box flexGrow={1}>
      <Box h={2} backgroundColor="blue.50" />
      <Heading
        color="blue.500"
        marginBottom="5px"
        size="sm"
        textTransform="uppercase"
      >
        {header}
      </Heading>
      <Text>{text}</Text>
    </Box>
  );
};

export default Block;
