/**
 * VISIONDAY ACADEMY - CERTIFICADOS API
 * Serviços para gerenciamento de certificados
 */

import httpClient from '../httpClient';
import type {
  AcademyCertificado,
  CertificadoValidation,
  CertificadoDownload,
} from '@/modules/academy/types/academy.types';

// ============================================
// CERTIFICADOS
// ============================================

/**
 * Gerar certificado para uma matrícula
 */
export async function generateCertificate(matriculaId: number): Promise<AcademyCertificado> {
  return httpClient.post('/academy/certificados/generate', { matriculaId });
}

/**
 * Listar meus certificados
 */
export async function getMyCertificates(): Promise<AcademyCertificado[]> {
  return httpClient.get('/academy/certificados/meus');
}

/**
 * Buscar certificado por código
 */
export async function getCertificateByCodigo(codigo: string): Promise<AcademyCertificado> {
  return httpClient.get(`/academy/certificados/${codigo}`);
}

/**
 * Download do certificado (retorna URL do PDF)
 */
export async function downloadCertificate(codigo: string): Promise<CertificadoDownload> {
  return httpClient.get(`/academy/certificados/${codigo}/download`);
}

/**
 * Validar certificado (público - sem autenticação)
 */
export async function validateCertificate(hash: string): Promise<CertificadoValidation> {
  return httpClient.get(`/academy/certificados/validate/${hash}`);
}
