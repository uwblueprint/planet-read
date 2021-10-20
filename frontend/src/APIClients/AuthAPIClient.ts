import {
  FetchResult,
  MutationFunctionOptions,
  OperationVariables,
} from "@apollo/client";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { AuthenticatedUser } from "../contexts/AuthContext";
import {
  LogoutResponse,
  ResetPasswordResponse,
  RefreshResponse,
} from "./mutations/AuthMutations";
import { setLocalStorageObjProperty } from "../utils/LocalStorageUtils";

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
    return null;
  }
  return user;
};

type GoogleLoginFunction = (
  options: MutationFunctionOptions<
    { loginWithGoogle: AuthenticatedUser },
    OperationVariables
  >,
) => Promise<FetchResult<{ loginWithGoogle: AuthenticatedUser }>>;

const loginWithGoogle = async (
  tokenId: string,
  loginFunction: GoogleLoginFunction,
): Promise<AuthenticatedUser | null> => {
  let user: AuthenticatedUser = null;
  try {
    const result = await loginFunction({ variables: { tokenId } });
    user = result.data?.loginWithGoogle ?? null;
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
  options: MutationFunctionOptions<
    { signup: AuthenticatedUser },
    OperationVariables
  >,
) => Promise<FetchResult<{ signup: AuthenticatedUser }>>;

const signup = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  signUpFunction: SignUpFunction,
): Promise<AuthenticatedUser | null> => {
  let user: AuthenticatedUser = null;
  try {
    const result = await signUpFunction({
      variables: { firstName, lastName, email, password },
    });
    user = result.data?.signup ?? null;

    if (user) {
      localStorage.setItem(AUTHENTICATED_USER_KEY, JSON.stringify(user));
    }
  } catch (error) {
    return null;
  }
  return user;
};

type LogoutFunction = (
  options: MutationFunctionOptions<
    { logout: LogoutResponse },
    OperationVariables
  >,
) => Promise<FetchResult<{ logout: LogoutResponse }>>;

const logout = async (
  userId: string | undefined,
  logoutFunction: LogoutFunction,
): Promise<boolean> => {
  try {
    await logoutFunction({ variables: { userId } });
    localStorage.removeItem(AUTHENTICATED_USER_KEY);
    return true;
  } catch (error) {
    return false;
  }
};

type ResetPasswordFunction = (
  options: MutationFunctionOptions<
    { resetPassword: ResetPasswordResponse },
    OperationVariables
  >,
) => Promise<FetchResult<{ resetPassword: ResetPasswordResponse }>>;

const resetPassword = async (
  email: string | undefined,
  resetPasswordFunction: ResetPasswordFunction,
): Promise<boolean> => {
  try {
    await resetPasswordFunction({ variables: { email } });
    return true;
  } catch (error) {
    return false;
  }
};

type RefreshFunction = (
  options: MutationFunctionOptions<
    { refresh: RefreshResponse },
    OperationVariables
  >,
) => Promise<FetchResult<{ refresh: RefreshResponse }>>;
// for testing only, refresh does not need to be exposed in the client
const refresh = async (refreshFunction: RefreshFunction): Promise<boolean> => {
  try {
    const result = await refreshFunction({ variables: {} });
    const token = result.data?.refresh.accessToken;
    if (token) {
      setLocalStorageObjProperty(AUTHENTICATED_USER_KEY, "accessToken", token);
    } else {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

export default {
  login,
  loginWithGoogle,
  logout,
  signup,
  resetPassword,
  refresh,
};
