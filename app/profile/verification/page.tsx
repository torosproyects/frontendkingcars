"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import PhoneVerification from '@/components/verificacionsms/PhoneVerification';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/lib/store/auth-store';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  User,
  MapPin,
  FileText,
  Shield,
  Phone,
  Mail,
  Calendar,
  Home,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CameraModal from '@/components/camara/CameraModal';
import PhotoSlot from '@/components/camara/PhotoSlot';

// Tipos y esquemas (igual que antes)
const verificationSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  phone: z.string().min(10, "El teléfono debe tener al menos 10 dígitos").regex(/^\+?[\d\s-()]+$/, "Formato de teléfono inválido"),
  phoneVerified: z.boolean().optional().refine(val => val === true, {
    message: "Debes verificar tu número de teléfono",
  }),
  dateOfBirth: z.string().min(1, "La fecha de nacimiento es requerida"),
  documentType: z.string().min(1, "Selecciona un tipo de documento"),
  documentNumber: z.string().min(5, "El número de documento debe tener al menos 5 caracteres"),
  address: z.string().min(10, "La dirección debe tener al menos 10 caracteres"),
  city: z.string().min(2, "La ciudad es requerida"),
  state: z.string().min(2, "El estado es requerido"),
  zipCode: z.string().min(4, "El código postal debe tener al menos 4 caracteres"),
  occupation: z.string().min(2, "La ocupación es requerida"),
  requestedRole: z.string().min(1, "Selecciona el rol que deseas"),
  bio: z.string().optional(),
});

type VerificationValues = z.infer<typeof verificationSchema>;

// Tipos y datos constantes (igual que antes)
const documentTypes = [
  { value: "cedula", label: "Cédula de Ciudadanía" },
  { value: "pasaporte", label: "Pasaporte" },
  { value: "licencia", label: "Licencia de Conducir" },
  { value: "tarjeta_identidad", label: "Tarjeta de Identidad" },
];

const availableRoles = [
  { value: "Taller", label: "Taller", description: "Manejo de Carros y Revision" },
  { value: "Usuario", label: "Usuario", description: "Compra, Venta y Subasta de Carros" },
];

const predefinedLocations = [
  { id: 1, name: "Sucursal Centro", lat: 19.4326, lng: -99.1332, address: "Av. Caracs , Centro, CDMX" },
  { id: 2, name: "Sucursal madrid", lat: 19.4267, lng: -99.1718, address: "Av. Presidente Masaryk 456, Polanco, ESPN" },
  { id: 3, name: "Sucursal Santa Fe", lat: 19.3598, lng: -99.2674, address: "Av. Santa Fe 789, Santa Fe, BAR" },
  { id: 4, name: "Sucursal Insurgentes", lat: 19.3910, lng: -99.1710, address: "Av. Insurgentes Sur 321, Del Valle, COL" },
  { id: 5, name: "Sucursal Satelite", lat: 19.5057, lng: -99.2386, address: "Blvd. Manuel Ávila Camacho 654, Satélite, DEF" },
];

interface Location {
  id: number;
  name: string;
  lat: number;
  lng: number;
  address: string;
}

