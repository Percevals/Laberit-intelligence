/**
 * Base Repository
 * Abstract base class for all repositories
 */

import { DatabaseProvider } from '../database/providers/database-provider.interface';
import { connectionManager } from '../database/providers/connection-manager';
import { DatabaseError } from '../errors/database.error';

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

export interface FindOptions extends QueryOptions {
  select?: string[];
  where?: Record<string, any>;
}

export abstract class BaseRepository<T> {
  protected abstract tableName: string;
  protected abstract primaryKey: string;
  
  constructor(
    protected db: DatabaseProvider = connectionManager.getConnection()
  ) {}

  /**
   * Find a record by ID
   */
  async findById(id: string | number): Promise<T | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = $1`;
    
    try {
      return await this.db.queryOne<T>(sql, [id]);
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      
      throw new DatabaseError(
        `Failed to find ${this.tableName} by ID`,
        'FIND_BY_ID_FAILED',
        { id, error }
      );
    }
  }

  /**
   * Find all records
   */
  async findAll(options?: QueryOptions): Promise<T[]> {
    let sql = `SELECT * FROM ${this.tableName}`;
    const params: any[] = [];
    
    // Add ORDER BY
    if (options?.orderBy) {
      sql += ` ORDER BY ${options.orderBy}`;
      if (options.orderDirection) {
        sql += ` ${options.orderDirection}`;
      }
    }

    // Add LIMIT
    if (options?.limit) {
      params.push(options.limit);
      sql += ` LIMIT $${params.length}`;
    }

    // Add OFFSET
    if (options?.offset) {
      params.push(options.offset);
      sql += ` OFFSET $${params.length}`;
    }

    try {
      const result = await this.db.query<T>(sql, params);
      return result.rows;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      
      throw new DatabaseError(
        `Failed to find all ${this.tableName}`,
        'FIND_ALL_FAILED',
        { options, error }
      );
    }
  }

  /**
   * Find records by criteria
   */
  async find(options: FindOptions): Promise<T[]> {
    const { select, where, ...queryOptions } = options;
    
    // Build SELECT clause
    const fields = select && select.length > 0 ? select.join(', ') : '*';
    let sql = `SELECT ${fields} FROM ${this.tableName}`;
    const params: any[] = [];

    // Build WHERE clause
    if (where && Object.keys(where).length > 0) {
      const conditions: string[] = [];
      
      for (const [key, value] of Object.entries(where)) {
        if (value === null) {
          conditions.push(`${key} IS NULL`);
        } else if (Array.isArray(value)) {
          // IN clause
          const placeholders = value.map((_, i) => `$${params.length + i + 1}`).join(', ');
          conditions.push(`${key} IN (${placeholders})`);
          params.push(...value);
        } else {
          params.push(value);
          conditions.push(`${key} = $${params.length}`);
        }
      }

      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    // Add ORDER BY
    if (queryOptions.orderBy) {
      sql += ` ORDER BY ${queryOptions.orderBy}`;
      if (queryOptions.orderDirection) {
        sql += ` ${queryOptions.orderDirection}`;
      }
    }

    // Add LIMIT
    if (queryOptions.limit) {
      params.push(queryOptions.limit);
      sql += ` LIMIT $${params.length}`;
    }

    // Add OFFSET
    if (queryOptions.offset) {
      params.push(queryOptions.offset);
      sql += ` OFFSET $${params.length}`;
    }

    try {
      const result = await this.db.query<T>(sql, params);
      return result.rows;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      
      throw new DatabaseError(
        `Failed to find ${this.tableName}`,
        'FIND_FAILED',
        { options, error }
      );
    }
  }

  /**
   * Count records
   */
  async count(where?: Record<string, any>): Promise<number> {
    let sql = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    const params: any[] = [];

    // Build WHERE clause
    if (where && Object.keys(where).length > 0) {
      const conditions: string[] = [];
      
      for (const [key, value] of Object.entries(where)) {
        if (value === null) {
          conditions.push(`${key} IS NULL`);
        } else {
          params.push(value);
          conditions.push(`${key} = $${params.length}`);
        }
      }

      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    try {
      const result = await this.db.queryScalar<number>(sql, params);
      return result || 0;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      
      throw new DatabaseError(
        `Failed to count ${this.tableName}`,
        'COUNT_FAILED',
        { where, error }
      );
    }
  }

  /**
   * Check if record exists
   */
  async exists(id: string | number): Promise<boolean> {
    const sql = `SELECT 1 FROM ${this.tableName} WHERE ${this.primaryKey} = $1 LIMIT 1`;
    
    try {
      const result = await this.db.queryOne(sql, [id]);
      return result !== null;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      
      throw new DatabaseError(
        `Failed to check existence in ${this.tableName}`,
        'EXISTS_CHECK_FAILED',
        { id, error }
      );
    }
  }

  /**
   * Create a new record
   */
  async create(data: Partial<T>): Promise<T> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');

    const sql = `
      INSERT INTO ${this.tableName} (${fields.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;

    try {
      const result = await this.db.queryOne<T>(sql, values);
      
      if (!result) {
        throw new DatabaseError(
          'Insert did not return a record',
          'INSERT_NO_RETURN'
        );
      }

      return result;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      
      throw new DatabaseError(
        `Failed to create ${this.tableName}`,
        'CREATE_FAILED',
        { data, error }
      );
    }
  }

  /**
   * Update a record
   */
  async update(id: string | number, data: Partial<T>): Promise<T | null> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    
    if (fields.length === 0) {
      return this.findById(id);
    }

    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    values.push(id);

    const sql = `
      UPDATE ${this.tableName}
      SET ${setClause}
      WHERE ${this.primaryKey} = $${values.length}
      RETURNING *
    `;

    try {
      return await this.db.queryOne<T>(sql, values);
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      
      throw new DatabaseError(
        `Failed to update ${this.tableName}`,
        'UPDATE_FAILED',
        { id, data, error }
      );
    }
  }

  /**
   * Delete a record
   */
  async delete(id: string | number): Promise<boolean> {
    const sql = `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = $1`;

    try {
      const result = await this.db.query(sql, [id]);
      return result.rowCount > 0;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      
      throw new DatabaseError(
        `Failed to delete from ${this.tableName}`,
        'DELETE_FAILED',
        { id, error }
      );
    }
  }

  /**
   * Execute a raw query
   */
  protected async query<R = T>(sql: string, params?: any[]): Promise<R[]> {
    try {
      const result = await this.db.query<R>(sql, params);
      return result.rows;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      
      throw new DatabaseError(
        'Query execution failed',
        'QUERY_FAILED',
        { sql: sql.substring(0, 200), error }
      );
    }
  }

  /**
   * Execute a query in a transaction
   */
  protected async transaction<R>(
    callback: (trx: any) => Promise<R>
  ): Promise<R> {
    return this.db.transaction(callback);
  }
}