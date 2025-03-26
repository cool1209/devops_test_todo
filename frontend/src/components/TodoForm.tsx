import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_TODO, UPDATE_TODO } from '../graphql/todoOperations';
import { CreateTodoInput, Todo } from '../types/Todo';

interface TodoFormProps {
  existingTodo?: Todo;
  onComplete: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ existingTodo, onComplete }) => {
  const [title, setTitle] = useState(existingTodo?.title || '');
  const [description, setDescription] = useState(existingTodo?.description || '');
  const [completed, setCompleted] = useState(existingTodo?.completed || false);

  const [createTodo, { loading: createLoading }] = useMutation(CREATE_TODO, {
    onCompleted: () => {
      onComplete();
      resetForm();
    },
    refetchQueries: ['GetTodos'],
  });

  const [updateTodo, { loading: updateLoading }] = useMutation(UPDATE_TODO, {
    onCompleted: () => {
      onComplete();
    },
    refetchQueries: ['GetTodos'],
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCompleted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert('Title and description are required');
      return;
    }

    if (existingTodo) {
      updateTodo({
        variables: {
          updateTodoInput: {
            id: existingTodo._id,
            title,
            description,
            completed,
          },
        },
      });
    } else {
      const newTodo: CreateTodoInput = {
        title,
        description,
        completed,
      };

      createTodo({
        variables: {
          createTodoInput: newTodo,
        },
      });
    }
  };

  return (
    <div className="todo-form">
      <h2>{existingTodo ? 'Edit Todo' : 'Add New Todo'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="completed">
            <input
              type="checkbox"
              id="completed"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
            Completed
          </label>
        </div>
        <button type="submit" disabled={createLoading || updateLoading}>
          {existingTodo ? 'Update' : 'Create'}
        </button>
        {existingTodo && (
          <button type="button" onClick={onComplete}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default TodoForm; 