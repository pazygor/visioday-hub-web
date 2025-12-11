import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utilitário para mesclar classes CSS do Tailwind de forma inteligente
 * Combina clsx e tailwind-merge para evitar conflitos de classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
