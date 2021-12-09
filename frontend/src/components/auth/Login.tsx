import { useMutation } from "@apollo/client";
import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import authAPIClient from "../../APIClients/AuthAPIClient";
import {
  SIGNUP,
  LOGIN,
  LOGIN_WITH_GOOGLE,
} from "../../APIClients/mutations/AuthMutations";
import AuthContext, { AuthenticatedUser } from "../../contexts/AuthContext";
import LoginComponent from "./LoginComponent";

const Login = () => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [invalidLogin, setInvalidLogin] = useState(false);

  const [signup] = useMutation<{ signup: AuthenticatedUser }>(SIGNUP);
  const [login] = useMutation<{ login: AuthenticatedUser }>(LOGIN);
  const [loginWithGoogle] =
    useMutation<{ loginWithGoogle: AuthenticatedUser }>(LOGIN_WITH_GOOGLE);

  const onLogInClick = async () => {
    setInvalidLogin(false);
    if (isSignup) {
      setIsSignup(false);
    } else {
      try {
        const user: AuthenticatedUser = await authAPIClient.login(
          email,
          password,
          login,
        );
        setAuthenticatedUser(user);
      } catch (error) {
        setInvalidLogin(true);
      }
    }
  };

  const onGoogleLoginSuccess = async (tokenId: string) => {
    const user: AuthenticatedUser = await authAPIClient.loginWithGoogle(
      tokenId,
      loginWithGoogle,
    );
    setAuthenticatedUser(user);
  };

  const validateEmail = (emailToValidate: string) => {
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(emailToValidate.toLowerCase());
  };

  const onSignUpClick = async () => {
    setInvalidLogin(false);
    if (isSignup) {
      if (agreeToTerms && validateEmail(email)) {
        const user: AuthenticatedUser = await authAPIClient.signup(
          firstName,
          lastName,
          email,
          password,
          signup,
        );
        setAuthenticatedUser(user);
      } else if (!agreeToTerms) {
        alert("Please agree to the terms and conditions in order to sign up.");
      } else {
        alert("Please enter a valid email.");
      }
    } else {
      setIsSignup(true);
    }
  };

  const onAgreeToTermsClick = async () => {
    setAgreeToTerms(!agreeToTerms);
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

  if (authenticatedUser && isSignup) {
    return <Redirect to="/complete-profile" />;
  }
  if (authenticatedUser) {
    return <Redirect to="/" />;
  }

  return (
    <LoginComponent
      isSignup={isSignup}
      invalidLogin={invalidLogin}
      firstName={firstName}
      setFirstName={setFirstName}
      lastName={lastName}
      setLastName={setLastName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      agreeToTerms={agreeToTerms}
      onAgreeToTermsClick={onAgreeToTermsClick}
      onLogInClick={onLogInClick}
      onSignUpClick={onSignUpClick}
      onGoogleLoginSuccess={onGoogleLoginSuccess}
      onFailure={onFailure}
    />
  );
};

export default Login;
