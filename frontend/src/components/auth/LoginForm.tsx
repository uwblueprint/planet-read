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
      <FormControl isRequired={isSignup} marginTop="30px">
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
        <Flex marginTop="20px">
          <Checkbox
            defaultChecked={agreeToTerms}
            spacing="20px"
            onChange={onAgreeToTermsClick}
          >
            I agree to
          </Checkbox>
          <Text
            marginLeft="5px"
            textDecoration="underline"
            variant="link"
            onClick={onTermsClick}
          >
            terms and conditions
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

export default LoginForm;
