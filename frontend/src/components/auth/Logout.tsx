import React, { useContext, useEffect } from "react";
import { useMutation } from "@apollo/client";
import AuthContext from "../../contexts/AuthContext";
import { LOGOUT, LogoutResponse } from "../../APIClients/mutations";
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
    <button type="button" className="btn btn-primary" onClick={onLogOutClick}>
      Log Out
    </button>
  );
};

export default Logout;
