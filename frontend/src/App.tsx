import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { ApolloProvider } from "@apollo/client";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminPage from "./components/pages/AdminPage";
import HomePage from "./components/pages/HomePage";
import NotFound from "./components/pages/NotFound";
import TranslationPage from "./components/pages/TranslationPage";
import ReviewPage from "./components/pages/ReviewPage";
import UserProfilePage from "./components/pages/UserProfilePage";
import customTheme from "./theme/index";

import AUTHENTICATED_USER_KEY from "./constants/AuthConstants";
import AuthContext, { AuthenticatedUser } from "./contexts/AuthContext";
import client from "./APIClients/BaseGQLClient";

import { getLocalStorageObj } from "./utils/LocalStorageUtils";

const App = () => {
  const currentUser: AuthenticatedUser = getLocalStorageObj(
    AUTHENTICATED_USER_KEY,
  );

  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser>(
    currentUser,
  );

  return (
    <ChakraProvider theme={customTheme}>
      <ApolloProvider client={client}>
        <AuthContext.Provider
          value={{ authenticatedUser, setAuthenticatedUser }}
        >
          <Router>
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <PrivateRoute exact path="/" component={HomePage} />
              <PrivateRoute
                exact
                path="/user/:userId"
                component={UserProfilePage}
              />
              <PrivateRoute exact path="/admin" component={AdminPage} />
              <PrivateRoute
                exact
                path="/translation/:storyIdParam/:storyTranslationIdParam"
                component={TranslationPage}
              />
              <PrivateRoute
                exact
                path="/review/:storyIdParam/:storyTranslationIdParam"
                component={ReviewPage}
              />
              <Route exact path="/404" component={NotFound} />
              <Route exact path="*" component={NotFound} />
            </Switch>
          </Router>
        </AuthContext.Provider>
      </ApolloProvider>
    </ChakraProvider>
  );
};

export default App;
