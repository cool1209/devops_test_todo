import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TODOS } from '../graphql/todoOperations';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import { Todo } from '../types/Todo';

const TodoList: React.FC = () => {
  const { loading, error, data, refetch } = useQuery(GET_TODOS, {
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all'
  });
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [loadingFailed, setLoadingFailed] = useState(false);

  useEffect(() => {
    if (error) {
      setLoadingFailed(true);
      console.error('GraphQL error:', error);
    } else {
      setLoadingFailed(false);
    }
  }, [error]);

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const handleCompleteEdit = () => {
    setEditingTodo(null);
    refetch();
  };

  const handleRetry = () => {
    setLoadingFailed(false);
    refetch();
  };

  if (loading && !loadingFailed) {
    return (
      <div className="loading-container">
        <p>Loading todos...</p>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (loadingFailed) {
    return (
      <div className="error-container">
        <p>Error loading todos: {error?.message || "Unknown error"}</p>
        <button onClick={handleRetry} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  const todos = data?.todos || [];

  return (
    <div className="todo-list">
      <h2>Your Todos ({todos.length})</h2>

      {editingTodo ? (
        <TodoForm existingTodo={editingTodo} onComplete={handleCompleteEdit} />
      ) : (
        <TodoForm onComplete={() => refetch()} />
      )}

      <div className="todos-container">
        {todos.length === 0 ? (
          <p className="no-todos">No todos yet. Add your first one above!</p>
        ) : (
          todos.map((todo: Todo) => (
            <TodoItem key={todo._id} todo={todo} onEdit={handleEditTodo} />
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList; 