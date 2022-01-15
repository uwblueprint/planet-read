import React from "react";
import {
  Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import InfoAlert from "../utils/InfoAlert";
import { SIGN_UP_ALERT_PASSWORD_LESS_THAN_6_CHARACTERS } from "../../utils/Copy";

type LoginFormProps = {
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
  onAgreeToTermsClick: () => void;
};

const LoginForm = ({
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
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const onShowPasswordClick = async () => {
    setShowPassword(!showPassword);
  };

  // TODO: Display terms and conditions.
  const onTermsClick = () => {
    // eslint-disable-next-line no-console
    console.log("Display terms and conditions.");
  };

  return (
    <Flex direction="column">
      {isSignup && (
        <Flex direction="column">
          <FormControl isRequired marginTop="30px">
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
          <FormControl isRequired marginTop="30px">
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
      <FormControl isRequired={isSignup} marginTop="30px">
        <FormLabel htmlFor="email" color={invalidLogin ? "red" : "black"}>
          Email Address
        </FormLabel>
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
      <FormControl isRequired={isSignup} marginTop="30px">
        <FormLabel htmlFor="password" color={invalidLogin ? "red" : "black"}>
          {isSignup ? "Create Password" : "Password"}
        </FormLabel>
        <InputGroup size="md" paddingBottom="5px">
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
        {password.length > 0 && password.length < 6 ? (
          <InfoAlert
            message={SIGN_UP_ALERT_PASSWORD_LESS_THAN_6_CHARACTERS}
            colour="orange.50"
            height="20px"
          />
        ) : (
          <Flex height="24px" />
        )}
        {invalidLogin && (
          <FormHelperText id="password-helper-text" color="red">
            Invalid login, please try again.
          </FormHelperText>
        )}
      </FormControl>
      {isSignup && (
        <FormControl isRequired marginTop="20px">
          <FormLabel>
            <Checkbox
              defaultChecked={agreeToTerms}
              spacing="20px"
              onChange={onAgreeToTermsClick}
            >
              I agree to
              <Text
                display="inline"
                marginLeft="5px"
                textDecoration="underline"
                variant="link"
                onClick={onTermsClick}
              >
                terms and conditions
              </Text>
            </Checkbox>
          </FormLabel>
        </FormControl>
      )}
    </Flex>
  );
};

export default LoginForm;
