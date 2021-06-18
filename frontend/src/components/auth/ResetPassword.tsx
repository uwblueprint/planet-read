import React from "react";
import { gql, useMutation } from "@apollo/client";

type ResetPasswordProps = {
  email: string;
};

const RESET_PASSWORD = gql`
  mutation ResetPassword($email: String!) {
    resetPassword(email: $email) {
      ok
    }
  }
`;

const ResetPassword = ({ email }: ResetPasswordProps) => {
  const isRealEmailAvailable = (emailString: string): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(emailString).toLowerCase());
  };

  type ResetPassword = { ok: boolean };
  const [resetPassword] = useMutation<{ resetPassword: ResetPassword }>(
    RESET_PASSWORD,
  );

  const handleErrorOnReset = (errorMessage: string) => {
    alert(errorMessage);
  };

  const handleSuccessOnReset = (successMessage: string) => {
    alert(successMessage);
  };

  const onResetPasswordClick = async () => {
    if (!isRealEmailAvailable(email!)) {
      alert("Invalid email");
      return;
    }

    try {
      const result = await resetPassword({ variables: { email } });

      if (result.data?.resetPassword.ok) {
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
