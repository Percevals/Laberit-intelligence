/**
 * Database Connection Context
 * Provides database connection status to the entire app
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

interface DatabaseConnectionContextValue {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  retryConnection: () => Promise<void>;
}

const DatabaseConnectionContext = createContext<DatabaseConnectionContextValue | undefined>(undefined);

export function DatabaseConnectionProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // Try to get the database service (which will trigger connection)
      const { getDatabaseService } = await import('../database');
      await getDatabaseService();
      setIsConnected(true);
    } catch (err) {
      console.error('Database connection check failed:', err);
      setIsConnected(false);
      setError(err instanceof Error ? err.message : 'Connection failed');
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Check connection status every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const retryConnection = async () => {
    await checkConnection();
  };

  return (
    <DatabaseConnectionContext.Provider 
      value={{ isConnected, isConnecting, error, retryConnection }}
    >
      {children}
    </DatabaseConnectionContext.Provider>
  );
}

export function useDatabaseConnection() {
  const context = useContext(DatabaseConnectionContext);
  
  if (!context) {
    throw new Error('useDatabaseConnection must be used within DatabaseConnectionProvider');
  }
  
  return context;
}