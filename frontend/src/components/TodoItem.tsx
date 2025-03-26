import React from 'react';
import { useMutation } from '@apollo/client';
import { DELETE_TODO, UPDATE_TODO } from '../graphql/todoOperations';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit }) => {
  const [deleteTodo] = useMutation(DELETE_TODO, {
    variables: { id: todo._id },
    refetchQueries: ['GetTodos'],
  });

  const [updateTodo] = useMutation(UPDATE_TODO);

  const handleToggleComplete = () => {
    updateTodo({
      variables: {
        updateTodoInput: {
          id: todo._id,
          completed: !todo.completed,
        },
      },
      refetchQueries: ['GetTodos'],
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      deleteTodo();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-header">
        <h3>{todo.title}</h3>
        <div className="todo-actions">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggleComplete}
            title={todo.completed ? 'Mark as incomplete' : 'Mark as completed'}
          />
          <button onClick={() => onEdit(todo)} className="edit-btn">
            Edit
          </button>
          <button onClick={handleDelete} className="delete-btn">
            Delete
          </button>
        </div>
      </div>
      <p className="todo-description">{todo.description}</p>
      <div className="todo-dates">
        <span className="created-date">Created: {formatDate(todo.createdAt)}</span>
        <span className="updated-date">Updated: {formatDate(todo.updatedAt)}</span>
      </div>
    </div>
  );
};

export default TodoItem; 