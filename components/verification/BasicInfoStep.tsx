'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { User, Mail, Calendar, FileText, MapPin, Globe, Building, CheckCircle, Loader2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { VerificationData, validateAge, validateDocument } from '@/types/verification';
import { ValidationLabel } from './ValidationLabel';
import { useToast } from '@/hooks/use-toast';
import { 
  europeanCountries, 
  getPostalCodeData, 
  processPostalCodeResponse, 
  shouldCallPostalAPI,
  validatePostalCode 
} from '@/lib/services/postal-code-service';

interface BasicInfoStepProps {
  form: UseFormReturn<VerificationData>;
}

// Función debounce personalizada
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function BasicInfoStep({ form }: BasicInfoStepProps) {
  const { toast } = useToast();
  const watchedData = form.watch();
  
  // Estados para la API de códigos postales
  const [isLoadingPostalData, setIsLoadingPostalData] = useState(false);
  const [postalCodeError, setPostalCodeError] = useState<string | null>(null);
  
  // Debounce para código postal
  const debouncedPostalCode = useDebounce(watchedData.codigoPostal, 500);
  
  // Efecto para llamar a la API cuando cambien código postal o país
  useEffect(() => {
    const fetchPostalData = async () => {
      if (!shouldCallPostalAPI(debouncedPostalCode, watchedData.pais)) {
        return;
      }

      setIsLoadingPostalData(true);
      setPostalCodeError(null);

      try {
        const data = await getPostalCodeData(debouncedPostalCode, watchedData.pais);
        
        if (data) {
          console.log('🔍 [BasicInfoStep] Datos recibidos de la API:', data);
          const processedData = processPostalCodeResponse(data);
          console.log('🔄 [BasicInfoStep] Datos procesados:', processedData);
          
          if (processedData) {
            // Limpiar cualquier error anterior
            setPostalCodeError(null);
            
            // Llenar campos automáticamente
            console.log('📝 [BasicInfoStep] Llenando campos:', {
              ciudad: processedData.city,
              estado: processedData.state
            });
            
            form.setValue('ciudad', processedData.city);
            form.setValue('estado', processedData.state);
            
            // Verificar que los valores se establecieron
            setTimeout(() => {
              console.log('✅ [BasicInfoStep] Valores después de setValue:', {
                ciudad: form.getValues('ciudad'),
                estado: form.getValues('estado')
              });
            }, 100);
            
            toast({
              title: "Información encontrada",
              description: `Ciudad: ${processedData.city}, Estado: ${processedData.state}`,
            });
          } else {
            console.log('⚠️ [BasicInfoStep] No se pudieron procesar los datos');
            // Si no hay datos procesados, limpiar error pero no mostrar toast
            setPostalCodeError(null);
          }
        } else {
          throw new Error('No se encontraron datos para este código postal');
        }
      } catch (error) {
        setPostalCodeError('No se pudo obtener la información de ubicación');
        toast({
          title: "Información no encontrada",
          description: "No se pudo obtener la información de ubicación. Puedes completar los campos manualmente.",
          variant: "default"
        });
      } finally {
        setIsLoadingPostalData(false);
      }
    };

    fetchPostalData();
  }, [debouncedPostalCode, watchedData.pais, form, toast]);

  // Validación visual del código postal
  const isPostalCodeValid = useMemo(() => {
    return validatePostalCode(watchedData.codigoPostal, watchedData.pais);
  }, [watchedData.codigoPostal, watchedData.pais]);

  // Limpiar error cuando el usuario cambie el código postal o país
  useEffect(() => {
    if (postalCodeError && (watchedData.codigoPostal || watchedData.pais)) {
      setPostalCodeError(null);
    }
  }, [watchedData.codigoPostal, watchedData.pais, postalCodeError]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Información Básica</h2>
        <p className="text-gray-600 text-sm md:text-base">
          Completa tus datos personales básicos
        </p>
      </div>

      {/* Datos Personales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Datos Personales
          </CardTitle>
          <CardDescription>
            Información básica requerida para tu cuenta
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8 p-6 md:p-8">
          {/* Nombre y Apellidos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <ValidationLabel 
                    show={!field.value || field.value.length < 2} 
                    message="Nombre requerido" 
                  />
                  <FormLabel className="text-base font-medium">Nombre</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Juan" 
                      className="h-11"
                      {...field} 
                    />
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
                  <ValidationLabel 
                    show={!field.value || field.value.length < 2} 
                    message="Apellido requerido" 
                  />
                  <FormLabel className="text-base font-medium">Apellidos</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Pérez García" 
                      className="h-11"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <ValidationLabel 
                  show={!field.value || !field.value.includes('@')} 
                  message="Email requerido" 
                />
                <FormLabel className="flex items-center gap-2 text-base font-medium">
                  <Mail className="h-4 w-4" />
                  Email
                </FormLabel>
                <FormControl>
                  <Input 
                    type="email"
                    placeholder="juan.perez@email.com" 
                    className="h-11 bg-gray-50"
                    readOnly
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Fecha de Nacimiento */}
          <FormField
            control={form.control}
            name="fechaNacimiento"
            render={({ field }) => {
              // Calcular la fecha máxima permitida (hace 20 años desde hoy)
              const today = new Date();
              const maxDate = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
              const maxDateString = maxDate.toISOString().split('T')[0];
              
              // Calcular la fecha mínima permitida (hace 100 años desde hoy)
              const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
              const minDateString = minDate.toISOString().split('T')[0];
              
              return (
                <FormItem>
                  <ValidationLabel 
                    show={!!(field.value && !validateAge(field.value))} 
                    message="Debes ser mayor de 20 años" 
                  />
                  <FormLabel className="flex items-center gap-2 text-base font-medium">
                    <Calendar className="h-4 w-4" />
                    Fecha de Nacimiento
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="date"
                      className="h-11"
                      min={minDateString}
                      max={maxDateString}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* Documento */}
          <div className="space-y-6">
            <h4 className="text-lg font-medium flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documento de Identidad
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
              <FormField
                control={form.control}
                name="documento.tipo"
                render={({ field }) => (
                  <FormItem>
                    <ValidationLabel 
                      show={!field.value} 
                      message="Tipo requerido" 
                    />
                    <FormLabel className="text-sm font-medium">Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DNI">DNI</SelectItem>
                        <SelectItem value="NIE">NIE</SelectItem>
                        <SelectItem value="NIF">NIF</SelectItem>
                        <SelectItem value="TIE">TIE</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="documento.numero"
                render={({ field }) => (
                  <FormItem className="md:col-span-3">
                    <ValidationLabel 
                      show={!field.value || !validateDocument(watchedData.documento.tipo, field.value)} 
                      message="Número inválido" 
                    />
                    <FormLabel className="text-sm font-medium">Número</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="12345678A"
                        className="h-11"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dirección */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Dirección
          </CardTitle>
          <CardDescription>
            Información de ubicación para tu cuenta
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8 p-6 md:p-8">
          {/* Dirección */}
          <FormField
            control={form.control}
            name="direccion"
            render={({ field }) => (
              <FormItem>
                <ValidationLabel 
                  show={!field.value || field.value.length < 5} 
                  message="Dirección requerida" 
                />
                <FormLabel className="text-base font-medium">Dirección</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Calle Mayor 123"
                    className="h-11"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Código Postal y País */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <FormField
              control={form.control}
              name="codigoPostal"
              render={({ field }) => (
                <FormItem>
                  <ValidationLabel 
                    show={!field.value || !isPostalCodeValid} 
                    message="Código postal inválido" 
                  />
                  <FormLabel className="text-base font-medium">Código Postal</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="28001"
                        className={`h-11 ${
                          isPostalCodeValid && field.value ? 'border-green-500' : ''
                        }`}
                        {...field} 
                      />
                      {isLoadingPostalData && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                        </div>
                      )}
                      {isPostalCodeValid && field.value && !isLoadingPostalData && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  {isPostalCodeValid && field.value && (
                    <div className="flex items-center text-green-600 text-sm mt-1">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Formato válido
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pais"
              render={({ field }) => (
                <FormItem>
                  <ValidationLabel 
                    show={!field.value} 
                    message="País requerido" 
                  />
                  <FormLabel className="flex items-center gap-2 text-base font-medium">
                    <Globe className="h-4 w-4" />
                    País
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Seleccionar país" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {europeanCountries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Ciudad y Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <FormField
              control={form.control}
              name="ciudad"
              render={({ field }) => (
                <FormItem>
                  <ValidationLabel 
                    show={!field.value || field.value.length < 2} 
                    message="Ciudad requerida" 
                  />
                  <FormLabel className="flex items-center gap-2 text-base font-medium">
                    <Building className="h-4 w-4" />
                    Ciudad
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Madrid"
                      className="h-11"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <ValidationLabel 
                    show={!field.value || field.value.length < 2} 
                    message="Estado/Provincia requerido" 
                  />
                  <FormLabel className="text-base font-medium">Estado/Provincia</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Madrid"
                      className="h-11"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {postalCodeError && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">{postalCodeError}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}