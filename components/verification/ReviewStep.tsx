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

interface ReviewStepProps {
  data: VerificationData;
  onSubmit: () => void;
  isLoading: boolean;
}

export function ReviewStep({ data, onSubmit, isLoading }: ReviewStepProps) {
  const getAccountTypeIcon = (type: AccountType) => {
    switch (type) {
      case 'Taller': return Wrench;
      case 'Usuario': return User;
      case 'Empresa': return Building2;
      default: return User;
    }
  };

  const getAccountTypeColor = (type: AccountType) => {
    switch (type) {
      case 'Taller': return 'bg-orange-100 text-orange-800';
      case 'Usuario': return 'bg-blue-100 text-blue-800';
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

  const renderTallerInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Información del Taller
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Nombre del Taller</label>
            <p className="text-gray-900">{data.tallerData?.nombreTaller}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">CIF</label>
            <p className="text-gray-900">{data.tallerData?.cif}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Número de Registro</label>
            <p className="text-gray-900">{data.tallerData?.numeroRegistro}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Teléfono</label>
            <p className="text-gray-900">{data.tallerData?.telefono}</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-600">Dirección</label>
            <p className="text-gray-900 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {data.tallerData?.direccion}, {data.tallerData?.codigoPostal}, {data.tallerData?.provincia}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderUsuarioInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Información Personal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">DNI/NIE</label>
            <p className="text-gray-900">{data.usuarioData?.dni}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Fecha de Nacimiento</label>
            <p className="text-gray-900">{data.usuarioData?.fechaNacimiento}</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-600">Dirección</label>
            <p className="text-gray-900 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {data.usuarioData?.direccion}, {data.usuarioData?.codigoPostal}, {data.usuarioData?.provincia}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderEmpresaInfo = () => (
    <div className="space-y-6">
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
              <label className="text-sm font-medium text-gray-600">Razón Social</label>
              <p className="text-gray-900">{data.empresaData?.razonSocial}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">CIF</label>
              <p className="text-gray-900">{data.empresaData?.cif}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Teléfono</label>
              <p className="text-gray-900">{data.empresaData?.telefono}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email Corporativo</label>
              <p className="text-gray-900">{data.empresaData?.emailCorporativo}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">Dirección Fiscal</label>
              <p className="text-gray-900 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {data.empresaData?.direccionFiscal}, {data.empresaData?.codigoPostal}, {data.empresaData?.provincia}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Representante Legal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Nombre</label>
              <p className="text-gray-900">{data.empresaData?.representanteLegal.nombre}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">DNI/NIE</label>
              <p className="text-gray-900">{data.empresaData?.representanteLegal.dni}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Cargo</label>
              <p className="text-gray-900">{data.empresaData?.representanteLegal.cargo}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Teléfono</label>
              <p className="text-gray-900">{data.empresaData?.representanteLegal.telefono}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-900">{data.empresaData?.representanteLegal.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDocuments = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Documentos Capturados
        </CardTitle>
        <CardDescription>
          Documentos fotografiados para la verificación
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.documents.dni && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">DNI/NIE</label>
              <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={data.documents.dni}
                  alt="DNI/NIE"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
          
          {data.documents.cif && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">CIF</label>
              <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={data.documents.cif}
                  alt="CIF"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
          
          {data.documents.tallerRegistro && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Registro de Taller</label>
              <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={data.documents.tallerRegistro}
                  alt="Registro de Taller"
                  fill
                  className="object-cover"
                />
              </div>
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
      
      {data.accountType === 'Taller' && renderTallerInfo()}
      {data.accountType === 'Usuario' && renderUsuarioInfo()}
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
