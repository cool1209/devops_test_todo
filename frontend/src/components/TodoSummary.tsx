import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_TODOS } from '../graphql/todoOperations';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Divider, 
  CircularProgress,
  LinearProgress,
  Button,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import { format } from 'date-fns';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { motion } from 'framer-motion';
import { Todo } from '../types/Todo';

interface TodoSummaryProps {
  limit?: number;
  showCompleted?: boolean;
}

const TodoSummary: React.FC<TodoSummaryProps> = ({ 
  limit = 5,
  showCompleted = false
}) => {
  const { loading, error, data } = useQuery(GET_TODOS);

  if (loading) {
    return (
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {showCompleted ? 'Completed Tasks' : 'Active Tasks'}
        </Typography>
        <CircularProgress size={24} sx={{ mt: 2 }} />
      </Paper>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading tasks: {error.message}
      </Alert>
    );
  }

  const todos = data?.todos || [];
  const filteredTodos = todos
    .filter((todo: Todo) => todo.completed === showCompleted)
    .slice(0, limit);
  
  const totalCount = todos.length;
  const completedCount = todos.filter((todo: Todo) => todo.completed).length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {showCompleted ? 'Completed Tasks' : 'Active Tasks'}
        </Typography>
        
        {!showCompleted && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Completion Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {completionRate}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={completionRate} 
              color="success" 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        )}
        
        {filteredTodos.length > 0 ? (
          <List sx={{ py: 0 }}>
            {filteredTodos.map((todo: Todo, index: number) => (
              <motion.div
                key={todo._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ListItem 
                  disablePadding 
                  sx={{ 
                    py: 1,
                    borderBottom: index < filteredTodos.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider'
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {showCompleted ? (
                      <CheckCircleIcon color="success" fontSize="small" />
                    ) : (
                      <RadioButtonUncheckedIcon color="action" fontSize="small" />
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary={todo.title}
                    primaryTypographyProps={{
                      variant: 'body2',
                      fontWeight: 500,
                      sx: { 
                        textDecoration: showCompleted ? 'line-through' : 'none',
                        color: showCompleted ? 'text.secondary' : 'text.primary' 
                      }
                    }}
                    secondary={todo.createdAt ? format(new Date(todo.createdAt), 'MMM d, yyyy') : ''}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              </motion.div>
            ))}
          </List>
        ) : (
          <Box sx={{ py: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {showCompleted 
                ? "You haven't completed any tasks yet" 
                : "No active tasks - you're all caught up!"
              }
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TodoSummary; 