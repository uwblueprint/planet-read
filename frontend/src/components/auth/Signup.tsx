import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import authAPIClient from "../../APIClients/AuthAPIClient";
import AuthContext, { AuthenticatedUser } from "../../contexts/AuthContext";

const Signup = () => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignUpClick = async () => {
    const user: AuthenticatedUser = await authAPIClient.signup(
      firstName,
      lastName,
      email,
      password,
    );
    setAuthenticatedUser(user);
  };

  if (authenticatedUser) {
    return <Redirect to="/" />;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Signup</h1>
      <form>
        <div>
          <input
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="First Name"
          />
        </div>
        <div>
          <input
            type="text"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Last Name"
          />
        </div>
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
            onClick={onSignUpClick}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
