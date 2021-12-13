import React from "react";
import { Alert, AlertIcon } from "@chakra-ui/react";
import { MdInfoOutline } from "react-icons/md";

export type AlertProps = {
  message: string;
  colour?: string;
};

const InfoAlert = ({ message, colour = "gray.200" }: AlertProps) => {
  return (
    <Alert
      status="info"
      borderRadius={8}
      bg={colour}
      justifyContent="center"
      textColor="black"
      opacity="60%"
      height="50px"
    >
      <AlertIcon as={MdInfoOutline} color="black" />
      {message}
    </Alert>
  );
};

export default InfoAlert;
