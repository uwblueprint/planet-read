import React, { useContext, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import AuthContext from "../../contexts/AuthContext";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";

interface LogoutResponse {
  ok: Boolean;
}

const LOGOUT = gql`
  mutation Logout($userId: ID!) {
    logout(userId: $userId) {
      ok
    }
  }
`;

const Logout = () => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [logout, { error }] = useMutation<{ logout: LogoutResponse }>(LOGOUT);

  const onLogOutClick = async () => {
    const result = await logout({
      variables: { userId: String(authenticatedUser?.id) },
    });
    if (result.data?.logout.ok === true) {
      localStorage.removeItem(AUTHENTICATED_USER_KEY);
      setAuthenticatedUser(null);
    }
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
