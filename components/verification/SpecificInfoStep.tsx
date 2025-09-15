'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { VerificationData } from '@/types/verification';
import { User, Building2, Briefcase, Phone, Mail } from 'lucide-react';
import { ValidationLabel } from './ValidationLabel';

interface SpecificInfoStepProps {
  form: UseFormReturn<VerificationData>;
  accountType: 'Particular' | 'Empresa' | 'Autónomo';
}

export function SpecificInfoStep({ form, accountType }: SpecificInfoStepProps) {
  const renderParticularForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Información del Particular
        </CardTitle>
        <CardDescription>
          Datos específicos para usuarios particulares
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            Como usuario particular, no necesitas información adicional específica. 
            Todos los datos requeridos ya han sido completados en el paso anterior.
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderAutonomoForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Información del Autónomo
        </CardTitle>
        <CardDescription>
          Datos específicos de tu actividad autónoma
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="autonomoData.nombreComercial"
          render={({ field }) => (
            <FormItem>
              <ValidationLabel 
                show={!field.value || field.value.length < 2} 
                message="Nombre comercial requerido" 
              />
              <FormLabel>Nombre Comercial</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Pérez Automoción" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="autonomoData.cif"
          render={({ field }) => (
            <FormItem>
              <ValidationLabel 
                show={!field.value || field.value.length < 9} 
                message="CIF requerido" 
              />
              <FormLabel>CIF</FormLabel>
              <FormControl>
                <Input 
                  placeholder="A12345678" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="autonomoData.numeroRegistro"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Registro de Autónomo</FormLabel>
              <FormControl>
                <Input 
                  placeholder="AUT-2024-001" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="autonomoData.telefono"
            render={({ field }) => (
              <FormItem>
                <ValidationLabel 
                  show={!field.value || field.value.length < 9} 
                  message="Teléfono requerido" 
                />
                <FormLabel className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Teléfono
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="+34 600 123 456" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="autonomoData.email"
            render={({ field }) => (
              <FormItem>
                <ValidationLabel 
                  show={!field.value || !field.value.includes('@')} 
                  message="Email requerido" 
                />
                <FormLabel className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </FormLabel>
                <FormControl>
                  <Input 
                    type="email"
                    placeholder="contacto@perezautomocion.com" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderEmpresaForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Información de la Empresa
        </CardTitle>
        <CardDescription>
          Datos específicos de tu empresa
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="empresaData.razonSocial"
          render={({ field }) => (
            <FormItem>
              <ValidationLabel 
                show={!field.value || field.value.length < 2} 
                message="Razón social requerida" 
              />
              <FormLabel>Razón Social</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Pérez Automoción S.L." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="empresaData.cif"
          render={({ field }) => (
            <FormItem>
              <ValidationLabel 
                show={!field.value || field.value.length < 9} 
                message="CIF requerido" 
              />
              <FormLabel>CIF</FormLabel>
              <FormControl>
                <Input 
                  placeholder="B12345678" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="empresaData.telefono"
            render={({ field }) => (
              <FormItem>
                <ValidationLabel 
                  show={!field.value || field.value.length < 9} 
                  message="Teléfono requerido" 
                />
                <FormLabel className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Teléfono
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="+34 91 123 4567" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="empresaData.emailCorporativo"
            render={({ field }) => (
              <FormItem>
                <ValidationLabel 
                  show={!field.value || !field.value.includes('@')} 
                  message="Email corporativo requerido" 
                />
                <FormLabel className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Corporativo
                </FormLabel>
                <FormControl>
                  <Input 
                    type="email"
                    placeholder="info@perezautomocion.com" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Representante Legal */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-4">Representante Legal</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="empresaData.representanteLegal.nombre"
              render={({ field }) => (
                <FormItem>
                  <ValidationLabel 
                    show={!field.value || field.value.length < 2} 
                    message="Nombre del representante requerido" 
                  />
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Juan Pérez García" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="empresaData.representanteLegal.dni"
              render={({ field }) => (
                <FormItem>
                  <ValidationLabel 
                    show={!field.value || field.value.length < 8} 
                    message="DNI del representante requerido" 
                  />
                  <FormLabel>DNI/NIE</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="12345678A" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <FormField
              control={form.control}
              name="empresaData.representanteLegal.cargo"
              render={({ field }) => (
                <FormItem>
                  <ValidationLabel 
                    show={!field.value || field.value.length < 2} 
                    message="Cargo requerido" 
                  />
                  <FormLabel>Cargo</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Administrador" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="empresaData.representanteLegal.telefono"
              render={({ field }) => (
                <FormItem>
                  <ValidationLabel 
                    show={!field.value || field.value.length < 9} 
                    message="Teléfono del representante requerido" 
                  />
                  <FormLabel className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Teléfono
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="+34 600 123 456" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="empresaData.representanteLegal.email"
            render={({ field }) => (
              <FormItem className="mt-4">
                <ValidationLabel 
                  show={!field.value || !field.value.includes('@')} 
                  message="Email del representante requerido" 
                />
                <FormLabel className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </FormLabel>
                <FormControl>
                  <Input 
                    type="email"
                    placeholder="juan.perez@perezautomocion.com" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="text-center px-4">
        <h2 className="text-xl md:text-2xl font-bold mb-2">Información Específica</h2>
        <p className="text-sm md:text-base text-gray-600">
          Completa los datos específicos para tu tipo de cuenta: {accountType}
        </p>
      </div>

      {accountType === 'Particular' && renderParticularForm()}
      {accountType === 'Autónomo' && renderAutonomoForm()}
      {accountType === 'Empresa' && renderEmpresaForm()}
    </div>
  );
}