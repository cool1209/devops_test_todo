import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TODOS } from '../graphql/todoOperations';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import { Todo } from '../types/Todo';
import { 
  Typography, 
  Box, 
  Paper, 
  Divider, 
  CircularProgress, 
  Button, 
  Alert
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import RefreshIcon from '@mui/icons-material/Refresh';

interface TodoListProps {
  showSnackbar?: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
}

const TodoList: React.FC<TodoListProps> = ({ showSnackbar }) => {
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
      if (showSnackbar) {
        showSnackbar('Failed to load todos: ' + error.message, 'error');
      }
    } else {
      setLoadingFailed(false);
    }
  }, [error, showSnackbar]);

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    if (showSnackbar) {
      showSnackbar('Editing todo: ' + todo.title, 'info');
    }
  };

  const handleCompleteEdit = () => {
    setEditingTodo(null);
    refetch();
  };

  const handleRetry = () => {
    setLoadingFailed(false);
    refetch();
    if (showSnackbar) {
      showSnackbar('Retrying to load todos...', 'info');
    }
  };

  if (loading && !loadingFailed) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        my: 4
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading todos...
        </Typography>
      </Box>
    );
  }

  if (loadingFailed) {
    return (
      <Box sx={{ my: 4 }}>
        <Alert 
          severity="error" 
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={handleRetry}
              startIcon={<RefreshIcon />}
            >
              Retry
            </Button>
          }
          sx={{ mb: 2 }}
        >
          Error loading todos: {error?.message || "Unknown error"}
        </Alert>
      </Box>
    );
  }

  const todos = data?.todos || [];
  
  // Group todos by completion status
  const completedTodos = todos.filter((todo: Todo) => todo.completed);
  const activeTodos = todos.filter((todo: Todo) => !todo.completed);

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Your Tasks
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {activeTodos.length} active • {completedTodos.length} completed
          </Typography>
        </Box>
      </motion.div>

      <AnimatePresence mode="wait">
        {editingTodo ? (
          <motion.div
            key="edit-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Edit Task
              </Typography>
              <TodoForm existingTodo={editingTodo} onComplete={handleCompleteEdit} showSnackbar={showSnackbar} />
            </Paper>
          </motion.div>
        ) : (
          <motion.div
            key="add-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Add New Task
              </Typography>
              <TodoForm onComplete={() => refetch()} showSnackbar={showSnackbar} />
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      <Box sx={{ mb: 6 }}>
        {activeTodos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Active Tasks
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {activeTodos.map((todo: Todo) => (
                <Box key={todo._id}>
                  <TodoItem todo={todo} onEdit={handleEditTodo} showSnackbar={showSnackbar} />
                </Box>
              ))}
            </Box>
          </motion.div>
        )}

        {completedTodos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Completed Tasks
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {completedTodos.map((todo: Todo) => (
                <Box key={todo._id}>
                  <TodoItem todo={todo} onEdit={handleEditTodo} showSnackbar={showSnackbar} />
                </Box>
              ))}
            </Box>
          </motion.div>
        )}

        {todos.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8, 
                px: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px dashed',
                borderColor: 'divider'
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No tasks yet
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Add your first task using the form above!
              </Typography>
            </Box>
          </motion.div>
        )}
      </Box>
    </Box>
  );
};

export default TodoList; 