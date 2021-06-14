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
  const [logout, { data, error }] = useMutation<{ logout: LogoutResponse }>(
    LOGOUT,
  );

  useEffect(() => {
    if (data?.logout?.ok) {
      setAuthenticatedUser(null);
      localStorage.removeItem(AUTHENTICATED_USER_KEY);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      // TODO: Implement Error State
      console.log(error);
    }
  }, [error]);

  return (
    <button
      type="button"
      className="btn btn-primary"
      onClick={() => {
        logout({
          variables: { userId: authenticatedUser?.id },
        });
      }}
    >
      Log Out
    </button>
  );
};

export default Logout;