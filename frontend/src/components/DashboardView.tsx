import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_TODOS } from '../graphql/todoOperations';
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  Divider,
  CircularProgress,
  Button,
  Alert,
  Stack,
  Chip
} from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { motion } from 'framer-motion';
import { Todo } from '../types/Todo';
import TodoSummary from './TodoSummary';

interface DashboardProps {
  showSnackbar?: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
}

const DashboardView: React.FC<DashboardProps> = ({ showSnackbar }) => {
  const { loading, error, data, refetch } = useQuery(GET_TODOS);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        action={
          <Button color="inherit" size="small" onClick={() => refetch()}>
            Retry
          </Button>
        }
      >
        Error loading dashboard: {error.message}
      </Alert>
    );
  }

  const todos = data?.todos || [];
  const activeTodos = todos.filter((todo: Todo) => !todo.completed);
  const completedTodos = todos.filter((todo: Todo) => todo.completed);
  const completionRate = todos.length > 0 
    ? Math.round((completedTodos.length / todos.length) * 100) 
    : 0;

  // Animation variants for stats cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.5 }
    })
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ mb: 4 }}
        >
          Dashboard
        </Typography>
      </motion.div>

      {/* Stats Cards */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3, 
          width: '100%' 
        }}>
          {/* Total Tasks Card */}
          <Box sx={{ flex: '1 1 calc(25% - 24px)', minWidth: '200px' }}>
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Paper 
                elevation={0} 
                variant="outlined"
                sx={{ 
                  p: 2, 
                  height: '100%',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  borderColor: 'primary.main',
                  borderWidth: 2
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TaskAltIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" color="primary">
                    Total Tasks
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {todos.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {activeTodos.length} active, {completedTodos.length} completed
                </Typography>
              </Paper>
            </motion.div>
          </Box>
          
          {/* Completion Rate Card */}
          <Box sx={{ flex: '1 1 calc(25% - 24px)', minWidth: '200px' }}>
            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Paper 
                elevation={0} 
                variant="outlined"
                sx={{ 
                  p: 2, 
                  height: '100%',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  borderColor: 'success.main',
                  borderWidth: 2
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6" color="success.main">
                    Completion Rate
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {completionRate}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {completedTodos.length} of {todos.length} tasks completed
                </Typography>
              </Paper>
            </motion.div>
          </Box>
          
          {/* Pending Tasks Card */}
          <Box sx={{ flex: '1 1 calc(25% - 24px)', minWidth: '200px' }}>
            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Paper 
                elevation={0} 
                variant="outlined"
                sx={{ 
                  p: 2, 
                  height: '100%',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  borderColor: 'warning.main',
                  borderWidth: 2
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccessTimeIcon color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6" color="warning.main">
                    Pending Tasks
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {activeTodos.length}
                </Typography>
                <Chip 
                  label={activeTodos.length === 0 ? "All caught up!" : "Waiting to be done"} 
                  size="small" 
                  color={activeTodos.length === 0 ? "success" : "warning"}
                  sx={{ alignSelf: 'flex-start' }}
                />
              </Paper>
            </motion.div>
          </Box>
          
          {/* Productivity Card */}
          <Box sx={{ flex: '1 1 calc(25% - 24px)', minWidth: '200px' }}>
            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Paper 
                elevation={0} 
                variant="outlined"
                sx={{ 
                  p: 2, 
                  height: '100%',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  borderColor: 'info.main',
                  borderWidth: 2
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUpIcon color="info" sx={{ mr: 1 }} />
                  <Typography variant="h6" color="info.main">
                    Productivity
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {todos.length > 0 ? 'Good' : 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Based on task completion rate
                </Typography>
              </Paper>
            </motion.div>
          </Box>
        </Box>
      </Box>
      
      {/* Summary section */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3,
        width: '100%' 
      }}>
        <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: '300px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <TodoSummary limit={5} showCompleted={false} />
          </motion.div>
        </Box>
        
        <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: '300px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <TodoSummary limit={5} showCompleted={true} />
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardView; 