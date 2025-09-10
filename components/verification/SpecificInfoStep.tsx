'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { VerificationData, spanishProvinces } from '@/types/verification';
import { Wrench, User, Building2, MapPin, Phone, Mail } from 'lucide-react';
import { ValidationLabel } from './ValidationLabel';

interface SpecificInfoStepProps {
  form: UseFormReturn<VerificationData>;
  accountType: 'Taller' | 'Usuario' | 'Empresa';
}

export function SpecificInfoStep({ form, accountType }: SpecificInfoStepProps) {
  const renderTallerForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Información del Taller
        </CardTitle>
        <CardDescription>
          Datos específicos de tu taller mecánico
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="tallerData.nombreTaller"
          render={({ field }) => (
            <FormItem>
              <ValidationLabel 
                show={!field.value || field.value.length < 2} 
                message="Nombre del taller requerido" 
              />
              <FormLabel>Nombre del Taller</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Taller Pérez Automoción" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="tallerData.cif"
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
          name="tallerData.numeroRegistro"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Registro de Taller</FormLabel>
              <FormControl>
                <Input 
                  placeholder="REG-2024-001" 
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
            name="tallerData.direccion"
            render={({ field }) => (
              <FormItem>
                <ValidationLabel 
                  show={!field.value || field.value.length < 10} 
                  message="Dirección requerida" 
                />
                <FormLabel className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Dirección
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Calle Mayor 123" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tallerData.codigoPostal"
            render={({ field }) => (
              <FormItem>
                <ValidationLabel 
                  show={!field.value || field.value.length < 5} 
                  message="Código postal requerido" 
                />
                <FormLabel>Código Postal</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="28001" 
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
          name="tallerData.provincia"
          render={({ field }) => (
            <FormItem>
              <ValidationLabel 
                show={!field.value || field.value === ''} 
                message="Provincia requerida" 
              />
              <FormLabel>Provincia</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una provincia" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {spanishProvinces.map((provincia) => (
                    <SelectItem key={provincia} value={provincia}>
                      {provincia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="tallerData.telefono"
            render={({ field }) => (
              <FormItem>
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
            name="tallerData.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </FormLabel>
                <FormControl>
                  <Input 
                    type="email"
                    placeholder="info@tallerperez.com" 
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

  const renderUsuarioForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Información Personal
        </CardTitle>
        <CardDescription>
          Datos específicos para usuarios particulares
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="usuarioData.dni"
          render={({ field }) => (
            <FormItem>
              <ValidationLabel 
                show={!field.value || field.value.length < 9} 
                message="DNI/NIE requerido" 
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
        
        <FormField
          control={form.control}
          name="usuarioData.fechaNacimiento"
          render={({ field }) => (
            <FormItem>
              <ValidationLabel 
                show={!field.value || field.value === ''} 
                message="Fecha de nacimiento requerida" 
              />
              <FormLabel>Fecha de Nacimiento</FormLabel>
              <FormControl>
                <Input 
                  type="date"
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
            name="usuarioData.direccion"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Dirección
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Calle Mayor 123" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="usuarioData.codigoPostal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código Postal</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="28001" 
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
          name="usuarioData.provincia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provincia</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una provincia" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {spanishProvinces.map((provincia) => (
                    <SelectItem key={provincia} value={provincia}>
                      {provincia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );

  const renderEmpresaForm = () => (
    <div className="space-y-6">
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
                <FormLabel>Razón Social</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Automóviles García S.L." 
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
              name="empresaData.direccionFiscal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Dirección Fiscal
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Calle Mayor 123" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="empresaData.codigoPostal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código Postal</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="28001" 
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
            name="empresaData.provincia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provincia</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una provincia" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {spanishProvinces.map((provincia) => (
                      <SelectItem key={provincia} value={provincia}>
                        {provincia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Corporativo
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="info@empresagarcia.com" 
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Representante Legal
          </CardTitle>
          <CardDescription>
            Datos del representante legal de la empresa
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="empresaData.representanteLegal.nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="María García López" 
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
          
          <FormField
            control={form.control}
            name="empresaData.representanteLegal.cargo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo en la Empresa</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Gerente General" 
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
              name="empresaData.representanteLegal.telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Teléfono
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="+34 612 345 678" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="empresaData.representanteLegal.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="maria.garcia@empresa.com" 
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
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Información Específica</h2>
        <p className="text-gray-600">
          Completa los datos específicos para tu tipo de cuenta: {accountType}
        </p>
      </div>

      {accountType === 'Taller' && renderTallerForm()}
      {accountType === 'Usuario' && renderUsuarioForm()}
      {accountType === 'Empresa' && renderEmpresaForm()}
    </div>
  );
}
