import React, { useContext } from "react";
import { Text } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icon";
import { MdIosShare } from "react-icons/md";
import AuthContext from "../../contexts/AuthContext";
import authAPIClient from "../../APIClients/AuthAPIClient";

const Logout = () => {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

  const onLogOutClick = () => {
    authAPIClient.logout();
    setAuthenticatedUser(null);
  };

  return (
    <Text color="black" onClick={onLogOutClick} variant="link">
      <Icon
        as={MdIosShare}
        height={6}
        marginRight="10px"
        transform="rotate(90deg)"
        width={6}
      />
      Sign out
    </Text>
  );
};

export default Logout;
