import React from "react";
import { Box, Flex, Heading, Image, Spacer } from "@chakra-ui/react";
import Logo from "../../assets/planet-read-logo.svg";
import LoginBackgroundImage from "../../assets/login-background-image.png";

const LoginImage = () => {
  return (
    <Box background="gray.100" width="40vw" minHeight="100vh">
      <Flex direction="column" height="100%">
        <Flex margin="40px">
          <Image width="80px" src={Logo} alt="PlanetRead logo" />
          <Heading as="h3" size="lg" marginLeft="40px">
            Add my Language
          </Heading>
        </Flex>
        <Spacer />
        <Image
          width="100%"
          src={LoginBackgroundImage}
          alt="Login background image"
        />
      </Flex>
    </Box>
  );
};

export default LoginImage;
