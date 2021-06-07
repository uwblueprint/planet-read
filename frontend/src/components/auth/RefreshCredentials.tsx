import React, { useContext } from "react";
import { gql, useMutation } from "@apollo/client";
// import authAPIClient from "../../APIClients/AuthAPIClient";
import AuthContext from "../../contexts/AuthContext";
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import { setLocalStorageObjProperty } from "../../utils/LocalStorageUtils";

// const RefreshCredentials = () => {
//   const { setAuthenticatedUser } = useContext(AuthContext);

//   const onRefreshClick = async () => {
//     const success = await authAPIClient.refresh();
//     if (!success) {
//       setAuthenticatedUser(null);
//     }
//   };

//   return (
//     <button type="button" className="btn btn-primary" onClick={onRefreshClick}>
//       Refresh Credentials
//     </button>
//   );
// };

const REFRESH = gql`
  mutation Refresh {
    refresh {
      accessToken
      ok
    }
  }
`;

type Refresh = { refresh: { accessToken: string; ok: boolean } };

const RefreshCredentials = () => {
  const { setAuthenticatedUser } = useContext(AuthContext);

  const [refresh] = useMutation<Refresh>(REFRESH);

  const onRefreshClick = async () => {
    const result = await refresh();
    const success = result.data?.refresh.ok;
    const token = result.data?.refresh.accessToken;
    if (success && token) {
      setLocalStorageObjProperty(AUTHENTICATED_USER_KEY, "accessToken", token);
    } else {
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
