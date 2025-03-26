import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { 
  ThemeProvider, 
  CssBaseline, 
  Container, 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton,
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Paper, 
  Snackbar, 
  Alert 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CheckIcon from '@mui/icons-material/Check';
import BarChartIcon from '@mui/icons-material/BarChart';
import BugReportIcon from '@mui/icons-material/BugReport';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { motion, AnimatePresence } from 'framer-motion';
import client from './apollo-client';
import TodoList from './components/TodoList';
import DashboardView from './components/DashboardView';
import NetworkStatus from './components/NetworkStatus';
import { createAppTheme } from './theme';
import './App.css';

const App: React.FC = () => {
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'todos' | 'stats'>('todos');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const theme = createAppTheme(darkMode);

  const handleViewChange = (view: 'dashboard' | 'todos' | 'stats') => {
    setCurrentView(view);
    setDrawerOpen(false);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView showSnackbar={showSnackbar} />;
      case 'stats':
        return (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="h4">Statistics</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              Advanced statistics view coming soon...
            </Typography>
          </Box>
        );
      case 'todos':
      default:
        return <TodoList showSnackbar={showSnackbar} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ApolloProvider client={client}>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppBar position="static" color="primary" elevation={0}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setDrawerOpen(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                DevOps Todo App
              </Typography>
              <IconButton 
                color="inherit" 
                onClick={() => setDarkMode(!darkMode)}
                aria-label="toggle dark mode"
              >
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              <IconButton
                color="inherit"
                onClick={() => setShowDiagnostics(!showDiagnostics)}
                aria-label="toggle diagnostics"
              >
                <BugReportIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            <Box
              sx={{ width: 250 }}
              role="presentation"
            >
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" component="div">
                  DevOps Todo
                </Typography>
              </Box>
              <Divider />
              <List>
                <ListItem disablePadding>
                  <ListItemButton 
                    selected={currentView === 'dashboard'}
                    onClick={() => handleViewChange('dashboard')}
                  >
                    <ListItemIcon>
                      <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton 
                    selected={currentView === 'todos'}
                    onClick={() => handleViewChange('todos')}
                  >
                    <ListItemIcon>
                      <CheckIcon />
                    </ListItemIcon>
                    <ListItemText primary="Todo List" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={currentView === 'stats'}
                    onClick={() => handleViewChange('stats')}
                  >
                    <ListItemIcon>
                      <BarChartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Statistics" />
                  </ListItemButton>
                </ListItem>
              </List>
              <Divider />
              <List>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => setShowDiagnostics(!showDiagnostics)}>
                    <ListItemIcon>
                      <BugReportIcon />
                    </ListItemIcon>
                    <ListItemText primary="Diagnostics" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          </Drawer>

          <AnimatePresence>
            {showDiagnostics && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Paper sx={{ m: 2, p: 2 }} elevation={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">System Diagnostics</Typography>
                    <IconButton size="small" onClick={() => setShowDiagnostics(false)}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                  <NetworkStatus showSnackbar={showSnackbar} />
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>

          <Container maxWidth="md" sx={{ flexGrow: 1, py: 4 }}>
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {renderCurrentView()}
            </motion.div>
          </Container>

          <Paper component="footer" sx={{ py: 3, px: 2, mt: 'auto' }} elevation={0}>
            <Container maxWidth="md">
              <Typography variant="body2" color="text.secondary" align="center">
                Built with React, Apollo Client, NestJS, GraphQL, MongoDB, Redis, RabbitMQ, and ELK Stack
              </Typography>
            </Container>
          </Paper>
        </Box>
      </ApolloProvider>
      
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }} 
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default App;
