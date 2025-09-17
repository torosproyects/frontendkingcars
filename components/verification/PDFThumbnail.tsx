"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2, AlertCircle, FileText } from "lucide-react";
import { VerificationService } from "@/lib/api/verification";
import { PDFFile } from "@/types/verification";

// Configurar worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFThumbnailProps {
  pdfFile: PDFFile;
}

export default function PDFThumbnail({ pdfFile }: PDFThumbnailProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadThumbnail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Validar que el ID del archivo sea válido
        if (!pdfFile.id || isNaN(pdfFile.id)) {
          setError('ID de archivo inválido');
          return;
        }
        
        // Crear URL temporal para el PDF (solo para thumbnail)
        const blob = await VerificationService.downloadDocument(pdfFile.id);
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        
      } catch (err) {
        console.error('Error loading PDF thumbnail:', err);
        setError('Error al cargar el preview del PDF');
      } finally {
        setLoading(false);
      }
    };

    loadThumbnail();

    // Cleanup
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfFile.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">Cargando preview...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48 text-red-500">
        <AlertCircle className="h-8 w-8 mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        <FileText className="h-12 w-12 mr-3" />
        <span>Preview del PDF</span>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <Document
        file={pdfUrl}
        loading={
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        }
        error={
          <div className="flex items-center justify-center h-48 text-red-500">
            <AlertCircle className="h-8 w-8 mr-2" />
            <span>Error al cargar el PDF</span>
          </div>
        }
      >
        <Page
          pageNumber={1}
          scale={0.5}
          className="shadow-md"
        />
      </Document>
    </div>
  );
}
