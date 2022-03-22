import React, { useEffect } from "react";
import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import LoginForm from "./LoginForm";
import LoginImage from "./LoginImage";
import ResetPassword from "./ResetPassword";

type LoginComponentProps = {
  isLoading: boolean;
  isSignup: boolean;
  invalidLogin: boolean;
  firstName: string;
  setFirstName: (firstName: string) => void;
  lastName: string;
  setLastName: (lastName: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  agreeToTerms: boolean;
  onAgreeToTermsClick: () => Promise<void>;
  onLogInClick: () => Promise<void>;
  onSignUpClick: () => Promise<void>;
};

const LoginComponent = ({
  isLoading,
  isSignup,
  invalidLogin,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  password,
  setPassword,
  agreeToTerms,
  onAgreeToTermsClick,
  onLogInClick,
  onSignUpClick,
}: LoginComponentProps) => {
  const isValidEmail = () => {
    // Email validation is case insensitive and allows for plus signs and
    // periods in the email
    return /^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*(\+[a-zA-Z0-9-]+)?@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]{2,63}$/.test(
      email,
    );
  };

  const isValidPassword = () => {
    if (password.length >= 8 && /\d/.test(password) && /\D/.test(password)) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    window.addEventListener("keyup", (event) => {
      const submitButton = document.getElementById("submit-login-form");
      if (event.key === "Enter" && submitButton !== null) {
        submitButton.click();
      }
    });
  }, []);

  return (
    <Flex>
      <LoginImage />
      <Flex
        marginTop="140px"
        marginLeft="120px"
        direction="column"
        width="450px"
      >
        <Flex>
          <Heading as="h3" size="lg">
            {isSignup ? "Sign up to" : "Sign in to"}
          </Heading>
          <Heading as="h3" size="lg" color="blue.500" marginLeft="7px">
            Add my Language!
          </Heading>
        </Flex>
        <Text marginTop="10px" color="gray.400">
          For the purposes of this platform, your details are required.
        </Text>
        <LoginForm
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
          isValidEmail={isValidEmail}
          isValidPassword={isValidPassword}
        />
        <Button
          id="submit-login-form"
          marginTop={isSignup ? "15px" : "25px"}
          width="100%"
          colorScheme="blue"
          isDisabled={
            email === "" ||
            password === "" ||
            (isSignup &&
              (firstName === "" ||
                lastName === "" ||
                !agreeToTerms ||
                !isValidEmail() ||
                !isValidPassword()))
          }
          isLoading={isLoading}
          loadingText={isSignup ? "Registering account" : "Signing in"}
          onClick={isSignup ? onSignUpClick : onLogInClick}
          textTransform="none"
        >
          {isSignup ? "Register account" : "Sign in"}
        </Button>
        {!isSignup && <ResetPassword email={email} />}
        <Flex marginTop="15px">
          <Text color="gray.400">
            {isSignup ? "Already have an account?" : "Don't have an account?"}
          </Text>
          <Text
            marginLeft="5px"
            textDecoration="underline"
            variant="link"
            onClick={isSignup ? onLogInClick : onSignUpClick}
          >
            {isSignup ? "Sign in" : "Sign up"}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default LoginComponent;
