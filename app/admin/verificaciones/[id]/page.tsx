"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { VerificationService } from "@/lib/api/verification";
import { VerificationDetail, VerificationStatusUpdate } from "@/types/verification";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download,
  User,
  MapPin,
  Building,
  FileText,
  Calendar,
  Phone,
  Mail,
  AlertCircle,
  Loader2
} from "lucide-react";
import PDFViewer from "@/components/verification/PDFViewer";

export default function VerificationDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [verification, setVerification] = useState<VerificationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'aprobada' | 'rechazada' | 'en_revision' | null>(null);
  const [notas, setNotas] = useState("");

  // Cargar detalles de la verificación
  useEffect(() => {
    if (id) {
      // Validar que el ID sea un número válido antes de hacer la llamada
      const verificationId = parseInt(id as string, 10);
      if (!isNaN(verificationId)) {
        fetchVerificationDetails();
      } else {
        setError('ID de verificación inválido');
        setLoading(false);
      }
    }
  }, [id]);

  const fetchVerificationDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Validar que el ID sea un número válido
      const verificationId = parseInt(id as string, 10);
      
      if (isNaN(verificationId)) {
        setError('ID de verificación inválido');
        return;
      }
      
      const response = await VerificationService.getVerificationById(verificationId);
      
      if (response.success) {
        setVerification(response.data);
      } else {
        setError('Error al cargar los detalles de la verificación');
      }
    } catch (err) {
      console.error('Error fetching verification details:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambio de estado
  const handleStatusChange = async (action: 'aprobada' | 'rechazada' | 'en_revision') => {
    if (!verification) return;

    setIsProcessing(true);
    setActionError(null);

    try {
      const updateData: VerificationStatusUpdate = {
        estado: action,
        notas_revision: notas.trim() || undefined
      };

      await VerificationService.updateVerificationStatus(verification.id, updateData);
      
      // Mostrar mensaje de éxito
      alert(`Verificación ${action === 'aprobada' ? 'aprobada' : action === 'rechazada' ? 'rechazada' : 'marcada como en revisión'} exitosamente.`);
      
      // Recargar los datos
      await fetchVerificationDetails();
      
      // Cerrar modal
      setShowActionModal(false);
      setSelectedAction(null);
      setNotas("");
      
    } catch (err) {
      console.error('Error updating verification status:', err);
      setActionError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsProcessing(false);
    }
  };

  // Abrir modal de acción
  const openActionModal = (action: 'aprobada' | 'rechazada' | 'en_revision') => {
    setSelectedAction(action);
    setShowActionModal(true);
    setNotas("");
    setActionError(null);
  };

  // Cerrar modal
  const closeActionModal = () => {
    setShowActionModal(false);
    setSelectedAction(null);
    setNotas("");
    setActionError(null);
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtener color del badge de estado
  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "en_revision":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "aprobada":
        return "bg-green-100 text-green-800 border-green-300";
      case "rechazada":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Obtener color del badge de tipo de cuenta
  const getTipoCuentaBadgeColor = (account_type_id: number) => {
    switch (account_type_id) {
      case 7:
        return "bg-purple-100 text-purple-800 border-purple-300";
      case 5:
        return "bg-orange-100 text-orange-800 border-orange-300";
      case 6:
        return "bg-indigo-100 text-indigo-800 border-indigo-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando detalles de la verificación...</p>
        </div>
      </div>
    );
  }

  if (error || !verification) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 font-medium">{error || "Verificación no encontrada"}</p>
          <Link href="/admin/verificaciones" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
            Volver a verificaciones
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/admin/verificaciones" 
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver a Verificaciones
          </Link>
          
          <div className="flex items-center gap-3">
            <Badge className={`capitalize ${getEstadoBadgeColor(verification.estado)}`}>
              {verification.estado.replace('_', ' ')}
            </Badge>
            <Badge className={`capitalize ${getTipoCuentaBadgeColor(verification.account_type_id)}`}>
              {verification.account_type_name}
            </Badge>
          </div>
        </div>

        {/* Título */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {verification.first_name} {verification.last_name}
          </h1>
          <p className="text-gray-600">
            Verificación #{verification.id} • Solicitada el {formatDate(verification.fecha_solicitud)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Columna Izquierda - Documentos */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documentos
            </h2>

            {/* Foto del documento de identidad */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Documento de Identidad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={verification.documentos.documento_identidad.url}
                    alt={`Documento de identidad de ${verification.first_name} ${verification.last_name}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Archivos PDF */}
            {verification.documentos.archivos_pdf.map((pdfFile) => (
              <PDFViewer key={pdfFile.id} pdfFile={pdfFile} />
            ))}
          </div>

          {/* Columna Derecha - Información */}
          <div className="space-y-6">
            {/* Información Personal */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Nombre completo</p>
                    <p className="font-medium">{verification.first_name} {verification.last_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Fecha de nacimiento</p>
                    <p className="font-medium">{formatDate(verification.fecha_nacimiento)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {verification.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Teléfono</p>
                    <p className="font-medium flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {verification.phone}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Documento de identidad</p>
                    <p className="font-medium">{verification.documento_tipo}: {verification.documento_numero}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dirección */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Dirección
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">{verification.direccion}</p>
                  <p>{verification.codigo_postal} {verification.ciudad}</p>
                  <p>{verification.estado_provincia}, {verification.pais}</p>
                </div>
              </CardContent>
            </Card>

            {/* Tipo de Cuenta y Datos Específicos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Tipo de Cuenta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-500 text-sm">Tipo</p>
                    <Badge className={`capitalize ${getTipoCuentaBadgeColor(verification.account_type_id)}`}>
                      {verification.account_type_name}
                    </Badge>
                  </div>
                  
                  {/* Datos específicos según el tipo */}
                  {verification.account_type_id === 7 && verification.particular_data && (
                    <div>
                      <p className="text-gray-500 text-sm">Datos de Particular</p>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <pre className="text-sm">{verification.particular_data}</pre>
                      </div>
                    </div>
                  )}
                  
                  {verification.account_type_id === 5 && verification.autonomo_data && (
                    <div>
                      <p className="text-gray-500 text-sm">Datos de Autónomo</p>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <pre className="text-sm">{verification.autonomo_data}</pre>
                      </div>
                    </div>
                  )}
                  
                  {verification.account_type_id === 6 && verification.empresa_data && (
                    <div>
                      <p className="text-gray-500 text-sm">Datos de Empresa</p>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <pre className="text-sm">{verification.empresa_data}</pre>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Información de la Verificación */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Información de la Verificación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estado actual:</span>
                    <Badge className={`capitalize ${getEstadoBadgeColor(verification.estado)}`}>
                      {verification.estado.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fecha de solicitud:</span>
                    <span className="font-medium">{formatDate(verification.fecha_solicitud)}</span>
                  </div>
                  {verification.fecha_revision && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Fecha de revisión:</span>
                      <span className="font-medium">{formatDate(verification.fecha_revision)}</span>
                    </div>
                  )}
                  {verification.notas_revision && (
                    <div>
                      <span className="text-gray-500">Notas de revisión:</span>
                      <p className="font-medium mt-1 p-2 bg-gray-50 rounded-md">
                        {verification.notas_revision}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Acciones */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Acciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3">
                  {verification.estado === 'pendiente' && (
                    <>
                      <Button
                        onClick={() => openActionModal('en_revision')}
                        variant="outline"
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        En Revisión
                      </Button>
                      <Button
                        onClick={() => openActionModal('aprobada')}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprobar
                      </Button>
                      <Button
                        onClick={() => openActionModal('rechazada')}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rechazar
                      </Button>
                    </>
                  )}
                  
                  {verification.estado === 'en_revision' && (
                    <>
                      <Button
                        onClick={() => openActionModal('aprobada')}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprobar
                      </Button>
                      <Button
                        onClick={() => openActionModal('rechazada')}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rechazar
                      </Button>
                    </>
                  )}
                  
                  {(verification.estado === 'aprobada' || verification.estado === 'rechazada') && (
                    <div className="text-center text-gray-500 py-4">
                      <p>Esta verificación ya ha sido procesada.</p>
                      <p className="text-sm">Estado: {verification.estado}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de acción */}
      {showActionModal && selectedAction && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {selectedAction === 'aprobada' && 'Aprobar Verificación'}
                {selectedAction === 'rechazada' && 'Rechazar Verificación'}
                {selectedAction === 'en_revision' && 'Marcar como En Revisión'}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {selectedAction === 'aprobada' && '¿Estás seguro de que quieres aprobar esta verificación?'}
                {selectedAction === 'rechazada' && '¿Estás seguro de que quieres rechazar esta verificación?'}
                {selectedAction === 'en_revision' && '¿Estás seguro de que quieres marcar esta verificación como en revisión?'}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas {selectedAction === 'rechazada' ? '(Obligatorio para rechazo)' : '(Opcional)'}
                  </label>
                  <Textarea
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Agrega notas sobre esta acción..."
                    rows={3}
                    required={selectedAction === 'rechazada'}
                  />
                </div>

                {actionError && (
                  <div className="text-red-500 text-sm">
                    {actionError}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={closeActionModal}
                    variant="outline"
                    className="flex-1"
                    disabled={isProcessing}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => handleStatusChange(selectedAction)}
                    className={`flex-1 ${
                      selectedAction === 'aprobada' ? 'bg-green-600 hover:bg-green-700' :
                      selectedAction === 'rechazada' ? 'bg-red-600 hover:bg-red-700' :
                      'bg-blue-600 hover:bg-blue-700'
                    }`}
                    disabled={isProcessing || (selectedAction === 'rechazada' && !notas.trim())}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        {selectedAction === 'aprobada' && <CheckCircle className="h-4 w-4 mr-2" />}
                        {selectedAction === 'rechazada' && <XCircle className="h-4 w-4 mr-2" />}
                        {selectedAction === 'en_revision' && <Eye className="h-4 w-4 mr-2" />}
                        Confirmar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
