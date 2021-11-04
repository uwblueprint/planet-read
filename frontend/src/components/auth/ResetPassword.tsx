import React from "react";
import { useMutation } from "@apollo/client";
import { Text } from "@chakra-ui/react";
import {
  RESET_PASSWORD,
  ResetPasswordResponse,
} from "../../APIClients/mutations/AuthMutations";
import authAPIClient from "../../APIClients/AuthAPIClient";

type ResetPasswordProps = {
  email: string;
};

const ResetPassword = ({ email }: ResetPasswordProps) => {
  const isRealEmailAvailable = (emailString: string): boolean => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(emailString).toLowerCase());
  };

  const [resetPassword] =
    useMutation<{ resetPassword: ResetPasswordResponse }>(RESET_PASSWORD);

  const handleErrorOnReset = (errorMessage: string) => {
    // eslint-disable-next-line no-alert
    alert(errorMessage);
  };

  const handleSuccessOnReset = (successMessage: string) => {
    // eslint-disable-next-line no-alert
    alert(successMessage);
  };

  const onResetPasswordClick = async () => {
    if (!isRealEmailAvailable(email!)) {
      // eslint-disable-next-line no-alert
      alert("Invalid email");
      return;
    }

    try {
      const result = await authAPIClient.resetPassword(email, resetPassword);
      if (result) {
        handleSuccessOnReset(`Reset email sent to ${email}`);
      } else {
        handleErrorOnReset("Reset password failed.");
      }
    } catch (err) {
      if (typeof err === "string") {
        handleErrorOnReset(err);
      } else {
        console.log(err);
        handleErrorOnReset("Error occurred, please try again.");
      }
    }
  };

  return (
    <Text marginTop="15px" as="u" variant="link" onClick={onResetPasswordClick}>
      Forgot password?
    </Text>
  );
};

export default ResetPassword;
