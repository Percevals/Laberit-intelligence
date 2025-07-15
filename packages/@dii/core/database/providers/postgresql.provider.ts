/**
 * PostgreSQL Database Provider
 * Implements DatabaseProvider interface for PostgreSQL
 */

import { Pool, PoolClient } from 'pg';
import { 
  DatabaseProvider, 
  DatabaseConfig, 
  QueryResult, 
  DatabaseTransaction 
} from './database-provider.interface';
import { DatabaseError } from '../../errors/database.error';

class PostgreSQLTransaction implements DatabaseTransaction {
  constructor(private client: PoolClient) {}

  async query<T = any>(sql: string, params?: any[]): Promise<QueryResult<T>> {
    try {
      const result = await this.client.query(sql, params);
      return {
        rows: result.rows,
        rowCount: result.rowCount || 0
      };
    } catch (error) {
      throw this.handleError(error, sql);
    }
  }

  async commit(): Promise<void> {
    await this.client.query('COMMIT');
  }

  async rollback(): Promise<void> {
    await this.client.query('ROLLBACK');
  }

  private handleError(error: any, sql: string): DatabaseError {
    const message = error.message || 'Unknown database error';
    return new DatabaseError(
      `Transaction query failed: ${message}`,
      'TRANSACTION_ERROR',
      { sql, originalError: error }
    );
  }
}

export class PostgreSQLProvider implements DatabaseProvider {
  private pool: Pool | null = null;
  private connected = false;

  constructor(private config: DatabaseConfig) {}

  async connect(): Promise<void> {
    if (this.connected) {
      return;
    }

    try {
      this.pool = new Pool({
        host: this.config.host,
        port: this.config.port,
        database: this.config.database,
        user: this.config.username,
        password: this.config.password,
        ssl: this.config.ssl ? { rejectUnauthorized: false } : false,
        max: this.config.maxConnections || 10,
        idleTimeoutMillis: this.config.idleTimeoutMillis || 30000,
        connectionTimeoutMillis: this.config.connectionTimeoutMillis || 2000,
      });

      // Test the connection
      await this.pool.query('SELECT 1');
      this.connected = true;
      
      console.log('✅ PostgreSQL connected successfully');
    } catch (error) {
      this.connected = false;
      throw this.handleConnectionError(error);
    }
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      this.connected = false;
      console.log('📴 PostgreSQL disconnected');
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  async query<T = any>(sql: string, params?: any[]): Promise<QueryResult<T>> {
    this.ensureConnected();

    try {
      const result = await this.pool!.query(sql, params);
      return {
        rows: result.rows,
        rowCount: result.rowCount || 0
      };
    } catch (error) {
      throw this.handleQueryError(error, sql);
    }
  }

  async queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
    const result = await this.query<T>(sql, params);
    return result.rows[0] || null;
  }

  async queryScalar<T = any>(sql: string, params?: any[]): Promise<T | null> {
    const row = await this.queryOne(sql, params);
    if (!row) return null;
    
    const values = Object.values(row);
    return values[0] as T;
  }

  async transaction<T = any>(
    callback: (trx: DatabaseTransaction) => Promise<T>
  ): Promise<T> {
    this.ensureConnected();

    const client = await this.pool!.connect();
    
    try {
      await client.query('BEGIN');
      
      const trx = new PostgreSQLTransaction(client);
      const result = await callback(trx);
      
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      
      if (error instanceof DatabaseError) {
        throw error;
      }
      
      throw new DatabaseError(
        'Transaction failed',
        'TRANSACTION_FAILED',
        { originalError: error }
      );
    } finally {
      client.release();
    }
  }

  getStats() {
    if (!this.pool) {
      return {
        totalConnections: 0,
        idleConnections: 0,
        waitingConnections: 0
      };
    }

    return {
      totalConnections: this.pool.totalCount,
      idleConnections: this.pool.idleCount,
      waitingConnections: this.pool.waitingCount
    };
  }

  private ensureConnected(): void {
    if (!this.connected || !this.pool) {
      throw new DatabaseError(
        'Database is not connected. Call connect() first.',
        'NOT_CONNECTED'
      );
    }
  }

  private handleConnectionError(error: any): DatabaseError {
    const code = error.code;
    let message = 'Failed to connect to database';
    let errorCode = 'CONNECTION_FAILED';

    if (code === 'ECONNREFUSED') {
      message = 'Database connection refused. Is PostgreSQL running?';
      errorCode = 'CONNECTION_REFUSED';
    } else if (code === '28P01') {
      message = 'Authentication failed. Check your database credentials.';
      errorCode = 'AUTH_FAILED';
    } else if (code === '3D000') {
      message = `Database "${this.config.database}" does not exist.`;
      errorCode = 'DATABASE_NOT_FOUND';
    } else if (code === 'ENOTFOUND') {
      message = `Cannot reach database host: ${this.config.host}`;
      errorCode = 'HOST_NOT_FOUND';
    }

    return new DatabaseError(message, errorCode, { 
      originalError: error,
      config: {
        host: this.config.host,
        port: this.config.port,
        database: this.config.database,
        user: this.config.username
      }
    });
  }

  private handleQueryError(error: any, sql: string): DatabaseError {
    const code = error.code;
    let message = error.message || 'Query execution failed';
    let errorCode = 'QUERY_FAILED';

    // PostgreSQL error codes
    if (code === '23505') {
      message = 'Duplicate key violation';
      errorCode = 'DUPLICATE_KEY';
    } else if (code === '23503') {
      message = 'Foreign key constraint violation';
      errorCode = 'FOREIGN_KEY_VIOLATION';
    } else if (code === '23502') {
      message = 'Not null constraint violation';
      errorCode = 'NOT_NULL_VIOLATION';
    } else if (code === '42703') {
      message = 'Column does not exist';
      errorCode = 'COLUMN_NOT_FOUND';
    } else if (code === '42P01') {
      message = 'Table does not exist';
      errorCode = 'TABLE_NOT_FOUND';
    } else if (code === '42601') {
      message = 'SQL syntax error';
      errorCode = 'SYNTAX_ERROR';
    }

    return new DatabaseError(message, errorCode, {
      sql: sql.substring(0, 200), // Truncate long queries
      originalError: error
    });
  }
}