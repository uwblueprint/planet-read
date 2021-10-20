import { useMutation } from "@apollo/client";
import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { FaRegEye, FaRegEyeSlash, FaGoogle } from "react-icons/fa";
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
import Logo from "../../assets/planet-read-logo.svg";
import LoginPageImage from "../../assets/login-page-image.png";

type GoogleResponse = GoogleLoginResponse | GoogleLoginResponseOffline;

const Login = () => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const [signup] = useMutation<{ signup: AuthenticatedUser }>(SIGNUP);
  const [login] = useMutation<{ login: AuthenticatedUser }>(LOGIN);
  const [loginWithGoogle] = useMutation<{ loginWithGoogle: AuthenticatedUser }>(
    LOGIN_WITH_GOOGLE,
  );

  const [showPassword, setShowPassword] = React.useState(false);
  const [agreeToTerms, setAgreeToTerms] = React.useState(false);
  const [invalidLogin, setInvalidLogin] = React.useState(false);

  const onLogInClick = async () => {
    setInvalidLogin(false);
    if (isSignup) {
      setIsSignup(false);
    } else {
      const user: AuthenticatedUser = await authAPIClient.login(
        email,
        password,
        login,
      );
      if (user == null) {
        setInvalidLogin(true);
      } else {
        setAuthenticatedUser(user);
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

  const onSignUpClick = async () => {
    setInvalidLogin(false);
    if (isSignup) {
      if (agreeToTerms) {
        const user: AuthenticatedUser = await authAPIClient.signup(
          firstName,
          lastName,
          email,
          password,
          signup,
        );
        setAuthenticatedUser(user);
      } else {
        alert("Please agree to the terms and conditions in order to sign up.");
      }
    } else {
      setIsSignup(true);
    }
  };

  const onShowPasswordClick = async () => {
    setShowPassword(!showPassword);
  };

  const onAgreeToTermsClick = async () => {
    setAgreeToTerms(!agreeToTerms);
  };

  const onTermsClick = async () => {
    console.log("Display terms and conditions.");
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
    <Flex>
      <Box bg="gray.100" w="40vw" h="100vh">
        <Flex direction="column" h="100%">
          <Flex margin="40px">
            <Image w="80px" src={Logo} alt="PlanetRead logo" />
            <Heading as="h3" size="lg" ml="40px">
              Add my Language
            </Heading>
          </Flex>
          <Spacer />
          <Image w="100%" src={LoginPageImage} alt="Login page image" />
        </Flex>
      </Box>
      <Flex margin="140px 0 0 120px" direction="column">
        <Flex>
          <Heading as="h3" size="lg">
            {isSignup ? "Sign up to" : "Sign in to"}
          </Heading>
          <Heading as="h3" size="lg" color="blue.500" ml="7px">
            Add my Language!
          </Heading>
        </Flex>
        <Text mt="10px" color="gray.400">
          For the purposes of this platform, your details are required.
        </Text>
        {isSignup && (
          <Flex direction="column">
            <FormControl isRequired mt="30px">
              <FormLabel htmlFor="first-name">First name</FormLabel>
              <Input
                id="first-name"
                size="md"
                type="text"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="Enter first name"
              />
            </FormControl>
            <FormControl isRequired mt="30px">
              <FormLabel htmlFor="last-name">Last name</FormLabel>
              <Input
                id="last-name"
                size="md"
                type="text"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Enter last Name"
              />
            </FormControl>
          </Flex>
        )}
        <FormControl isRequired={isSignup} mt="30px">
          <FormLabel htmlFor="email">Email Address</FormLabel>
          <Input
            id="email"
            size="md"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            isInvalid={invalidLogin}
            placeholder="Enter email address"
          />
        </FormControl>
        <FormControl isRequired={isSignup} mt="30px">
          <FormLabel htmlFor="password">
            {isSignup ? "Create Password" : "Password"}
          </FormLabel>
          <InputGroup size="md">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              isInvalid={invalidLogin}
              placeholder="Enter password"
            />
            <InputRightElement>
              <IconButton
                variant="ghost"
                onClick={onShowPasswordClick}
                aria-label={showPassword ? "Shown" : "Hidden"}
                icon={showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                color={showPassword ? "blue.100" : "gray.400"}
              />
            </InputRightElement>
          </InputGroup>
          {invalidLogin && (
            <FormHelperText id="password-helper-text" color="red">
              Invalid login, please try again.
            </FormHelperText>
          )}
        </FormControl>
        {isSignup && (
          <Flex mt="20px">
            <Checkbox spacing="20px" onChange={onAgreeToTermsClick}>
              I agree to
            </Checkbox>
            <Text ml="5px" as="u" variant="link" onClick={onTermsClick}>
              terms and conditions
            </Text>
          </Flex>
        )}
        <Button
          mt={isSignup ? "20px" : "40px"}
          w="100%"
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
              mt="20px"
              w="100%"
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
        <Flex mt="15px">
          <Text color="gray.400">
            {isSignup ? "Already have an account?" : "Don't have an account?"}
          </Text>
          <Text
            ml="5px"
            as="u"
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

export default Login;
