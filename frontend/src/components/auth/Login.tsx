import { useMutation } from "@apollo/client";
import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import authAPIClient from "../../APIClients/AuthAPIClient";
import { SIGNUP, LOGIN } from "../../APIClients/mutations/AuthMutations";
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
  const [isLoading, setIsLoading] = useState(false);

  const [signup] = useMutation<{ signup: AuthenticatedUser }>(SIGNUP);
  const [login] = useMutation<{ login: AuthenticatedUser }>(LOGIN);

  const onLogInClick = async () => {
    setInvalidLogin(false);
    if (isSignup) {
      setIsSignup(false);
    } else {
      try {
        setIsLoading(true);
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
    setIsLoading(false);
  };

  const validateEmail = (emailToValidate: string) => {
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(emailToValidate.toLowerCase());
  };

  const onSignUpClick = async () => {
    setInvalidLogin(false);
    if (isSignup) {
      if (validateEmail(email)) {
        setIsLoading(true);
        const user: AuthenticatedUser = await authAPIClient.signup(
          firstName,
          lastName,
          email,
          password,
          signup,
        );
        setAuthenticatedUser(user);
      } else {
        // eslint-disable-next-line no-alert
        window.alert("Please enter a valid email.");
      }
    } else {
      setIsSignup(true);
    }
    setIsLoading(false);
  };

  const onAgreeToTermsClick = async () => {
    setAgreeToTerms(!agreeToTerms);
  };

  if (authenticatedUser && isSignup) {
    return <Redirect to="/complete-profile" />;
  }
  if (authenticatedUser) {
    return <Redirect to="/" />;
  }

  return (
    <LoginComponent
      isLoading={isLoading}
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
    />
  );
};

export default Login;
