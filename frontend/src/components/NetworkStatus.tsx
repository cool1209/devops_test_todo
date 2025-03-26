import React, { useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  LinearProgress, 
  Stack, 
  Alert,
  Button
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';

interface NetworkStatusProps {
  showSnackbar?: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({ showSnackbar }) => {
  const client = useApolloClient();
  const [status, setStatus] = useState<'connected' | 'error' | 'checking'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const checkConnection = async () => {
    setStatus('checking');
    
    try {
      // Simplified query approach to fix type errors
      await client.query({
        query: require('../graphql/todoOperations').GET_TODOS,
        fetchPolicy: 'network-only'
      });
      
      setStatus('connected');
      setErrorDetails(null);
      
      if (showSnackbar) {
        showSnackbar('Successfully connected to the GraphQL server', 'success');
      }
      
    } catch (error) {
      setStatus('error');
      setErrorDetails(error instanceof Error ? error.message : 'Unknown error');
      
      if (showSnackbar) {
        showSnackbar('Failed to connect to the GraphQL server', 'error');
      }
    }
    
    setLastChecked(new Date());
  };

  useEffect(() => {
    checkConnection();
    
    // Check connection status every 60 seconds
    const interval = setInterval(checkConnection, 60000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, width: '100%' }}>
        <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: '300px' }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                GraphQL Server Status
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Chip 
                  icon={
                    status === 'connected' ? <CheckCircleOutlineIcon /> : 
                    status === 'error' ? <ErrorOutlineIcon /> : 
                    <HourglassTopIcon />
                  } 
                  label={
                    status === 'connected' ? 'Connected' : 
                    status === 'error' ? 'Error' : 
                    'Checking...'
                  }
                  color={
                    status === 'connected' ? 'success' : 
                    status === 'error' ? 'error' : 
                    'default'
                  }
                  variant="filled"
                />
                {status === 'checking' && (
                  <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                  </Box>
                )}
              </Stack>
              
              {lastChecked && (
                <Typography variant="body2" color="text.secondary">
                  Last checked: {lastChecked.toLocaleString()}
                </Typography>
              )}
              
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="contained"
                  color="primary"
                  onClick={checkConnection}
                >
                  Check Connection
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: '300px' }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Client Status
              </Typography>
              <Typography variant="body2">
                Cache initialized: <b>{client.cache.extract() ? 'Yes' : 'No'}</b>
              </Typography>
              <Typography variant="body2">
                Apollo client initialized: <b>Yes</b>
              </Typography>
              <Typography variant="body2">
                Dev mode: <b>{process.env.NODE_ENV === 'development' ? 'Yes' : 'No'}</b>
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {status === 'error' && errorDetails && (
        <Box sx={{ mt: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Connection error occurred
          </Alert>
          <Card variant="outlined" sx={{ bgcolor: '#fafafa' }}>
            <CardContent>
              <Typography variant="body2" component="pre" sx={{ 
                whiteSpace: 'pre-wrap',
                overflowWrap: 'break-word',
                fontSize: '0.875rem'
              }}>
                {errorDetails}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default NetworkStatus; 