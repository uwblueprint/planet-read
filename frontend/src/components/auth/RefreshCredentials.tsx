import React, { useContext } from "react";
import { useMutation } from "@apollo/client";
import AuthContext from "../../contexts/AuthContext";
import { REFRESH, RefreshResponse } from "../../APIClients/mutations";
import authAPIClient from "../../APIClients/AuthAPIClient";

const RefreshCredentials = () => {
  const { setAuthenticatedUser } = useContext(AuthContext);

  const [refresh] = useMutation<{ refresh: RefreshResponse }>(REFRESH);

  const onRefreshClick = async () => {
    const result = await authAPIClient.refresh(refresh);
    if (!result) {
      setAuthenticatedUser(null);
    }
  };

  return (
    <button type="button" className="btn btn-primary" onClick={onRefreshClick}>
      Refresh Credentials
    </button>
  );
};

export default RefreshCredentials;
