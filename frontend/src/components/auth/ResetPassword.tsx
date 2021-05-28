import React, { useContext } from "react";
import { gql, useMutation } from "@apollo/client";
import AuthContext from "../../contexts/AuthContext";

interface ResetPasswordProps {
  email?: string;
}

const RESET_PASSWORD = gql`
  mutation ResetPassword($email: String!) {
    resetPassword(email: $email) {
      ok
    }
  }
`;

const ResetPassword = ({ email }: ResetPasswordProps) => {
  const { authenticatedUser } = useContext(AuthContext);

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
    if (authenticatedUser == null && !isRealEmailAvailable(email!)) {
      alert("Invalid email");
      return;
    }

    const resetEmail = authenticatedUser?.email ?? email;
    try {
      const result = await resetPassword({ variables: { email: resetEmail } });

      if (result.data?.resetPassword.ok) {
        handleSuccessOnReset(`Reset email sent to ${resetEmail}`);
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

ResetPassword.defaultProps = {
  email: "",
};

export default ResetPassword;
