/**
 * Branded types for type safety
 * These ensure that numbers with specific meanings can't be mixed up
 */

// Utility type for creating branded types
declare const brand: unique symbol;
type Brand<T, TBrand> = T & { readonly [brand]: TBrand };

// Core numeric types with semantic meaning
export type Score = Brand<number, 'Score'>;
export type Percentage = Brand<number, 'Percentage'>;
export type Currency = Brand<number, 'Currency'>;
export type Hours = Brand<number, 'Hours'>;

// Constructor functions for branded types
export const Score = (value: number): Score => {
  if (value < 0 || value > 100) {
    throw new Error('Score must be between 0 and 100');
  }
  return value as Score;
};

export const Percentage = (value: number): Percentage => {
  if (value < 0 || value > 100) {
    throw new Error('Percentage must be between 0 and 100');
  }
  return value as Percentage;
};

export const Currency = (value: number): Currency => {
  if (value < 0) {
    throw new Error('Currency cannot be negative');
  }
  return value as Currency;
};

export const Hours = (value: number): Hours => {
  if (value < 0) {
    throw new Error('Hours cannot be negative');
  }
  return value as Hours;
};