/**
 * Utility for combining class names
 * Uses clsx for conditional classes and tailwind-merge for deduplication
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}