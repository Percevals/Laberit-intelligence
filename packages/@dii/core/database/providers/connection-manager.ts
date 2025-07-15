/**
 * Database Connection Manager
 * Manages database connections and provides singleton access
 */

import { DatabaseProvider, DatabaseConfig } from './database-provider.interface';
import { PostgreSQLProvider } from './postgresql.provider';
import { DatabaseError } from '../../errors/database.error';

export type DatabaseType = 'postgresql' | 'mysql' | 'sqlite';

export class ConnectionManager {
  private static instance: ConnectionManager;
  private providers: Map<string, DatabaseProvider> = new Map();
  private readonly defaultConnectionName = 'default';

  private constructor() {}

  static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }

  /**
   * Create a connection
   */
  async createConnection(
    config: DatabaseConfig & { type?: DatabaseType },
    name: string = this.defaultConnectionName
  ): Promise<DatabaseProvider> {
    if (this.providers.has(name)) {
      throw new DatabaseError(
        `Connection "${name}" already exists`,
        'CONNECTION_EXISTS'
      );
    }

    const provider = this.createProvider(config.type || 'postgresql', config);
    await provider.connect();
    
    this.providers.set(name, provider);
    return provider;
  }

  /**
   * Get a connection by name
   */
  getConnection(name: string = this.defaultConnectionName): DatabaseProvider {
    const provider = this.providers.get(name);
    
    if (!provider) {
      throw new DatabaseError(
        `Connection "${name}" not found. Did you forget to create it?`,
        'CONNECTION_NOT_FOUND'
      );
    }

    return provider;
  }

  /**
   * Close a connection
   */
  async closeConnection(name: string = this.defaultConnectionName): Promise<void> {
    const provider = this.providers.get(name);
    
    if (provider) {
      await provider.disconnect();
      this.providers.delete(name);
    }
  }

  /**
   * Close all connections
   */
  async closeAll(): Promise<void> {
    const promises = Array.from(this.providers.values()).map(
      provider => provider.disconnect()
    );
    
    await Promise.all(promises);
    this.providers.clear();
  }

  /**
   * Check if a connection exists
   */
  hasConnection(name: string = 'default'): boolean {
    return this.providers.has(name);
  }

  /**
   * Get connection statistics
   */
  getConnectionStats(name: string = 'default') {
    const provider = this.providers.get(name);
    
    if (!provider) {
      return null;
    }

    return {
      name,
      connected: provider.isConnected(),
      stats: provider.getStats()
    };
  }

  /**
   * Get all connection statistics
   */
  getAllConnectionStats() {
    const stats: Record<string, any> = {};
    
    for (const [name, provider] of this.providers) {
      stats[name] = {
        connected: provider.isConnected(),
        stats: provider.getStats()
      };
    }

    return stats;
  }

  private createProvider(type: DatabaseType, config: DatabaseConfig): DatabaseProvider {
    switch (type) {
      case 'postgresql':
        return new PostgreSQLProvider(config);
      
      // Future implementations
      // case 'mysql':
      //   return new MySQLProvider(config);
      // case 'sqlite':
      //   return new SQLiteProvider(config);
      
      default:
        throw new DatabaseError(
          `Unsupported database type: ${type}`,
          'UNSUPPORTED_DATABASE'
        );
    }
  }
}

// Export singleton instance
export const connectionManager = ConnectionManager.getInstance();