import type { BusinessModel } from '@core/types/business-model.types';

/**
 * Maps business model IDs to BusinessModel enum values
 */
export const businessModelMap: Record<string, BusinessModel> = {
  '1': 'SUBSCRIPTION_BASED',
  '2': 'TRANSACTION_BASED',
  '3': 'ASSET_LIGHT',
  '4': 'ASSET_HEAVY',
  '5': 'DATA_DRIVEN',
  '6': 'PLATFORM_ECOSYSTEM',
  '7': 'DIRECT_TO_CONSUMER',
  '8': 'B2B_ENTERPRISE'
};