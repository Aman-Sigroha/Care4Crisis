import React, { useState } from 'react';
import axios from 'axios';

const ApiTestComponent = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showComponent, setShowComponent] = useState(false);

  const apiEndpoints = [
    { name: 'Health Check', url: 'https://care4crisis-api.onrender.com/health', method: 'get' },
    { name: 'API Root', url: 'https://care4crisis-api.onrender.com/', method: 'get' },
    { name: 'Users API', url: 'https://care4crisis-api.onrender.com/api/users', method: 'get' },
    { 
      name: 'Login Endpoint (Correct)', 
      url: 'https://care4crisis-api.onrender.com/api/users/login', 
      method: 'options' 
    },
    { 
      name: 'Register Endpoint (Correct)', 
      url: 'https://care4crisis-api.onrender.com/api/users/register', 
      method: 'options' 
    }
  ];

  const testApi = async () => {
    setLoading(true);
    setResults([]);
    
    const testResults = [];
    
    for (const endpoint of apiEndpoints) {
      try {
        const result = await axios({
          method: endpoint.method,
          url: endpoint.url,
          timeout: 5000
        });
        
        testResults.push({
          name: endpoint.name,
          url: endpoint.url,
          status: result.status,
          success: true,
          data: JSON.stringify(result.data)
        });
      } catch (error) {
        testResults.push({
          name: endpoint.name,
          url: endpoint.url,
          status: error.response?.status || 'Network Error',
          success: false,
          error: error.message
        });
      }
    }
    
    setResults(testResults);
    setLoading(false);
  };

  if (!showComponent) {
    return (
      <button 
        onClick={() => setShowComponent(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          backgroundColor: '#05c3dd',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          padding: '10px 15px',
          cursor: 'pointer'
        }}
      >
        API Diagnostics
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '500px',
      maxHeight: '80vh',
      overflowY: 'auto',
      backgroundColor: '#181c34',
      border: '1px solid #05c3dd',
      borderRadius: '8px',
      boxShadow: '0 0 15px rgba(5, 195, 221, 0.5)',
      zIndex: 1000,
      padding: '15px',
      color: 'white'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, color: '#05c3dd' }}>API Diagnostics</h3>
        <button 
          onClick={() => setShowComponent(false)}
          style={{
            backgroundColor: 'transparent',
            color: '#05c3dd',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      </div>
      
      <button 
        onClick={testApi}
        disabled={loading}
        style={{
          backgroundColor: '#05c3dd',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          padding: '10px 15px',
          marginBottom: '15px',
          width: '100%',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? 'Testing...' : 'Test API Endpoints'}
      </button>
      
      {results.length > 0 && (
        <div>
          <h4 style={{ color: '#05c3dd', marginBottom: '10px' }}>Results:</h4>
          {results.map((result, index) => (
            <div 
              key={index}
              style={{
                backgroundColor: result.success ? 'rgba(0, 128, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                border: `1px solid ${result.success ? 'green' : 'red'}`,
                borderRadius: '5px',
                padding: '10px',
                marginBottom: '10px'
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{result.name}</div>
              <div style={{ fontSize: '12px', marginBottom: '5px' }}>{result.url}</div>
              <div style={{ 
                color: result.success ? 'green' : 'red',
                fontWeight: 'bold'
              }}>
                Status: {result.status} - {result.success ? 'Success' : 'Failed'}
              </div>
              {result.success ? (
                <div style={{ fontSize: '12px', marginTop: '5px', overflowWrap: 'break-word' }}>
                  {result.data}
                </div>
              ) : (
                <div style={{ fontSize: '12px', marginTop: '5px', color: 'red' }}>
                  {result.error}
                </div>
              )}
            </div>
          ))}
          
          <div style={{ marginTop: '15px', fontSize: '13px' }}>
            <p><strong>Recommendations:</strong></p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>If health check fails, the server may be down</li>
              <li>If login endpoint fails, check server routes</li>
              <li>Try using the "Bypass Login" button to access demo mode</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiTestComponent; 