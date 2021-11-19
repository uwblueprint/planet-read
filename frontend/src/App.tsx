import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ChakraProvider, useColorMode } from "@chakra-ui/react";
import { ApolloProvider } from "@apollo/client";

import Login from "./components/auth/Login";
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminPage from "./components/pages/AdminPage";
import HomePage from "./components/pages/HomePage";
import NotFound from "./components/pages/NotFound";
import TranslationPage from "./components/pages/TranslationPage";
import ReviewPage from "./components/pages/ReviewPage";
import UserProfilePage from "./components/pages/UserProfilePage";
import ManageStoryTranslationPage from "./components/pages/ManageStoryTranslationPage";
import customTheme from "./theme/index";

import AUTHENTICATED_USER_KEY from "./constants/AuthConstants";
import AuthContext, { AuthenticatedUser } from "./contexts/AuthContext";
import client from "./APIClients/BaseGQLClient";

import { getLocalStorageObj } from "./utils/LocalStorageUtils";

/*
 * https://github.com/chakra-ui/chakra-ui/issues/4987#issuecomment-965575708
 * Light mode shouldn't have to be forced in chakra-ui/react 1.7.1
 * but it's stil buggy on Kristy's windows 10 with default app mode set to dark
 */
function ForceLightMode(props: { children: JSX.Element }) {
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (colorMode === "light") return;
    toggleColorMode();
  }, [colorMode]);

  return props.children;
}

const App = () => {
  const currentUser: AuthenticatedUser = getLocalStorageObj(
    AUTHENTICATED_USER_KEY,
  );

  const [authenticatedUser, setAuthenticatedUser] =
    useState<AuthenticatedUser>(currentUser);

  return (
    <ChakraProvider theme={customTheme}>
      <ForceLightMode>
        <ApolloProvider client={client}>
          <AuthContext.Provider
            value={{ authenticatedUser, setAuthenticatedUser }}
          >
            <Router>
              <Switch>
                <Route exact path="/login" component={Login} />
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
                <PrivateRoute
                  exact
                  path="/story/:storyIdParam/:storyTranslationIdParam"
                  component={ManageStoryTranslationPage}
                />
                <Route exact path="/404" component={NotFound} />
                <Route exact path="*" component={NotFound} />
              </Switch>
            </Router>
          </AuthContext.Provider>
        </ApolloProvider>
      </ForceLightMode>
    </ChakraProvider>
  );
};

export default App;
