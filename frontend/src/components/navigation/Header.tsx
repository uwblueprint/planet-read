import React from "react";
import { Flex, Heading, Image } from "@chakra-ui/react";
import Logo from "../../assets/planet-read-logo.svg";
import PlaceholderUserIcon from "../../assets/user-icon.svg";

type HeaderProps = {
  title: string;
};

const Header = ({ title }: HeaderProps) => {
  return (
    <Flex justify="space-between" alignItems="center" margin="20px 30px">
      <Flex width="300px" justify="flex-start" alignItems="center">
        <Heading size="md" margin="0 10px 0 0">
          Add my Language
        </Heading>
        <Image width="40px" src={Logo} alt="Planet read logo" />
      </Flex>
      <Heading size="lg">{title}</Heading>
      <Flex width="300px" justify="flex-end">
        <Image width="40px" src={PlaceholderUserIcon} alt="User icon" />
      </Flex>
    </Flex>
  );
};

export default Header;
