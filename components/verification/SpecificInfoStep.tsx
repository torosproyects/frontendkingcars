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
        <FormField
          control={form.control}
          name="particularData.numeroReciboServicio"
          render={({ field }) => (
            <FormItem>
              <ValidationLabel 
                show={!field.value || field.value.length < 1} 
                message="Número de recibo requerido" 
              />
              <FormLabel>Número de Recibo de Servicio</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ej: 2024-001234" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="autonomoData.altaAutonomo"
          render={({ field }) => (
            <FormItem>
              <ValidationLabel 
                show={!field.value || field.value.length < 1} 
                message="Alta de autónomo requerida" 
              />
              <FormLabel>Alta de Autónomo</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ej: Alta 15/03/2024" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="autonomoData.reta"
          render={({ field }) => (
            <FormItem>
              <ValidationLabel 
                show={!field.value || field.value.length < 1} 
                message="RETA requerido" 
              />
              <FormLabel>RETA</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ej: RETA-2024-001" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        
        <FormField
          control={form.control}
          name="empresaData.numeroEscrituraConstitucion"
          render={({ field }) => (
            <FormItem>
              <ValidationLabel 
                show={!field.value || field.value.length < 1} 
                message="Número de escritura requerido" 
              />
              <FormLabel>Número de Escritura de Constitución</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ej: Escritura 1234 de 15/03/2024" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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