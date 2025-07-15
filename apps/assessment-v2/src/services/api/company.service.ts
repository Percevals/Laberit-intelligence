/**
 * Company API Service
 */

import { apiClient } from './client';
import type { Company } from '@/database/types';

export const companyAPI = {
  async getAll(filters?: {
    search?: string;
    businessModel?: string;
    isProspect?: boolean;
  }): Promise<Company[]> {
    return apiClient.get('/companies', filters);
  },

  async getById(id: string): Promise<Company> {
    return apiClient.get(`/companies/${id}`);
  },

  async create(company: Partial<Company>): Promise<Company> {
    return apiClient.post('/companies', company);
  },

  async update(id: string, updates: Partial<Company>): Promise<Company> {
    return apiClient.put(`/companies/${id}`, updates);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/companies/${id}`);
  },

  async bulkImport(companies: Partial<Company>[]): Promise<{
    success: number;
    companies: Company[];
  }> {
    return apiClient.post('/companies/bulk', { companies });
  },

  async verify(id: string, source: 'ai_search' | 'manual' | 'import' = 'manual'): Promise<Company> {
    return apiClient.post(`/companies/${id}/verify`, { source });
  },

  async getStale(limit = 10): Promise<Company[]> {
    return apiClient.get('/companies/status/stale', { limit });
  },
};