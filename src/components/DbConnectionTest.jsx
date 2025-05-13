import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

const DbConnectionTest = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Testing...');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await apiService.getCampaigns();
        setCampaigns(response.data);
        setConnectionStatus('Database connection successful');
        setLoading(false);
      } catch (err) {
        console.error('Error fetching campaigns:', err);
        setError(err.message || 'Failed to fetch data from database');
        setConnectionStatus('Database connection failed');
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return <div className="db-test-container">Testing database connection...</div>;
  }

  return (
    <div className="db-test-container">
      <h3>Database Connection Test</h3>
      <div className={`connection-status ${error ? 'failed' : 'success'}`}>
        {connectionStatus}
      </div>
      
      {error ? (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      ) : (
        <div className="data-preview">
          <h4>Data Preview (Campaigns)</h4>
          {campaigns.length === 0 ? (
            <p>No campaigns found in database</p>
          ) : (
            <div className="data-grid">
              {campaigns.slice(0, 3).map((campaign, index) => (
                <div key={campaign.id || index} className="data-card">
                  <h5>{campaign.title || 'Untitled Campaign'}</h5>
                  <p>{campaign.description?.substring(0, 100) || 'No description'}...</p>
                </div>
              ))}
              {campaigns.length > 3 && (
                <p className="more-data">+ {campaigns.length - 3} more campaigns</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DbConnectionTest; 