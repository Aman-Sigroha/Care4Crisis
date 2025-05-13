import ApiStatusChecker from './ApiStatusChecker';
import DbConnectionTest from './DbConnectionTest';

const ConnectionTestPage = () => {
  return (
    <div className="connection-test-page">
      <div className="container">
        <h2 className="neon-text">Connection Tests</h2>
        <p className="cyber-text">
          This page tests connectivity between your frontend, the Care4Crisis API, and the database.
        </p>
        
        <div className="test-section">
          <ApiStatusChecker />
        </div>
        
        <div className="test-section">
          <DbConnectionTest />
        </div>
        
        <div className="instructions">
          <h3>Connection Test Instructions</h3>
          <div className="instruction-card">
            <h4>Interpreting Results</h4>
            <ul>
              <li>
                <span className="highlight-success">Green indicators</span> mean the connection is 
                established successfully.
              </li>
              <li>
                <span className="highlight-error">Red indicators</span> mean there&apos;s an issue with the 
                connection.
              </li>
            </ul>
          </div>
          
          <div className="instruction-card">
            <h4>Troubleshooting</h4>
            <ul>
              <li>Check that your server is running at the correct URL</li>
              <li>Verify your database configuration in the server&apos;s .env file</li>
              <li>Check for any CORS issues in the browser console</li>
              <li>Ensure your API endpoints match what the frontend is expecting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionTestPage; 