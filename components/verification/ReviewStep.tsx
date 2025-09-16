'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  Wrench,
  Camera,
  FileText
} from 'lucide-react';
import { VerificationData, AccountType } from '@/types/verification';
import Image from 'next/image';
import { PDFPreview, PDFInfo } from './PDFPreview';

interface ReviewStepProps {
  data: VerificationData;
  onSubmit: () => void;
  isLoading: boolean;
}

export function ReviewStep({ data, onSubmit, isLoading }: ReviewStepProps) {
  const getAccountTypeIcon = (type: AccountType) => {
    switch (type) {
      case 'Autónomo': return Wrench;
      case 'Particular': return User;
      case 'Empresa': return Building2;
      default: return User;
    }
  };

  const getAccountTypeColor = (type: AccountType) => {
    switch (type) {
      case 'Autónomo': return 'bg-orange-100 text-orange-800';
      case 'Particular': return 'bg-blue-100 text-blue-800';
      case 'Empresa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderBasicInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Información Básica
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Nombre</label>
            <p className="text-gray-900">{data.firstName} {data.lastName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <p className="text-gray-900 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {data.email}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Teléfono</label>
            <p className="text-gray-900 flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {data.phone}
              {data.phoneVerified && (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Tipo de Cuenta</label>
            <div className="flex items-center gap-2">
              {React.createElement(getAccountTypeIcon(data.accountType), { 
                className: "h-4 w-4" 
              })}
              <Badge className={getAccountTypeColor(data.accountType)}>
                {data.accountType}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderParticularInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Información del Particular
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Número de Recibo de Servicio</label>
            <p className="text-gray-900">{data.particularData?.numeroReciboServicio}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderAutonomoInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Información del Autónomo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Alta de Autónomo</label>
            <p className="text-gray-900">{data.autonomoData?.altaAutonomo}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">RETA</label>
            <p className="text-gray-900">{data.autonomoData?.reta}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderEmpresaInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Información de la Empresa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">CIF</label>
            <p className="text-gray-900">{data.empresaData?.cif}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Número de Escritura de Constitución</label>
            <p className="text-gray-900">{data.empresaData?.numeroEscrituraConstitucion}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderDocuments = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documentos Subidos
        </CardTitle>
        <CardDescription>
          Documentos fotografiados y archivos PDF para la verificación
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Foto de documento de identidad */}
        {data.documents.documentoIdentidad && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Documento de Identidad</label>
            <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={data.documents.documentoIdentidad}
                alt="Documento de Identidad"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* PDFs según tipo de cuenta */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-600">Documentos PDF</h4>
          
          {/* PDFs para Particular */}
          {data.accountType === 'Particular' && (
            <div className="space-y-3">
              {data.documents.reciboServicio && (
                <PDFInfo 
                  file={data.documents.reciboServicio} 
                  label="Recibo de Servicio" 
                />
              )}
              {data.documents.certificadoBancario && (
                <PDFInfo 
                  file={data.documents.certificadoBancario} 
                  label="Certificado Bancario" 
                />
              )}
            </div>
          )}

          {/* PDFs para Autónomo */}
          {data.accountType === 'Autónomo' && (
            <div className="space-y-3">
              {data.documents.altaAutonomo && (
                <PDFInfo 
                  file={data.documents.altaAutonomo} 
                  label="Alta de Autónomo" 
                />
              )}
              {data.documents.reta && (
                <PDFInfo 
                  file={data.documents.reta} 
                  label="RETA" 
                />
              )}
              {data.documents.certificadoBancario && (
                <PDFInfo 
                  file={data.documents.certificadoBancario} 
                  label="Certificado Bancario" 
                />
              )}
            </div>
          )}

          {/* PDFs para Empresa */}
          {data.accountType === 'Empresa' && (
            <div className="space-y-3">
              {data.documents.escriturasConstitucion && (
                <PDFInfo 
                  file={data.documents.escriturasConstitucion} 
                  label="Escrituras de Constitución" 
                />
              )}
              {data.documents.iaeAno && (
                <PDFInfo 
                  file={data.documents.iaeAno} 
                  label="IAE del Año" 
                />
              )}
              {data.documents.tarjetaCif && (
                <PDFInfo 
                  file={data.documents.tarjetaCif} 
                  label="Tarjeta CIF" 
                />
              )}
              {data.documents.certificadoTitularidadBancaria && (
                <PDFInfo 
                  file={data.documents.certificadoTitularidadBancaria} 
                  label="Certificado de Titularidad Bancaria" 
                />
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Revisión Final</h2>
        <p className="text-gray-600">
          Revisa toda la información antes de enviar tu solicitud de verificación
        </p>
      </div>

      {renderBasicInfo()}
      
      {data.accountType === 'Particular' && renderParticularInfo()}
      {data.accountType === 'Autónomo' && renderAutonomoInfo()}
      {data.accountType === 'Empresa' && renderEmpresaInfo()}
      
      {renderDocuments()}

      {/* Botón de envío */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-green-800">
              <CheckCircle className="h-6 w-6" />
              <span className="font-medium">Información completa y lista para enviar</span>
            </div>
            
            <p className="text-sm text-green-700">
              Al enviar esta solicitud, aceptas nuestros términos y condiciones. 
              Tu información será revisada por nuestro equipo de verificación.
            </p>
            
            <Button 
              onClick={onSubmit}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Enviando solicitud...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Enviar Solicitud de Verificación
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
