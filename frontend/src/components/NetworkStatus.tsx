import React, { useState, useEffect } from 'react';

const NetworkStatus: React.FC = () => {
  const [status, setStatus] = useState<{
    backendUrl: string;
    backendStatus: 'checking' | 'online' | 'offline';
    error: string | null;
  }>({
    backendUrl: '',
    backendStatus: 'checking',
    error: null,
  });

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;
        const backendUrl = `${protocol}//${hostname}:4000/graphql`;
        
        setStatus(prev => ({ ...prev, backendUrl }));
        
        const response = await fetch(backendUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: '{ __typename }',
          }),
        });
        
        if (response.ok) {
          setStatus(prev => ({ ...prev, backendStatus: 'online', error: null }));
        } else {
          setStatus(prev => ({ 
            ...prev, 
            backendStatus: 'offline', 
            error: `HTTP error: ${response.status} ${response.statusText}` 
          }));
        }
      } catch (error) {
        setStatus(prev => ({ 
          ...prev, 
          backendStatus: 'offline', 
          error: error instanceof Error ? error.message : String(error)
        }));
      }
    };

    checkBackendConnection();
  }, []);

  return (
    <div className="network-status">
      <h3>Network Diagnostics</h3>
      <p>
        <strong>Backend URL:</strong> {status.backendUrl}
      </p>
      <p>
        <strong>Backend Status:</strong>{' '}
        {status.backendStatus === 'checking' ? (
          'Checking...'
        ) : status.backendStatus === 'online' ? (
          <span style={{ color: 'green' }}>Online</span>
        ) : (
          <span style={{ color: 'red' }}>Offline</span>
        )}
      </p>
      {status.error && (
        <div className="error-message">
          <p><strong>Error:</strong></p>
          <pre>{status.error}</pre>
        </div>
      )}
    </div>
  );
};

export default NetworkStatus; 