import { useMutation } from "@apollo/client";
import React, { useContext, useState } from "react";
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import { Redirect } from "react-router-dom";
import authAPIClient from "../../APIClients/AuthAPIClient";
import {
  LOGIN,
  LOGIN_WITH_GOOGLE,
} from "../../APIClients/mutations/AuthMutations";
import AuthContext, { AuthenticatedUser } from "../../contexts/AuthContext";
import ResetPassword from "./ResetPassword";

type GoogleResponse = GoogleLoginResponse | GoogleLoginResponseOffline;

const Login = () => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signup, setSignup] = useState(false);

  const [login] = useMutation<{ login: AuthenticatedUser }>(LOGIN);
  const [loginWithGoogle] = useMutation<{ loginWithGoogle: AuthenticatedUser }>(
    LOGIN_WITH_GOOGLE,
  );

  const onLogInClick = async () => {
    const user: AuthenticatedUser = await authAPIClient.login(
      email,
      password,
      login,
    );
    setAuthenticatedUser(user);
  };

  const onGoogleLoginSuccess = async (tokenId: string) => {
    const user: AuthenticatedUser = await authAPIClient.loginWithGoogle(
      tokenId,
      loginWithGoogle,
    );
    setAuthenticatedUser(user);
  };

  const onSignUpClick = async () => {
    setSignup(true);
  };

  if (authenticatedUser) {
    return <Redirect to="/" />;
  }

  if (signup) {
    return <Redirect to="/signup" />;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Login</h1>
      <form>
        <div>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="username@domain.com"
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="password"
          />
        </div>
        <div>
          <button
            className="btn btn-primary"
            type="button"
            onClick={onLogInClick}
          >
            Log In
          </button>
          <ResetPassword email={email} />

          <GoogleLogin
            clientId="175399577852-6hll8ih9q1ljij8f50f9pf9t2va6u3a7.apps.googleusercontent.com"
            buttonText="Google"
            onSuccess={(response: GoogleResponse): void => {
              if ("tokenId" in response) {
                onGoogleLoginSuccess(response.tokenId);
              } else {
                console.log(response);
              }
            }}
            onFailure={(response) => alert(response)}
          />
        </div>
        <div>
          <button
            className="btn btn-primary"
            type="button"
            onClick={onSignUpClick}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
