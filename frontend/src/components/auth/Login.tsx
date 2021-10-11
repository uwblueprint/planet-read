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
  SIGNUP,
  LOGIN,
  LOGIN_WITH_GOOGLE,
} from "../../APIClients/mutations/AuthMutations";
import AuthContext, { AuthenticatedUser } from "../../contexts/AuthContext";
import ResetPassword from "./ResetPassword";

type GoogleResponse = GoogleLoginResponse | GoogleLoginResponseOffline;

const Login = () => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [title, setTitle] = useState("Login");

  const [signup] = useMutation<{ signup: AuthenticatedUser }>(SIGNUP);
  const [login] = useMutation<{ login: AuthenticatedUser }>(LOGIN);
  const [loginWithGoogle] = useMutation<{ loginWithGoogle: AuthenticatedUser }>(
    LOGIN_WITH_GOOGLE,
  );

  const onLogInClick = async () => {
    if (isSignup) {
      setIsSignup(false);
      setTitle("Login");
    } else {
      const user: AuthenticatedUser = await authAPIClient.login(
        email,
        password,
        login,
      );
      setAuthenticatedUser(user);
    }
  };

  const onGoogleLoginSuccess = async (tokenId: string) => {
    const user: AuthenticatedUser = await authAPIClient.loginWithGoogle(
      tokenId,
      loginWithGoogle,
    );
    setAuthenticatedUser(user);
  };

  const onSignUpClick = async () => {
    if (isSignup) {
      const user: AuthenticatedUser = await authAPIClient.signup(
        firstName,
        lastName,
        email,
        password,
        signup,
      );
      setAuthenticatedUser(user);
    } else {
      setIsSignup(true);
      setTitle("Signup");
    }
  };

  type GoogleErrorResponse = {
    error: string;
    details: string;
  };

  const onFailure = (response: GoogleErrorResponse) => {
    // https://stackoverflow.com/questions/63631849/google-sign-in-not-working-in-incognito-mode
    if (response.error === "idpiframe_initialization_failed") {
      console.warn("Google SignIn does not work on incognito mode.");
    } else {
      alert(JSON.stringify(response));
    }
  };

  if (authenticatedUser) {
    return <Redirect to="/" />;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>{title}</h1>
      <form>
        {isSignup && (
          <div>
            <input
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="First Name"
            />
          </div>
        )}
        {isSignup && (
          <div>
            <input
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder="Last Name"
            />
          </div>
        )}
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
          <button
            className="btn btn-primary"
            type="button"
            onClick={onSignUpClick}
          >
            Sign Up
          </button>
          {!isSignup && <ResetPassword email={email} />}

          {!isSignup && (
            <GoogleLogin
              clientId="175399577852-6hll8ih9q1ljij8f50f9pf9t2va6u3a7.apps.googleusercontent.com"
              buttonText="Google"
              onSuccess={(response: GoogleResponse): void => {
                if ("tokenId" in response) {
                  onGoogleLoginSuccess(response.tokenId);
                } else {
                  alert(JSON.stringify(response));
                }
              }}
              onFailure={onFailure}
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
