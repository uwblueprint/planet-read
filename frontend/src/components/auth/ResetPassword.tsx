import React from "react";
import { useMutation } from "@apollo/client";
import {
  RESET_PASSWORD,
  ResetPasswordResponse,
} from "../../APIClients/mutations";
import authAPIClient from "../../APIClients/AuthAPIClient";

type ResetPasswordProps = {
  email: string;
};

const ResetPassword = ({ email }: ResetPasswordProps) => {
  const isRealEmailAvailable = (emailString: string): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(emailString).toLowerCase());
  };

  const [resetPassword] = useMutation<{ resetPassword: ResetPasswordResponse }>(
    RESET_PASSWORD,
  );

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
      handleErrorOnReset(err ?? "Error occurred, please try again.");
    }
  };

  return (
    <button
      type="button"
      className="btn btn-primary"
      onClick={onResetPasswordClick}
    >
      Reset Password
    </button>
  );
};

export default ResetPassword;
