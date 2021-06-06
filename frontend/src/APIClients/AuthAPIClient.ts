import {
  FetchResult,
  MutationFunctionOptions,
  OperationVariables,
} from "@apollo/client";
import baseAPIClient from "./BaseAPIClient";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { AuthenticatedUser } from "../contexts/AuthContext";
import {
  getLocalStorageObjProperty,
  setLocalStorageObjProperty,
} from "../utils/LocalStorageUtils";

type LoginFunction = (
  options: MutationFunctionOptions<
    { login: AuthenticatedUser },
    OperationVariables
  >,
) => Promise<FetchResult<{ login: AuthenticatedUser }>>;

const login = async (
  email: string,
  password: string,
  loginFunction: LoginFunction,
): Promise<AuthenticatedUser | null> => {
  let user: AuthenticatedUser = null;
  try {
    const result = await loginFunction({ variables: { email, password } });
    user = result.data?.login ?? null;
    if (user) {
      localStorage.setItem(AUTHENTICATED_USER_KEY, JSON.stringify(user));
    }
  } catch (e: unknown) {
    // eslint-disable-next-line no-alert
    window.alert("Failed to login");
  }
  return user;
};

type SignUpFunction = (
  options?:
    | MutationFunctionOptions<{ signup: AuthenticatedUser }, OperationVariables>
    | undefined,
) => Promise<
  FetchResult<
    { signup: AuthenticatedUser },
    Record<string, unknown>,
    Record<string, unknown>
  >
>;

const signup = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  signUpFunction: SignUpFunction, 
): Promise<AuthenticatedUser | null> => {
  let user: AuthenticatedUser = null;
  try {
    const result = await signUpFunction({variables: { firstName, lastName, email, password } }); 
    user = result.data?.login ?? null; 

    if (user) {
      localStorage.setItem(AUTHENTICATED_USER_KEY, JSON.stringify(user)); 
    }
  } catch (error) {
    window.alert("Sign Up Failed"); 
  }

  return user; 
};

const logout = async (userId: string | undefined): Promise<boolean> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    await baseAPIClient.post(
      `/auth/logout/${userId}`,
      {},
      { headers: { Authorization: bearerToken } },
    );
    localStorage.removeItem(AUTHENTICATED_USER_KEY);
    return true;
  } catch (error) {
    return false;
  }
};

const resetPassword = async (email: string | undefined): Promise<boolean> => {
  const bearerToken = `Bearer ${getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  )}`;
  try {
    await baseAPIClient.post(
      `/auth/resetPassword/${email}`,
      {},
      { headers: { Authorization: bearerToken } },
    );
    return true;
  } catch (error) {
    return false;
  }
};

// for testing only, refresh does not need to be exposed in the client
const refresh = async (): Promise<boolean> => {
  try {
    const { data } = await baseAPIClient.post(
      "/auth/refresh",
      {},
      { withCredentials: true },
    );
    setLocalStorageObjProperty(
      AUTHENTICATED_USER_KEY,
      "accessToken",
      data.accessToken,
    );
    return true;
  } catch (error) {
    return false;
  }
};

export default { login, logout, signup, resetPassword, refresh };
