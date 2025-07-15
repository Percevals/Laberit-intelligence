/**
 * Database Provider Interface
 * Abstracts database operations to support different implementations
 */

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
}

export interface DatabaseTransaction {
  query<T = any>(sql: string, params?: any[]): Promise<QueryResult<T>>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

export interface DatabaseProvider {
  /**
   * Connect to the database
   */
  connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  disconnect(): Promise<void>;

  /**
   * Check if connected
   */
  isConnected(): boolean;

  /**
   * Execute a query
   */
  query<T = any>(sql: string, params?: any[]): Promise<QueryResult<T>>;

  /**
   * Execute a query and return the first row
   */
  queryOne<T = any>(sql: string, params?: any[]): Promise<T | null>;

  /**
   * Execute a query and return a single value
   */
  queryScalar<T = any>(sql: string, params?: any[]): Promise<T | null>;

  /**
   * Start a transaction
   */
  transaction<T = any>(
    callback: (trx: DatabaseTransaction) => Promise<T>
  ): Promise<T>;

  /**
   * Get database statistics
   */
  getStats(): {
    totalConnections: number;
    idleConnections: number;
    waitingConnections: number;
  };
}

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean | {
    rejectUnauthorized?: boolean;
    ca?: string;
    cert?: string;
    key?: string;
  };
  maxConnections?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}