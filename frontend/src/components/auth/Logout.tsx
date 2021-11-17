import React, { useContext, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { Text } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icon";
import { MdIosShare } from "react-icons/md";
import AuthContext from "../../contexts/AuthContext";
import {
  LOGOUT,
  LogoutResponse,
} from "../../APIClients/mutations/AuthMutations";
import authAPIClient from "../../APIClients/AuthAPIClient";

const Logout = () => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [logout, { error }] = useMutation<{ logout: LogoutResponse }>(LOGOUT);

  const onLogOutClick = async () => {
    await authAPIClient.logout(String(authenticatedUser?.id), logout);
    setAuthenticatedUser(null);
  };

  useEffect(() => {
    if (error) {
      // TODO: Implement Error State
      // eslint-disable-next-line no-alert
      alert(error);
    }
  }, [error]);

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
