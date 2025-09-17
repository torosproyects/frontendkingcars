"use client";

import { useState, useCallback, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Download, 
  Eye, 
  FileText, 
  Loader2, 
  AlertCircle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X
} from "lucide-react";
import { PDFFile } from "@/types/verification";
import { VerificationService } from "@/lib/api/verification";
import PDFThumbnail from "./PDFThumbnail";

// Configurar worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfFile: PDFFile;
  onDownload?: () => void;
}

export default function PDFViewer({ pdfFile, onDownload }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullViewer, setShowFullViewer] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfLoaded, setPdfLoaded] = useState(false);

  // Función para formatear el tamaño del archivo
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Función para obtener el tipo de documento en español
  const getDocumentTypeLabel = (tipo: string): string => {
    const typeMap: Record<string, string> = {
      'reciboServicio': 'Recibo de Servicio',
      'certificadoBancario': 'Certificado Bancario',
      'altaAutonomo': 'Alta de Autónomo',
      'reta': 'RETA',
      'escriturasConstitucion': 'Escrituras de Constitución',
      'iaeAno': 'IAE del Año',
      'tarjetaCif': 'Tarjeta CIF',
      'certificadoTitularidadBancaria': 'Certificado de Titularidad Bancaria'
    };
    return typeMap[tipo] || tipo;
  };

  // Cargar PDF bajo demanda
  const loadPDF = useCallback(async () => {
    if (pdfLoaded) return; // Ya está cargado
    
    try {
      setLoading(true);
      setError(null);
      
      // Validar que el ID del archivo sea válido
      if (!pdfFile.id || isNaN(pdfFile.id)) {
        setError('ID de archivo inválido');
        return;
      }
      
      // Crear URL temporal para el PDF
      const blob = await VerificationService.downloadDocument(pdfFile.id);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setPdfLoaded(true);
      
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError('Error al cargar el PDF');
    } finally {
      setLoading(false);
    }
  }, [pdfFile.id, pdfLoaded]);

  // Limpiar URL al desmontar
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  // Manejar descarga (independiente del PDF cargado)
  const handleDownload = async () => {
    try {
      // Validar que el ID del archivo sea válido
      if (!pdfFile.id || isNaN(pdfFile.id)) {
        setError('ID de archivo inválido');
        return;
      }
      
      const blob = await VerificationService.downloadDocument(pdfFile.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = pdfFile.nombre_original;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      onDownload?.();
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError('Error al descargar el PDF');
    }
  };

  // Manejar apertura del visor completo
  const handleOpenFullViewer = async () => {
    if (!pdfLoaded) {
      await loadPDF();
    }
    setShowFullViewer(true);
  };

  // Manejar carga exitosa del documento
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  // Manejar error de carga
  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF document:', error);
    setError('Error al cargar el documento PDF');
  };

  // Cambiar página
  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.max(1, Math.min(newPageNumber, numPages || 1));
    });
  };

  // Cambiar escala
  const changeScale = (offset: number) => {
    setScale(prevScale => Math.max(0.5, Math.min(prevScale + offset, 3.0)));
  };

  // Resetear escala
  const resetScale = () => {
    setScale(1.0);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-red-500" />
            <CardTitle className="text-lg">{getDocumentTypeLabel(pdfFile.tipo)}</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {formatFileSize(pdfFile.tamaño)}
          </Badge>
        </div>
        <p className="text-sm text-gray-500">{pdfFile.nombre_original}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Preview de la primera página */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <PDFThumbnail pdfFile={pdfFile} />
        </div>

        {/* Controles */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleOpenFullViewer}
            className="flex-1"
            disabled={loading || !!error}
          >
            <Eye className="h-4 w-4 mr-2" />
            {loading ? 'Cargando...' : 'Ver PDF Completo'}
          </Button>
          
          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Descargar
          </Button>
        </div>
      </CardContent>

      {/* Modal del visor completo */}
      {showFullViewer && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                {getDocumentTypeLabel(pdfFile.tipo)} - {pdfFile.nombre_original}
              </h3>
              <Button
                onClick={() => setShowFullViewer(false)}
                variant="ghost"
                size="sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Controles del visor */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => changePage(-1)}
                  disabled={pageNumber <= 1}
                  size="sm"
                  variant="outline"
                >
                  Anterior
                </Button>
                <span className="text-sm">
                  Página {pageNumber} de {numPages || 0}
                </span>
                <Button
                  onClick={() => changePage(1)}
                  disabled={pageNumber >= (numPages || 1)}
                  size="sm"
                  variant="outline"
                >
                  Siguiente
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => changeScale(-0.2)}
                  size="sm"
                  variant="outline"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm min-w-[60px] text-center">
                  {Math.round(scale * 100)}%
                </span>
                <Button
                  onClick={() => changeScale(0.2)}
                  size="sm"
                  variant="outline"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  onClick={resetScale}
                  size="sm"
                  variant="outline"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Visor de PDF */}
            <div className="flex-1 overflow-auto p-4">
              {loading && !pdfLoaded ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400 mr-3" />
                  <span className="text-gray-500">Cargando PDF completo...</span>
                </div>
              ) : pdfUrl ? (
                <div className="flex justify-center">
                  <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                  >
                    <Page
                      pageNumber={pageNumber}
                      scale={scale}
                      className="shadow-lg"
                    />
                  </Document>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <AlertCircle className="h-8 w-8 mr-3" />
                  <span>Error al cargar el PDF</span>
                </div>
              )}
            </div>

            {/* Footer con botón de descarga */}
            <div className="flex justify-end p-4 border-t">
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Descargar PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
