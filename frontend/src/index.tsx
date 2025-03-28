import React from 'react';
import ReactDOM from 'react-dom/client';
// index.css is removed as we're using MUI styling system
import App from './App';
import { ApolloProvider } from '@apollo/client';
import client from './apollo-client';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
