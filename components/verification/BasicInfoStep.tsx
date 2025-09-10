'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { User, Mail } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { VerificationData } from '@/types/verification';
import { ValidationLabel } from './ValidationLabel';

interface BasicInfoStepProps {
  form: UseFormReturn<VerificationData>;
}

export function BasicInfoStep({ form }: BasicInfoStepProps) {
  const watchedData = form.watch();
  
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="text-center px-4">
        <h2 className="text-xl md:text-2xl font-bold mb-2">Información Básica</h2>
        <p className="text-sm md:text-base text-gray-600">
          Completa tus datos personales básicos
        </p>
      </div>

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
        
        <CardContent className="space-y-4 p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <ValidationLabel 
                    show={!field.value || field.value.length < 2} 
                    message="Nombre requerido" 
                  />
                  <FormLabel className="text-sm md:text-base">Nombre</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Juan" 
                      className="h-10 md:h-11"
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
                  <FormLabel className="text-sm md:text-base">Apellidos</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Pérez García" 
                      className="h-10 md:h-11"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <ValidationLabel 
                  show={!field.value || !field.value.includes('@')} 
                  message="Email requerido" 
                />
                <FormLabel className="flex items-center gap-2 text-sm md:text-base">
                  <Mail className="h-4 w-4" />
                  Email
                </FormLabel>
                <FormControl>
                  <Input 
                    type="email"
                    placeholder="juan.perez@email.com" 
                    className="h-10 md:h-11"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
