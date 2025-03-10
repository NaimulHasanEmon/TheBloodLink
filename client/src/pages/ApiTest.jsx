import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApiTest = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('API URL:', apiUrl);
        const response = await axios.get(`${apiUrl}/donors`);
        console.log('API Response:', response.data);
        setData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('API Error:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API Test</h1>
      <div className="mb-4">
        <p className="font-semibold">API URL:</p>
        <code className="bg-gray-100 p-2 block">{apiUrl}</code>
      </div>
      
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="bg-red-100 p-4 rounded">
          <h2 className="text-xl font-bold text-red-700">Error</h2>
          <p>{error.message}</p>
          {error.response && (
            <div>
              <p>Status: {error.response.status}</p>
              <pre className="bg-gray-100 p-2 mt-2 overflow-auto">
                {JSON.stringify(error.response.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-2">Data Received:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiTest; 