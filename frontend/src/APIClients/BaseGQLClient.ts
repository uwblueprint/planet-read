import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  Observable,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { RetryLink } from "@apollo/client/link/retry";
import { relayStylePagination } from "@apollo/client/utilities";
import { createUploadLink } from "apollo-upload-client";
import jwt from "jsonwebtoken";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { getLocalStorageObjProperty } from "../utils/LocalStorageUtils";

const httpLink = createUploadLink({
  uri: `${process.env.REACT_APP_BACKEND_URL}/graphql`,
  credentials: "include",
}) as unknown as ApolloLink;

const authFromLocalLink = setContext(async (_, { headers }) => {
  const accessToken = getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  );
  return {
    headers: {
      ...headers,
      Authorizaton: accessToken ? `Bearer ${accessToken}` : "",
    },
  };
});

const injectAccessToken = async (operation: any) => {
  const accessToken = getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  );
  operation.setContext({
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const decodedToken: any = jwt.decode(accessToken);
  const currTime = Math.round(new Date().getTime() / 1000);
  if (!decodedToken || decodedToken.exp <= currTime) {
    localStorage.clear();
    window.location.reload();
    throw Error("Token expired, sign out");
  }
};

// https://www.apollographql.com/blog/apollo-client/using-apollo-link-to-handle-dependent-queries/
const accessTokenInjectionLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      let handle: any;
      Promise.resolve(operation)
        .then((op) => injectAccessToken(op))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(observer.error.bind(observer));
      return () => {
        if (handle) handle.unsubscribe();
      };
    }),
);

const refreshDirectionalLink = new RetryLink().split(
  (operation) =>
    ["Refresh", "ResetPassword", "Login", "SignUp", "LoginWithGoogle"].includes(
      operation.operationName,
    ),
  authFromLocalLink.concat(httpLink),
  accessTokenInjectionLink.concat(httpLink),
);

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      // eslint-disable-next-line no-console
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  // eslint-disable-next-line no-console
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

/*
Link Tree
errorLink -> refreshDirectionalLink
              -> authFromLocalLink
              -> variableInjectionLink -> authFromContextLink
*/
const client = new ApolloClient({
  link: errorLink.concat(refreshDirectionalLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          storyTranslations: relayStylePagination(),
        },
      },
    },
  }),
});

export default client;
