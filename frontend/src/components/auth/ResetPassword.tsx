import React, { useContext } from "react";
import authAPIClient from "../../APIClients/AuthAPIClient";
import AuthContext from "../../contexts/AuthContext";

interface ResetPasswordProps {
  email?: string;
}

const ResetPassword = ({ email }: ResetPasswordProps) => {
  const { authenticatedUser } = useContext(AuthContext);

  const isRealEmailAvailable = (emailString: string): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(emailString).toLowerCase());
  };

  const onResetPasswordClick = async () => {
    if (authenticatedUser == null && !isRealEmailAvailable(email!)) {
      alert("invalid email");
      return;
    }
    const resetEmail = authenticatedUser?.email ?? email;
    if (await authAPIClient.resetPassword(resetEmail)) {
      alert(`Reset email sent to ${resetEmail}`);
    } else {
      alert(`Unsuccessful attempt to send reset email. 
        Check that email is correct.`);
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
