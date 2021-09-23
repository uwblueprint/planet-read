import React from "react";
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { FaGoogle } from "react-icons/fa";
import LoginForm from "./LoginForm";
import LoginImage from "./LoginImage";
import ResetPassword from "./ResetPassword";

type GoogleResponse = GoogleLoginResponse | GoogleLoginResponseOffline;

type GoogleErrorResponse = {
  error: string;
  details: string;
};

type LoginComponentProps = {
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
  onGoogleLoginSuccess: (tokenId: string) => Promise<void>;
  onFailure: (response: GoogleErrorResponse) => void;
};

const LoginComponent = ({
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
  onGoogleLoginSuccess,
  onFailure,
}: LoginComponentProps) => {
  return (
    <Flex>
      <LoginImage />
      <Flex marginTop="140px" marginLeft="120px" direction="column">
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
        />
        <Button
          marginTop={isSignup ? "20px" : "40px"}
          width="100%"
          colorScheme="blue"
          onClick={isSignup ? onSignUpClick : onLogInClick}
          textTransform="none"
        >
          {isSignup ? "Register account" : "Sign in"}
        </Button>
        <GoogleLogin
          clientId="175399577852-6hll8ih9q1ljij8f50f9pf9t2va6u3a7.apps.googleusercontent.com"
          render={(renderProps) => (
            <Button
              marginTop="20px"
              width="100%"
              textTransform="none"
              borderColor="gray.200"
              variant="outline"
              iconSpacing="15px"
              leftIcon={<FaGoogle />}
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              {isSignup ? "Sign up with Google" : "Sign in with Google"}
            </Button>
          )}
          onSuccess={(response: GoogleResponse): void => {
            if ("tokenId" in response) {
              onGoogleLoginSuccess(response.tokenId);
            } else {
              alert(JSON.stringify(response));
            }
          }}
          onFailure={onFailure}
        />
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