import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_TODO, UPDATE_TODO } from '../graphql/todoOperations';
import { CreateTodoInput, Todo } from '../types/Todo';
import { 
  TextField, 
  Button, 
  FormControlLabel, 
  Checkbox, 
  Box, 
  Stack,
  FormHelperText,
  Alert,
  Collapse,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface TodoFormProps {
  existingTodo?: Todo;
  onComplete: () => void;
  showSnackbar?: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ existingTodo, onComplete, showSnackbar }) => {
  const [title, setTitle] = useState(existingTodo?.title || '');
  const [description, setDescription] = useState(existingTodo?.description || '');
  const [completed, setCompleted] = useState(existingTodo?.completed || false);
  const [errors, setErrors] = useState<{title?: string; description?: string}>({});
  const [formAlert, setFormAlert] = useState<{message: string; severity: 'success' | 'error' | 'info' | 'warning'} | null>(null);

  const [createTodo, { loading: createLoading }] = useMutation(CREATE_TODO, {
    onCompleted: (data) => {
      if (showSnackbar) {
        showSnackbar(`Task "${data.createTodo.title}" created successfully`, 'success');
      } else {
        setFormAlert({
          message: `Task "${data.createTodo.title}" created successfully`,
          severity: 'success'
        });
        setTimeout(() => setFormAlert(null), 3000);
      }
      onComplete();
      resetForm();
    },
    onError: (error) => {
      if (showSnackbar) {
        showSnackbar(`Error creating task: ${error.message}`, 'error');
      } else {
        setFormAlert({
          message: `Error creating task: ${error.message}`,
          severity: 'error'
        });
      }
    },
    refetchQueries: ['GetTodos'],
  });

  const [updateTodo, { loading: updateLoading }] = useMutation(UPDATE_TODO, {
    onCompleted: (data) => {
      if (showSnackbar) {
        showSnackbar(`Task "${data.updateTodo.title}" updated successfully`, 'success');
      } else {
        setFormAlert({
          message: `Task "${data.updateTodo.title}" updated successfully`,
          severity: 'success'
        });
        setTimeout(() => setFormAlert(null), 3000);
      }
      onComplete();
    },
    onError: (error) => {
      if (showSnackbar) {
        showSnackbar(`Error updating task: ${error.message}`, 'error');
      } else {
        setFormAlert({
          message: `Error updating task: ${error.message}`,
          severity: 'error'
        });
      }
    },
    refetchQueries: ['GetTodos'],
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCompleted(false);
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: {title?: string; description?: string} = {};
    let valid = true;

    if (!title.trim()) {
      newErrors.title = 'Title is required';
      valid = false;
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
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
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Collapse in={!!formAlert}>
        <Alert 
          severity={formAlert?.severity || 'info'}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setFormAlert(null)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {formAlert?.message}
        </Alert>
      </Collapse>

      <Stack spacing={3}>
        <Box>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            error={!!errors.title}
            helperText={errors.title}
            autoFocus
            placeholder="What needs to be done?"
            sx={{ mb: 2 }}
          />
          
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            error={!!errors.description}
            helperText={errors.description}
            placeholder="Add more details about this task..."
          />
        </Box>
        
        <FormControlLabel
          control={
            <Checkbox 
              checked={completed} 
              onChange={(e) => setCompleted(e.target.checked)}
              color="primary"
            />
          }
          label="Mark as completed"
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          {existingTodo && (
            <Button
              variant="outlined"
              onClick={onComplete}
              startIcon={<CancelIcon />}
              disabled={createLoading || updateLoading}
            >
              Cancel
            </Button>
          )}
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={createLoading || updateLoading}
            startIcon={existingTodo ? <SaveIcon /> : <AddIcon />}
          >
            {existingTodo ? 'Update Task' : 'Add Task'}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default TodoForm; 