import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { ApolloProvider } from "@apollo/client";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import PrivateRoute from "./components/auth/PrivateRoute";
import CreatePage from "./components/pages/CreatePage";
import Default from "./components/pages/Default";
import DisplayPage from "./components/pages/DisplayPage";
import HomePage from "./components/pages/HomePage";
import NotFound from "./components/pages/NotFound";
import TranslationPage from "./components/pages/TranslationPage";
import UpdatePage from "./components/pages/UpdatePage";
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
              <PrivateRoute exact path="/" component={Default} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <PrivateRoute
                exact
                path="/entity/create"
                component={CreatePage}
              />
              <PrivateRoute
                exact
                path="/entity/update"
                component={UpdatePage}
              />
              <PrivateRoute exact path="/entity" component={DisplayPage} />
              <PrivateRoute exact path="/stories" component={HomePage} />
              <PrivateRoute
                exact
                path="/translation/:storyIdParam/:storyTranslationIdParam"
                component={TranslationPage}
              />
              <Route exact path="*" component={NotFound} />
            </Switch>
          </Router>
        </AuthContext.Provider>
      </ApolloProvider>
    </ChakraProvider>
  );
};

export default App;
