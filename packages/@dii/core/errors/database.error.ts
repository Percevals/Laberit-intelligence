/**
 * Database Error Class
 * Custom error for database-related issues with proper context
 */

export class DatabaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: any
  ) {
    super(message);
    this.name = 'DatabaseError';
    
    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseError);
    }
  }

  /**
   * Get a user-friendly error message
   */
  getUserMessage(): string {
    switch (this.code) {
      case 'CONNECTION_REFUSED':
        return 'Unable to connect to the database. Please try again later.';
      case 'AUTH_FAILED':
        return 'Database authentication failed.';
      case 'DATABASE_NOT_FOUND':
        return 'Database configuration error.';
      case 'DUPLICATE_KEY':
        return 'This record already exists.';
      case 'FOREIGN_KEY_VIOLATION':
        return 'Cannot perform this operation due to related data.';
      case 'NOT_NULL_VIOLATION':
        return 'Required information is missing.';
      case 'QUERY_FAILED':
        return 'Database operation failed. Please try again.';
      default:
        return 'An unexpected database error occurred.';
    }
  }

  /**
   * Log the full error details (for debugging)
   */
  logError(): void {
    console.error(`[DatabaseError] ${this.code}: ${this.message}`);
    if (this.context) {
      console.error('Context:', JSON.stringify(this.context, null, 2));
    }
    if (this.stack) {
      console.error('Stack:', this.stack);
    }
  }

  /**
   * Convert to JSON for API responses
   */
  toJSON() {
    return {
      error: {
        type: 'DatabaseError',
        code: this.code,
        message: this.getUserMessage(),
        // Only include technical details in development
        ...(process.env.NODE_ENV === 'development' && {
          details: {
            message: this.message,
            context: this.context
          }
        })
      }
    };
  }
}