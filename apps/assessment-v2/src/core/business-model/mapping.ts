import type { BusinessModel } from '@core/types/business-model.types';

/**
 * Maps business model IDs to BusinessModel enum values
 */
export const businessModelMap: Record<string, BusinessModel> = {
  '1': 'COMERCIO_HIBRIDO',
  '2': 'SOFTWARE_CRITICO',
  '3': 'SERVICIOS_DATOS',
  '4': 'ECOSISTEMA_DIGITAL',
  '5': 'SERVICIOS_FINANCIEROS',
  '6': 'INFRAESTRUCTURA_HEREDADA',
  '7': 'CADENA_SUMINISTRO',
  '8': 'INFORMACION_REGULADA'
};