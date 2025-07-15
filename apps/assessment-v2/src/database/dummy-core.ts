/**
 * Dummy @dii/core module for browser builds
 * This prevents Node.js modules from being bundled
 */

export class CompanyRepository {
  constructor() {
    throw new Error('@dii/core cannot be used in browser builds');
  }
}

export class AssessmentRepository {
  constructor() {
    throw new Error('@dii/core cannot be used in browser builds');
  }
}

export async function initializeDatabase() {
  throw new Error('@dii/core cannot be used in browser builds');
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const connectionManager = {
  createConnection: () => {
    throw new Error('@dii/core cannot be used in browser builds');
  }
};