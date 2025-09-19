"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalData } from '@/types/car-evaluation-json';
import { Fuel, Battery, Gauge, Zap } from 'lucide-react';

interface ExternalDataPanelProps {
  data: ExternalData;
  onUpdate: (data: Partial<ExternalData>) => void;
}

export function ExternalDataPanel({ data, onUpdate }: ExternalDataPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge size={20} />
          Datos Externos del Vehículo
        </CardTitle>
        <CardDescription>
          Información obtenida de sensores y sistemas externos
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Kilometraje */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            <Gauge size={16} />
            Kilometraje
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={data.kilometraje.value}
              onChange={(e) => onUpdate({
                kilometraje: {
                  ...data.kilometraje,
                  value: parseInt(e.target.value) || 0,
                  timestamp: new Date().toISOString()
                }
              })}
              className="flex-1"
            />
            <Select
              value={data.kilometraje.unit}
              onValueChange={(value: 'km' | 'miles') => onUpdate({
                kilometraje: {
                  ...data.kilometraje,
                  unit: value,
                  timestamp: new Date().toISOString()
                }
              })}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="km">km</SelectItem>
                <SelectItem value="miles">mi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={data.kilometraje.source}
              onValueChange={(value: 'manual' | 'odometer' | 'external_system') => onUpdate({
                kilometraje: {
                  ...data.kilometraje,
                  source: value,
                  timestamp: new Date().toISOString()
                }
              })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="odometer">Odómetro</SelectItem>
                <SelectItem value="external_system">Sistema Externo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Combustible */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            <Fuel size={16} />
            Nivel de Combustible
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              max="100"
              value={data.fuel.level}
              onChange={(e) => onUpdate({
                fuel: {
                  ...data.fuel,
                  level: parseInt(e.target.value) || 0,
                  timestamp: new Date().toISOString()
                }
              })}
              className="flex-1"
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
          <Select
            value={data.fuel.type}
            onValueChange={(value: 'gasolina' | 'diesel' | 'electric' | 'hybrid') => onUpdate({
              fuel: {
                ...data.fuel,
                type: value,
                timestamp: new Date().toISOString()
              }
            })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gasolina">Gasolina</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="electric">Eléctrico</SelectItem>
              <SelectItem value="hybrid">Híbrido</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Batería */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            <Battery size={16} />
            Batería
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              max="100"
              value={data.battery?.level || 0}
              onChange={(e) => onUpdate({
                battery: {
                  level: parseInt(e.target.value) || 0,
                  voltage: data.battery?.voltage || 12.4,
                  source: data.battery?.source || 'manual',
                  timestamp: new Date().toISOString()
                }
              })}
              className="flex-1"
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
          {data.battery?.voltage && (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.1"
                value={data.battery.voltage}
                onChange={(e) => onUpdate({
                  battery: {
                    ...data.battery!,
                    voltage: parseFloat(e.target.value) || 0,
                    timestamp: new Date().toISOString()
                  }
                })}
                className="flex-1"
              />
              <span className="text-sm text-gray-500">V</span>
            </div>
          )}
        </div>

        {/* Presión de Neumáticos */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            <Zap size={16} />
            Presión Neumáticos
          </Label>
          {data.tirePressure ? (
            <div className="space-y-1">
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="flex justify-between">
                  <span>FL:</span>
                  <Input
                    type="number"
                    value={data.tirePressure.frontLeft}
                    onChange={(e) => onUpdate({
                      tirePressure: {
                        ...data.tirePressure!,
                        frontLeft: parseInt(e.target.value) || 0,
                        timestamp: new Date().toISOString()
                      }
                    })}
                    className="h-6 w-12 text-xs"
                  />
                </div>
                <div className="flex justify-between">
                  <span>FR:</span>
                  <Input
                    type="number"
                    value={data.tirePressure.frontRight}
                    onChange={(e) => onUpdate({
                      tirePressure: {
                        ...data.tirePressure!,
                        frontRight: parseInt(e.target.value) || 0,
                        timestamp: new Date().toISOString()
                      }
                    })}
                    className="h-6 w-12 text-xs"
                  />
                </div>
                <div className="flex justify-between">
                  <span>RL:</span>
                  <Input
                    type="number"
                    value={data.tirePressure.rearLeft}
                    onChange={(e) => onUpdate({
                      tirePressure: {
                        ...data.tirePressure!,
                        rearLeft: parseInt(e.target.value) || 0,
                        timestamp: new Date().toISOString()
                      }
                    })}
                    className="h-6 w-12 text-xs"
                  />
                </div>
                <div className="flex justify-between">
                  <span>RR:</span>
                  <Input
                    type="number"
                    value={data.tirePressure.rearRight}
                    onChange={(e) => onUpdate({
                      tirePressure: {
                        ...data.tirePressure!,
                        rearRight: parseInt(e.target.value) || 0,
                        timestamp: new Date().toISOString()
                      }
                    })}
                    className="h-6 w-12 text-xs"
                  />
                </div>
              </div>
              <Select
                value={data.tirePressure.unit}
                onValueChange={(value: 'psi' | 'bar') => onUpdate({
                  tirePressure: {
                    ...data.tirePressure!,
                    unit: value,
                    timestamp: new Date().toISOString()
                  }
                })}
              >
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="psi">PSI</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdate({
                tirePressure: {
                  frontLeft: 32,
                  frontRight: 32,
                  rearLeft: 32,
                  rearRight: 32,
                  unit: 'psi',
                  source: 'manual',
                  timestamp: new Date().toISOString()
                }
              })}
              className="w-full"
            >
              Agregar Presión
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
