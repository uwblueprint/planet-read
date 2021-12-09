import React from "react";
import { Alert, AlertIcon } from "@chakra-ui/react";
import { MdInfoOutline } from "react-icons/md";

type AlertProps = {
  message: string;
};

const InfoAlert = ({ message }: AlertProps) => {
  return (
    <Alert
      status="info"
      borderRadius={8}
      bg="gray.200"
      justifyContent="center"
      textColor="black"
      opacity="60%"
    >
      <AlertIcon as={MdInfoOutline} color="black" />
      {message}
    </Alert>
  );
};

export default InfoAlert;
