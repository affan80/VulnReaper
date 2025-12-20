'use client';

import { useState, useEffect } from 'react';
import { checkBackendHealth } from '../lib/connectionChecker';

export default function ConnectionStatus() {
  const [connectionStatus, setConnectionStatus] = useState({
    isHealthy: true,
    message: 'Connected'
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const checkConnection = async () => {
      try {
        const health = await checkBackendHealth();
        if (!isMounted) return;
        
        setConnectionStatus(health);
        
        // Show warning only if connection is unhealthy
        if (!health.isHealthy) {
          setIsVisible(true);
        }
      } catch (error) {
        console.error('Connection check failed:', error);
        if (!isMounted) return;
        
        setConnectionStatus({
          isHealthy: false,
          message: 'Connection error - Unable to connect to backend server'
        });
        setIsVisible(true);
      }
    };

    // Check connection immediately
    checkConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-xs ${
      connectionStatus.isHealthy 
        ? 'bg-green-100 border border-green-200 text-green-800' 
        : 'bg-red-100 border border-red-200 text-red-800'
    }`}>
      <div className="flex items-start">
        <div className="flex-1">
          <p className="font-medium">
            {connectionStatus.isHealthy ? 'Connected' : 'Connection Issue'}
          </p>
          <p className="text-sm mt-1">
            {connectionStatus.message}
          </p>
          {!connectionStatus.isHealthy && (
            <div className="mt-2 text-xs">
              <p className="font-medium">Troubleshooting steps:</p>
              <ol className="list-decimal list-inside mt-1 space-y-1">
                <li>Make sure the backend server is running (port 5002)</li>
                <li>Verify MongoDB is accessible</li>
                <li>Check that environment variables are configured correctly</li>
                <li>Ensure no firewall is blocking the connection</li>
              </ol>
              <p className="mt-2 italic">Tip: Run `npm run dev` from the root directory to start both servers simultaneously.</p>
            </div>
          )}
        </div>
        {!connectionStatus.isHealthy && (
          <button 
            onClick={handleClose}
            className="ml-2 text-red-600 hover:text-red-800"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}