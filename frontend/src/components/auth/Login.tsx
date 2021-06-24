import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import authAPIClient from "../../APIClients/AuthAPIClient";
import AuthContext, { AuthenticatedUser } from "../../contexts/AuthContext";
import ResetPassword from "./ResetPassword";

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      firstName
      lastName
      email
      role
      approvedLanguages
      accessToken
      refreshToken
    }
  }
`;

const Login = () => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signup, setSignup] = useState(false);

  const [login] = useMutation<{ login: AuthenticatedUser }>(LOGIN);

  const onLogInClick = async () => {
    const user: AuthenticatedUser = await authAPIClient.login(
      email,
      password,
      login,
    );
    setAuthenticatedUser(user);
  };

  const onSignUpClick = async () => {
    setSignup(true);
  };

  if (authenticatedUser) {
    return <Redirect to="/" />;
  }

  if (signup) {
    return <Redirect to="/signup" />;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Login</h1>
      <form>
        <div>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="username@domain.com"
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="password"
          />
        </div>
        <div>
          <button
            className="btn btn-primary"
            type="button"
            onClick={onLogInClick}
          >
            Log In
          </button>
          <ResetPassword email={email} />
        </div>
        <div>
          <button
            className="btn btn-primary"
            type="button"
            onClick={onSignUpClick}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
