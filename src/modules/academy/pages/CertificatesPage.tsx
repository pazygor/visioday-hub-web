/**
 * VISIONDAY ACADEMY - CERTIFICATES PAGE
 * Página para visualizar e fazer download de certificados
 */

import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { getMyCertificates, downloadCertificate } from '@/services/api/academy-certificados.api';
import type { AcademyCertificado } from '@/modules/academy/types/academy.types';

export const CertificatesPage = () => {
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState<AcademyCertificado[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<AcademyCertificado | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [downloading, setDownloading] = useState<number | null>(null);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const data = await getMyCertificates();
      setCertificates(data);
    } catch (error) {
      console.error('Erro ao carregar certificados:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível carregar os certificados',
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (codigo: string, certificadoId: number) => {
    try {
      setDownloading(certificadoId);
      const result = await downloadCertificate(codigo);
      
      if (result.arquivoUrl) {
        // Abrir PDF em nova aba
        const pdfUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${result.arquivoUrl}`;
        window.open(pdfUrl, '_blank');
        
        toast.current?.show({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Certificado aberto em nova aba',
          life: 3000,
        });
      }
    } catch (error) {
      console.error('Erro ao fazer download:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível baixar o certificado',
        life: 3000,
      });
    } finally {
      setDownloading(null);
    }
  };

  const handleViewDetails = (certificate: AcademyCertificado) => {
    setSelectedCertificate(certificate);
    setShowDetailDialog(true);
  };

  const handleShare = (hashValidacao: string) => {
    const validationUrl = `${window.location.origin}/academy/validate/${hashValidacao}`;
    navigator.clipboard.writeText(validationUrl);
    
    toast.current?.show({
      severity: 'info',
      summary: 'Link Copiado',
      detail: 'Link de validação copiado para a área de transferência',
      life: 3000,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <Toast ref={toast} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Certificados</h1>
          <p className="text-gray-600 mt-1">
            Certificados dos cursos concluídos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tag
            value={`${certificates.length} ${certificates.length === 1 ? 'certificado' : 'certificados'}`}
            severity="success"
            className="text-lg px-4 py-2"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Certificates Grid */}
      {!loading && certificates.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <Card key={cert.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Certificate Icon */}
                <div className="flex items-center justify-center py-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                  <i className="pi pi-star-fill text-6xl text-yellow-500"></i>
                </div>

                {/* Course Title */}
                <div>
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
                    {cert.curso?.titulo || 'Curso'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {cert.curso?.categoria?.nome || 'Categoria'}
                  </p>
                </div>

                {/* Certificate Info */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <i className="pi pi-calendar"></i>
                    <span>Emitido em {formatDate(cert.dataEmissao)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="pi pi-clock"></i>
                    <span>{cert.cargaHoraria}h de carga horária</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="pi pi-hashtag"></i>
                    <span className="font-mono text-xs">{cert.codigo}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    label="Download"
                    icon="pi pi-download"
                    className="flex-1"
                    loading={downloading === cert.id}
                    onClick={() => handleDownload(cert.codigo, cert.id)}
                  />
                  <Button
                    icon="pi pi-eye"
                    outlined
                    tooltip="Ver Detalhes"
                    onClick={() => handleViewDetails(cert)}
                  />
                  <Button
                    icon="pi pi-share-alt"
                    outlined
                    severity="info"
                    tooltip="Compartilhar Link de Validação"
                    onClick={() => handleShare(cert.hashValidacao)}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && certificates.length === 0 && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <i className="pi pi-star text-6xl text-gray-400 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Nenhum certificado ainda
          </h3>
          <p className="text-gray-500 mb-6">
            Complete seus cursos para obter certificados e impulsionar sua carreira
          </p>
          <Button
            label="Explorar Cursos"
            icon="pi pi-search"
            size="large"
            onClick={() => window.location.href = '/academy/catalog'}
          />
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog
        header="Detalhes do Certificado"
        visible={showDetailDialog}
        style={{ width: '600px' }}
        onHide={() => setShowDetailDialog(false)}
      >
        {selectedCertificate && (
          <div className="space-y-6">
            {/* Certificate Preview */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-8 text-center">
              <i className="pi pi-star-fill text-6xl text-yellow-500 mb-4"></i>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Certificado de Conclusão
              </h2>
              <p className="text-gray-600">
                {selectedCertificate.curso?.titulo}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <i className="pi pi-hashtag text-gray-400 mt-1"></i>
                <div>
                  <p className="text-sm text-gray-600">Código do Certificado</p>
                  <p className="font-mono font-semibold text-gray-900">
                    {selectedCertificate.codigo}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <i className="pi pi-calendar text-gray-400 mt-1"></i>
                <div>
                  <p className="text-sm text-gray-600">Data de Emissão</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(selectedCertificate.dataEmissao)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <i className="pi pi-clock text-gray-400 mt-1"></i>
                <div>
                  <p className="text-sm text-gray-600">Carga Horária</p>
                  <p className="font-semibold text-gray-900">
                    {selectedCertificate.cargaHoraria} horas
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <i className="pi pi-shield text-gray-400 mt-1"></i>
                <div>
                  <p className="text-sm text-gray-600">Hash de Validação</p>
                  <p className="font-mono text-xs text-gray-900 break-all">
                    {selectedCertificate.hashValidacao}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <i className="pi pi-link text-gray-400 mt-1"></i>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">Link de Validação Pública</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={`${window.location.origin}/academy/validate/${selectedCertificate.hashValidacao}`}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                    />
                    <Button
                      icon="pi pi-copy"
                      outlined
                      onClick={() => handleShare(selectedCertificate.hashValidacao)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button
                label="Fazer Download do PDF"
                icon="pi pi-download"
                className="flex-1"
                onClick={() => {
                  handleDownload(selectedCertificate.codigo, selectedCertificate.id);
                  setShowDetailDialog(false);
                }}
              />
              <Button
                label="Fechar"
                outlined
                onClick={() => setShowDetailDialog(false)}
              />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};
