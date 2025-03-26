import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apollo-client';
import TodoList from './components/TodoList';
import NetworkStatus from './components/NetworkStatus';
import './App.css';

const App: React.FC = () => {
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  return (
    <ApolloProvider client={client}>
      <div className="app">
        <header className="app-header">
          <h1>DevOps Todo App</h1>
          <p>A full-stack todo application with NestJS, React, and Docker</p>
          <button 
            className="diagnostic-toggle"
            onClick={() => setShowDiagnostics(!showDiagnostics)}
          >
            {showDiagnostics ? 'Hide Diagnostics' : 'Show Diagnostics'}
          </button>
        </header>
        {showDiagnostics && (
          <div className="diagnostics-panel">
            <NetworkStatus />
          </div>
        )}
        <main className="app-main">
          <TodoList />
        </main>
        <footer className="app-footer">
          <p>
            Built with React, Apollo Client, NestJS, GraphQL, MongoDB, Redis, RabbitMQ, and ELK Stack
          </p>
        </footer>
      </div>
    </ApolloProvider>
  );
};

export default App;
