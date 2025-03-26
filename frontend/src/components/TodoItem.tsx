import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { DELETE_TODO, UPDATE_TODO } from '../graphql/todoOperations';
import { Todo } from '../types/Todo';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  IconButton, 
  Checkbox, 
  Chip, 
  Divider,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { motion } from 'framer-motion';
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import CelebrationEffect from './CelebrationEffect';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  showSnackbar?: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit, showSnackbar }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const [deleteTodo] = useMutation(DELETE_TODO, {
    variables: { id: todo._id },
    refetchQueries: ['GetTodos'],
    onCompleted: () => {
      if (showSnackbar) {
        showSnackbar(`Task "${todo.title}" deleted successfully`, 'success');
      }
    },
    onError: (error) => {
      if (showSnackbar) {
        showSnackbar(`Error deleting task: ${error.message}`, 'error');
      }
    }
  });

  const [updateTodo] = useMutation(UPDATE_TODO, {
    onCompleted: (data) => {
      if (showSnackbar) {
        showSnackbar(
          `Task "${data.updateTodo.title}" marked as ${data.updateTodo.completed ? 'completed' : 'active'}`, 
          'success'
        );
      }
      
      // Show celebration effect when todo is marked as completed
      if (data.updateTodo.completed) {
        setShowCelebration(true);
      }
    },
    onError: (error) => {
      if (showSnackbar) {
        showSnackbar(`Error updating task: ${error.message}`, 'error');
      }
    }
  });

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
    setDeleteDialogOpen(false);
    deleteTodo();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };
  
  const getTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  // Calculate if the todo is recent (less than 24 hours old)
  const isRecent = () => {
    const created = new Date(todo.createdAt);
    const now = new Date();
    const diff = now.getTime() - created.getTime();
    return diff < 24 * 60 * 60 * 1000; // 24 hours in ms
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.01 }}
      >
        <Card 
          variant="outlined" 
          sx={{ 
            borderRadius: 2,
            borderLeft: 4,
            borderLeftColor: todo.completed ? 'success.main' : 'primary.main',
            bgcolor: todo.completed ? 'rgba(0, 200, 83, 0.04)' : 'background.paper',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexGrow: 1 }}>
                <Checkbox 
                  checked={todo.completed}
                  onChange={handleToggleComplete}
                  color="primary"
                  sx={{ p: 0.5 }}
                />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? 'text.secondary' : 'text.primary',
                  }}
                >
                  {todo.title}
                </Typography>
                {isRecent() && (
                  <Chip 
                    label="New" 
                    color="secondary" 
                    size="small"
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                )}
              </Box>
            </Box>

            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 2, 
                mt: 1, 
                opacity: todo.completed ? 0.7 : 1,
                textDecoration: todo.completed ? 'line-through' : 'none',
              }}
            >
              {todo.description}
            </Typography>

            <Divider sx={{ my: 1 }} />
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mt: 1,
              fontSize: '0.75rem',
              color: 'text.secondary'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <EventNoteIcon fontSize="small" sx={{ opacity: 0.6, fontSize: '1rem' }} />
                <Typography variant="caption">
                  Created: {formatDate(todo.createdAt)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTimeIcon fontSize="small" sx={{ opacity: 0.6, fontSize: '1rem' }} />
                <Typography variant="caption">
                  Updated: {formatDate(todo.updatedAt)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
          
          <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
            <IconButton 
              size="small" 
              onClick={() => onEdit(todo)} 
              color="primary"
              aria-label="edit task"
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={() => setDeleteDialogOpen(true)} 
              color="error"
              aria-label="delete task"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </CardActions>
        </Card>
      </motion.div>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete "{todo.title}"?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this task? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {showCelebration && (
        <CelebrationEffect
          message={`Great job! "${todo.title}" completed!`}
          onComplete={() => setShowCelebration(false)}
        />
      )}
    </>
  );
};

export default TodoItem; 