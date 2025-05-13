import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

const ApiStatusChecker = () => {
  const [status, setStatus] = useState('Loading...');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const response = await apiService.checkHealth();
        if (response.status === 200) {
          setStatus('Connected to API');
          setIsConnected(true);
        } else {
          setStatus('Connected but received unexpected response');
          setIsConnected(false);
        }
      } catch (err) {
        setStatus('Failed to connect to API');
        setError(err.message || 'Unknown error');
        setIsConnected(false);
      }
    };

    checkApiConnection();
  }, []);

  return (
    <div className="api-status-checker">
      <h3>API Connection Status</h3>
      <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
        {status}
      </div>
      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default ApiStatusChecker; 