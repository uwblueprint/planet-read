import React from "react";
import { Box, Flex, Heading, Image } from "@chakra-ui/react";
import Logo from "../../assets/planet-read-logo.svg";
import PlaceholderUserIcon from "../../assets/user-icon.svg";

type HeaderProps = {
  currentPageTitle: string;
};

const Header = ({ currentPageTitle }: HeaderProps) => {
  return (
    <Flex
      background="blue.100"
      direction="row"
      padding="20px 0px 20px 0px"
      width="100%"
    >
      <Flex alignItems="center" paddingLeft="20px">
        <Heading size="md">{currentPageTitle}</Heading>
        <Image width="40px" src={Logo} alt="PlanetREAD logo" />
      </Flex>
      {/* TODO: this is not real */}
      <Box marginLeft="auto">
        <Image width="40px" src={PlaceholderUserIcon} alt="User icon" />
      </Box>
    </Flex>
  );
};

export default Header;