function VerificationContent() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [documentPhoto, setDocumentPhoto] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);

  const form = useForm<VerificationValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      firstName: user?.name || '',
      lastName: user?.name || '',
      email: user?.email || '',
      phone: '',
      dateOfBirth: '',
      documentType: '',
      documentNumber: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      occupation: '',
      requestedRole: 'Usuario',
      bio: '',
    },
  });

  // Template para la foto del documento
  const documentTemplate = {
    id: 1,
    label: "Documento de Identidad",
    description: "Toma una foto clara de tu documento oficial",
    required: true,
    referenceImage: "/images/document-placeholder.jpg",
    aspectRatio: "4/3",
    guidanceImage: "/images/document-frame.png"
  };

  const handleCaptureDocument = (dataUrl: string) => {
    setDocumentPhoto(dataUrl);
    toast({
      title: "¡Foto capturada!",
      description: "Documento fotografiado exitosamente"
    });
  };

  const handleRetakeDocument = () => {
    setDocumentPhoto(null);
    setShowCameraModal(true);
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    toast({
      title: "Ubicación seleccionada",
      description: `Has seleccionado: ${location.name}`
    });
  };

  const onSubmit = async (data: VerificationValues) => {
    if (!isPhoneVerified) {
      toast({
        title: "Teléfono no verificado",
        description: "Por favor verifica tu número de teléfono",
        variant: "destructive"
      });
      return;
    }
    
    if (!documentPhoto) {
      toast({
        title: "Foto requerida",
        description: "Debes tomar una foto de tu documento de identidad",
        variant: "destructive"
      });
      return;
    }

    if (!selectedLocation) {
      toast({
        title: "Ubicación requerida",
        description: "Debes seleccionar una ubicación en el mapa",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('firstName', data.firstName);
formData.append('lastName', data.lastName);
formData.append('email', data.email);
formData.append('phone', data.phone);
formData.append('dateOfBirth', data.dateOfBirth);
formData.append('documentType', data.documentType);
formData.append('documentNumber', data.documentNumber);
formData.append('address', data.address);
formData.append('city', data.city);
formData.append('state', data.state);
formData.append('zipCode', data.zipCode);
formData.append('occupation', data.occupation);
formData.append('bio', data.bio || '');
formData.append('requestedRole', data.requestedRole);
if (selectedLocation) {
  formData.append('selectedLocation', JSON.stringify(selectedLocation));
}
      if (documentPhoto) { // Verificar que documentPhoto no sea null
  try {
    // Función auxiliar para convertir Data URL a Blob
    const dataURLToBlob = (dataURL: string): Blob => {
      const parts = dataURL.split(';base64,');
      const contentType = parts[0].split(':')[1];
      const raw = atob(parts[1]); // Decodificar base64
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }

      return new Blob([uInt8Array], { type: contentType });
    };

    const documentPhotoBlob = dataURLToBlob(documentPhoto);
    // Ahora sí podemos pasar el Blob a FormData.append
    formData.append('documentPhoto', documentPhotoBlob, 'document.jpg');
  } catch (error) {
    console.error("Error al convertir la imagen a Blob:", error);
    toast({
      title: "Error",
      description: "No se pudo procesar la imagen del documento.",
      variant: "destructive",
    });
    setIsLoading(false);
    return; // Detener el envío si falla la conversión
  }
} else {
  // Opcional: Manejar el caso donde documentPhoto es null aunque se haya validado antes
  toast({
    title: "Foto requerida",
    description: "Debes tomar una foto de tu documento de identidad.",
    variant: "destructive",
  });
  setIsLoading(false);
  return;
}

      // --- Enviar solicitud al backend ---
      const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'; // Ajusta en .env.local
      console.log(BACKEND_URL,"sfsdf", formData)
      const res = await fetch(`${BACKEND_URL}/profile/verify-profile`, {
        method: 'POST',
        body: formData, // Enviar FormData
        credentials: 'include' // Si usas cookies en lugar de Bearer Token
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Error del servidor:", res.status, errorData);
        throw new Error(errorData.message || `Error al enviar solicitud: ${res.status} ${res.statusText}`);
      }

      const responseData = await res.json();
      console.log('Solicitud de verificación enviada con éxito:', responseData);

      toast({
        title: "¡Solicitud enviada!",
        description: responseData.message || "Tu solicitud de verificación ha sido enviada. Te contactaremos pronto.",
      });
      router.push('/profile'); // O redirige a donde corresponda

    } catch (error: any) {
      console.error("Error al enviar la solicitud:", error);
      toast({
        title: "Error al enviar",
        description: error.message || "Hubo un problema al enviar tu solicitud. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="container py-8 px-4 md:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Verificación de Perfil</h1>
        <p className="text-muted-foreground">
          Completa tu información personal para verificar tu cuenta y acceder a todas las funcionalidades
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Información Personal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
              <CardDescription>
                Completa tus datos personales básicos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido</FormLabel>
                      <FormControl>
                        <Input placeholder="Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo Electrónico</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="juan@ejemplo.com" {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input 
                            placeholder="+52 55 1234 5678" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              setIsPhoneVerified(false);
                            }}
                            id="phone-input"
                          />
                          {!isPhoneVerified && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setShowPhoneVerification(true)}
                              disabled={!field.value || field.value.length < 10}
                            >
                              Verificar número
                            </Button>
                          )}
                          {isPhoneVerified && (
                            <div className="flex items-center gap-2 text-green-600 text-sm">
                              <CheckCircle className="h-4 w-4" />
                              <span>Número verificado</span>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {showPhoneVerification && !isPhoneVerified && (
                <Card>
                  <CardHeader>
                    <CardTitle>Verificación de Teléfono</CardTitle>
                    <CardDescription>
                      Enviaremos un SMS al numero que ves, para confirmar el numero
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PhoneVerification
                      phone={form.watch('phone')}
                      onVerified={() => {
                        setIsPhoneVerified(true);
                        setShowPhoneVerification(false);
                        form.setValue('phoneVerified', true);
                      }}
                      onPhoneChange={() => {
                        setShowPhoneVerification(false);
                        document.getElementById('phone-input')?.focus();
                      }}
                    />
                  </CardContent>
                </Card>
              )}


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Nacimiento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ocupación</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingeniero, Médico, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biografía (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Cuéntanos un poco sobre ti..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documentación
              </CardTitle>
              <CardDescription>
                Proporciona tu documento de identidad oficial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Documento</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {documentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="documentNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Documento</FormLabel>
                      <FormControl>
                        <Input placeholder="123456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Foto del documento usando PhotoSlot */}
              <div>
                <Label className="text-base font-medium">Foto del Documento</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Toma una foto clara de tu documento de identidad
                </p>

               <PhotoSlot
                  template={{
    id: 1,
    label: "Documento de Identidad",
    description: "Toma una foto clara de tu documento oficial",
    required: true,
    referenceImage: "/images/document-placeholder.jpg",
    guidanceImage: "/images/document-frame.png",
    aspectRatio: "1/1" // Valor literal exacto
  }}
                  capturedPhoto={documentPhoto ? { 
                    templateId: documentTemplate.id, 
                    imageUrl: documentPhoto 
                  } : undefined}
                  onCapture={() => setShowCameraModal(true)}
                  onDelete={() => setDocumentPhoto(null)}
                  onRetake={() => setShowCameraModal(true)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Dirección */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Dirección
              </CardTitle>
              <CardDescription>
                Proporciona tu dirección actual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección Completa</FormLabel>
                    <FormControl>
                      <Input placeholder="Calle, número" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad</FormLabel>
                      <FormControl>
                        <Input placeholder="Ciudad " {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="CAR" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código Postal</FormLabel>
                      <FormControl>
                        <Input placeholder="12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Mapa de Ubicaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Ubicación de Verificación
              </CardTitle>
              <CardDescription>
                Selecciona la sucursal más cercana a ti para completar tu verificación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedLocation && (
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Ubicación Seleccionada</h3>
                    </div>
                    <p className="font-medium">{selectedLocation.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedLocation.address}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {predefinedLocations.map((location) => (
                    <div
                      key={location.id}
                      className={cn(
                        "p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md",
                        selectedLocation?.id === location.id
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary/50"
                      )}
                      onClick={() => handleLocationSelect(location)}
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className={cn(
                          "h-5 w-5 mt-0.5",
                          selectedLocation?.id === location.id ? "text-primary" : "text-muted-foreground"
                        )} />
                        <div className="flex-1">
                          <h3 className="font-medium">{location.name}</h3>
                          <p className="text-sm text-muted-foreground">{location.address}</p>
                          {selectedLocation?.id === location.id && (
                            <Badge className="mt-2">Seleccionada</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rol Solicitado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Tipo de Cuenta
              </CardTitle>
              <CardDescription>
                Selecciona el tipo de cuenta que deseas tener
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="requestedRole"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableRoles.map((role) => (
                          <div
                            key={role.value}
                            className={cn(
                              "p-4 border rounded-lg cursor-pointer transition-all",
                              field.value === role.value
                                ? "border-primary bg-primary/5"
                                : "border-muted hover:border-primary/50"
                            )}
                            onClick={() => field.onChange(role.value)}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className={cn(
                                "w-4 h-4 rounded-full border-2",
                                field.value === role.value
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground"
                              )}>
                                {field.value === role.value && (
                                  <div className="w-full h-full rounded-full bg-white scale-50" />
                                )}
                              </div>
                              <h3 className="font-medium">{role.label}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">{role.description}</p>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Botón de envío */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold mb-2">¿Listo para enviar tu solicitud?</h3>
                  <p className="text-sm text-muted-foreground">
                    Revisa que toda la información esté completa y correcta
                  </p>
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className="w-full max-w-md"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando Solicitud...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Enviar Solicitud de Verificación
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>

      {/* CameraModal para capturar la foto del documento */}
      <CameraModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onCapture={handleCaptureDocument}
        template={{
    id: 1,
    label: "Documento de Identidad",
    description: "Toma una foto clara de tu documento oficial",
    required: true,
    referenceImage: "/images/document-placeholder.jpg",
    guidanceImage: "/images/document-frame.png",
    aspectRatio: "1/1" // Valor literal exacto
  }}
      />
    </div>
  );
}

export default function ProfileVerificationPage() {
  return (
    <ProtectedRoute requiredRoles={['Taller', 'Usuario', 'Administrador']}>
      <VerificationContent />
    </ProtectedRoute>
  );
}