import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const httpLink = new HttpLink({
  uri: '/graphql',  // Absolute path from the root
  credentials: 'same-origin',
  fetchOptions: {
    mode: 'cors',
  },
});

const link = from([errorLink, httpLink]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          todos: {
            merge(existing, incoming) {
              return incoming;
            }
          }
        }
      },
      Todo: {
        fields: {
          createdAt: {
            read(value) {
              console.log('createdAt read with value:', value);
              return typeof value === 'string' ? value : String(value || '');
            }
          },
          updatedAt: {
            read(value) {
              console.log('updatedAt read with value:', value);
              return typeof value === 'string' ? value : String(value || '');
            }
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-first',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
  connectToDevTools: true,
});

export default client; 