'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
    Car,
    DollarSign,
    Clock,
    CalendarIcon,
    AlertCircle,
    CheckCircle,
    Gavel,
    TrendingUp,
    Shield,
    Info,
} from 'lucide-react';
import { Car as CarType, CreateAuctionData } from '@/lib/types/auction';
import { useAuctionStore } from '@/lib/store/auctions-store';
import { ApiService } from '@/lib/service/api-service';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CreateAuctionFormProps {
    currentUser: { id: string; name: string };
}

export function CreateAuctionForm({ currentUser }: CreateAuctionFormProps) {
    const router = useRouter();
    const { createAuction, loading, error, userCars, loadingCars } = useAuctionStore();
    const [selectedCar, setSelectedCar] = useState<CarType | null>(null);
    const [visitedTabs, setVisitedTabs] = useState<Set<string>>(new Set());
    const [formData, setFormData] = useState<CreateAuctionData>({
        carId: '',
        startPrice: 0,
        reservePrice: undefined,
        duration: 24,
        startImmediately: true,
        scheduledStartTime: undefined,
    });
    const [step, setStep] = useState(1);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [showSuccess, setShowSuccess] = useState(false);

    // Maneja la redirección después de un éxito
    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => {
                router.push('/auctions');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess, router]);

    const handleCancel = () => {
        router.back();
    };

    const validateStep1 = () => {
        const errors: Record<string, string> = {};
        if (!selectedCar) {
            errors.car = 'Debes seleccionar un carro';
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateStep2 = () => {
        const errors: Record<string, string> = {};

        if (!formData.startPrice || formData.startPrice <= 0) {
            errors.startPrice = 'El precio inicial debe ser mayor a $0';
        }

        if (selectedCar && formData.startPrice > selectedCar.estimatedValue * 0.9) {
            errors.startPrice = 'El precio inicial no puede ser mayor al 90% del valor estimado';
        }

        if (formData.reservePrice && formData.reservePrice <= formData.startPrice) {
            errors.reservePrice = 'El precio de reserva debe ser mayor al precio inicial';
        }

        if (formData.duration < 1 || formData.duration > 168) {
            errors.duration = 'La duración debe estar entre 1 y 168 horas (7 días)';
        }

        if (!formData.startImmediately && !formData.scheduledStartTime) {
            errors.scheduledStartTime = 'Debes seleccionar una fecha de inicio';
        }

        if (formData.scheduledStartTime && new Date(formData.scheduledStartTime) <= new Date()) {
            errors.scheduledStartTime = 'La fecha de inicio debe ser futura';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCarSelect = (car: CarType) => {
        setSelectedCar(car);
        setFormData((prev) => ({
            ...prev,
            carId: car.id,
            startPrice: Math.floor(car.estimatedValue),
        }));
        setVisitedTabs(new Set());
        setValidationErrors({});
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
        } else if (step === 2) {
            if (visitedTabs.size < 2) {
                setValidationErrors((prev) => ({
                    ...prev,
                    tabs: 'Por favor, revisa al menos dos secciones antes de continuar.',
                }));
                return;
            }
            if (validateStep2()) {
                setStep(3);
            }
        }
    };

    const handleSubmit = async () => {
        if (!validateStep2() || !selectedCar) return;
        
        const success = await createAuction(formData, currentUser.id, currentUser.name, () => {
            setShowSuccess(true);
        });

    };

    const getSuggestedPrices = () => {
        if (!selectedCar) return [];
        const estimated = selectedCar.estimatedValue;
        return [
            { label: 'Conservador', value: Math.floor(estimated * 0.7), desc: '70% del valor estimado' },
            { label: 'Equilibrado', value: Math.floor(estimated * 1), desc: '100% del valor estimado' },
            { label: 'Agresivo', value: Math.floor(estimated * 1.1), desc: '110% del valor estimado' },
        ];
    };

    if (loadingCars) {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Cargando tus carros...</h3>
                </CardContent>
            </Card>
        );
    }

    if (userCars.length === 0) {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardContent className="p-8 text-center">
                    <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes carros disponibles</h3>
                    <p className="text-gray-600 mb-6">
                        Todos tus carros están actualmente en subasta o no tienes carros registrados.
                    </p>
                    <Button onClick={handleCancel} variant="outline">
                        Volver
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (showSuccess) {
        return (
            <Card className="max-w-md mx-auto">
                <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Subasta creada exitosamente!</h2>
                    <p className="text-gray-600 mb-6">
                        Tu subasta ha sido publicada y ya está disponible para los compradores.
                    </p>
                    <div className="space-y-3">
                        <Button onClick={() => router.push('/auctions')} className="w-full bg-gradient-to-r from-green-600 to-blue-600">
                            Ver todas las subastas
                        </Button>
                        <Button onClick={() => router.push('/profile/auctions')} variant="outline" className="w-full">
                            Ver mis subastas
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        {[1, 2, 3].map((stepNumber) => (
                            <div key={stepNumber} className="flex items-center">
                                <div
                                    className={cn(
                                        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                                        step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                                    )}
                                >
                                    {step > stepNumber ? <CheckCircle className="h-4 w-4" /> : stepNumber}
                                </div>
                                {stepNumber < 3 && (
                                    <div
                                        className={cn(
                                            'w-16 h-1 mx-2 transition-all',
                                            step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                                        )}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                        <span className={step >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Seleccionar Carro</span>
                        <span className={step >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Configurar Subasta</span>
                        <span className={step >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Confirmar</span>
                    </div>
                </CardContent>
            </Card>

            {step === 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Car className="h-5 w-5 text-blue-600" />
                            Selecciona el carro para subastar
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {userCars.map((car) => (
                                <div
                                    key={car.id}
                                    onClick={() => handleCarSelect(car)}
                                    className={cn(
                                        'border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md',
                                        selectedCar?.id === car.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                                    )}
                                >
                                    {car && (
                                        <div className="flex gap-4">
                                            <Image
                                                src={car.imagen}
                                                alt={`${car.make} ${car.model}`}
                                                width={80}
                                                height={80}
                                                className="object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg">
                                                    {car.year} {car.make} {car.model}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {car.mileage.toLocaleString()} km • {car.color}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <Badge variant={car.condition === 'nuevo' ? 'default' : 'secondary'}>
                                                        {car.condition === 'nuevo'
                                                            ? 'Excelente'
                                                            : car.condition === 'usado'
                                                            ? 'Bueno'
                                                            : car.condition === 'reparado'
                                                            ? 'Regular'
                                                            : 'Malo'}
                                                    </Badge>
                                                    <span className="font-semibold text-green-600">
                                                        ${car.estimatedValue.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {validationErrors.car && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{validationErrors.car}</AlertDescription>
                            </Alert>
                        )}
                        <div className="flex justify-between mt-6">
                            <Button onClick={handleCancel} variant="outline">
                                Cancelar
                            </Button>
                            <Button onClick={handleNext} disabled={!selectedCar}>
                                Continuar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {step === 2 && selectedCar && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Gavel className="h-5 w-5 text-blue-600" />
                                Configurar tu subasta
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-4">
                                    <Image
                                        src={selectedCar.imagen}
                                        alt={`${selectedCar.make} ${selectedCar.model}`}
                                        width={64}
                                        height={64}
                                        className="object-cover rounded-lg"
                                    />
                                    <div>
                                        <h3 className="font-semibold">
                                            {selectedCar.year} {selectedCar.make} {selectedCar.model}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Valor estimado: ${selectedCar.estimatedValue.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Tabs
                                defaultValue="pricing"
                                className="w-full"
                                onValueChange={(value) => {
                                    setVisitedTabs((prev) => new Set(prev).add(value));
                                    setValidationErrors((prev) => {
                                        const { tabs, ...rest } = prev;
                                        return rest;
                                    });
                                }}
                            >
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="pricing">Precios</TabsTrigger>
                                    <TabsTrigger value="timing">Tiempo</TabsTrigger>
                                    <TabsTrigger value="advanced">Avanzado</TabsTrigger>
                                </TabsList>
                                <TabsContent value="pricing" className="space-y-4">
                                    <div>
                                        <Label htmlFor="startPrice" className="text-base font-medium">
                                            Precio inicial *
                                        </Label>
                                        <div className="mt-2 relative">
                                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="startPrice"
                                                type="number"
                                                value={formData.startPrice || ''}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        startPrice: parseInt(e.target.value) || 0,
                                                    }))
                                                }
                                                className="pl-10 text-lg font-semibold"
                                                placeholder="0"
                                            />
                                        </div>
                                        {validationErrors.startPrice && (
                                            <p className="text-sm text-red-600 mt-1">{validationErrors.startPrice}</p>
                                        )}
                                        <div className="mt-3">
                                            <p className="text-sm text-gray-600 mb-2">Precios sugeridos:</p>
                                            <div className="flex gap-2 flex-wrap">
                                                {getSuggestedPrices().map((suggestion) => (
                                                    <Button
                                                        key={suggestion.label}
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                startPrice: suggestion.value,
                                                            }))
                                                        }
                                                        className="text-xs"
                                                    >
                                                        {suggestion.label}: ${suggestion.value.toLocaleString()}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="reservePrice" className="text-base font-medium">
                                            Precio de reserva (opcional)
                                        </Label>
                                        <div className="mt-2 relative">
                                            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="reservePrice"
                                                type="number"
                                                value={formData.reservePrice || ''}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        reservePrice: e.target.value ? parseInt(e.target.value) : undefined,
                                                    }))
                                                }
                                                className="pl-10"
                                                placeholder="Precio mínimo de venta"
                                            />
                                        </div>
                                        {validationErrors.reservePrice && (
                                            <p className="text-sm text-red-600 mt-1">{validationErrors.reservePrice}</p>
                                        )}
                                        <p className="text-sm text-gray-500 mt-1">
                                            El precio de reserva es el mínimo que aceptarás. No será visible para los compradores.
                                        </p>
                                    </div>
                                </TabsContent>

                                <TabsContent value="timing" className="space-y-4">
                                    <div>
                                        <Label htmlFor="duration" className="text-base font-medium">
                                            Duración de la subasta *
                                        </Label>
                                        <div className="mt-2 relative">
                                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="duration"
                                                type="number"
                                                value={formData.duration}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        duration: parseInt(e.target.value) || 24,
                                                    }))
                                                }
                                                className="pl-10"
                                                min="1"
                                                max="168"
                                            />
                                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">horas</span>
                                        </div>
                                        {validationErrors.duration && (
                                            <p className="text-sm text-red-600 mt-1">{validationErrors.duration}</p>
                                        )}
                                        <div className="mt-3 flex gap-2 flex-wrap">
                                            {[
                                                { label: '1 día', hours: 24 },
                                                { label: '3 días', hours: 72 },
                                                { label: '7 días', hours: 168 },
                                            ].map((preset) => (
                                                <Button
                                                    key={preset.label}
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            duration: preset.hours,
                                                        }))
                                                    }
                                                    className="text-xs"
                                                >
                                                    {preset.label}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <Label className="text-base font-medium">Inicio de la subasta</Label>
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    checked={formData.startImmediately}
                                                    onCheckedChange={(checked) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            startImmediately: checked,
                                                            scheduledStartTime: checked ? undefined : prev.scheduledStartTime,
                                                        }))
                                                    }
                                                />
                                                <Label className="text-sm">Iniciar inmediatamente</Label>
                                            </div>
                                        </div>

                                        {!formData.startImmediately && (
                                            <>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={'outline'}
                                                            className={cn(
                                                                'w-full justify-start text-left font-normal',
                                                                !formData.scheduledStartTime && 'text-muted-foreground'
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {formData.scheduledStartTime ? (
                                                                format(formData.scheduledStartTime, 'PPP HH:mm', { locale: es })
                                                            ) : (
                                                                <span>Selecciona fecha y hora</span>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={formData.scheduledStartTime}
                                                            onSelect={(date) => {
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    scheduledStartTime: date || undefined,
                                                                }));
                                                            }}
                                                            initialFocus
                                                            fromDate={new Date()}
                                                        />
                                                        <div className="p-3 border-t border-gray-200">
                                                            <Input
                                                                type="time"
                                                                step="60"
                                                                value={formData.scheduledStartTime ? format(formData.scheduledStartTime, 'HH:mm') : ''}
                                                                onChange={(e) => {
                                                                    const [hours, minutes] = e.target.value.split(':').map(Number);
                                                                    setFormData((prev) => {
                                                                        const newDate = new Date(prev.scheduledStartTime || new Date());
                                                                        newDate.setHours(hours);
                                                                        newDate.setMinutes(minutes);
                                                                        return { ...prev, scheduledStartTime: newDate };
                                                                    });
                                                                }}
                                                            />
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                                {validationErrors.scheduledStartTime && (
                                                    <p className="text-sm text-red-600 mt-1">{validationErrors.scheduledStartTime}</p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </TabsContent>
                                <TabsContent value="advanced" className="space-y-4">
                                    <Alert>
                                        <Info className="h-4 w-4" />
                                        <AlertDescription>
                                            <strong>Términos importantes:</strong>
                                            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                                                <li>Una vez iniciada, la subasta no se puede cancelar</li>
                                                <li>El precio de reserva no será visible para los compradores</li>
                                                <li>Si no se alcanza el precio de reserva, no estás obligado a vender</li>
                                                <li>Carking cobrará una comisión del 5% sobre la venta final</li>
                                            </ul>
                                        </AlertDescription>
                                    </Alert>
                                </TabsContent>
                            </Tabs>
                            {validationErrors.tabs && (
                                <Alert variant="destructive" className="mt-4">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{validationErrors.tabs}</AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex justify-between">
                        <Button onClick={() => setStep(1)} variant="outline">
                            Atrás
                        </Button>
                        <Button onClick={handleNext}>Revisar</Button>
                    </div>
                </div>
            )}
            {step === 3 && selectedCar && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            Confirmar subasta
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
                            <h3 className="font-semibold text-lg mb-4">Resumen de tu subasta</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Vehículo</h4>
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={selectedCar.imagen}
                                            alt={`${selectedCar.make} ${selectedCar.model}`}
                                            width={48}
                                            height={48}
                                            className="object-cover rounded-lg"
                                        />
                                        <div>
                                            <p className="font-medium">
                                                {selectedCar.year} {selectedCar.make} {selectedCar.model}
                                            </p>
                                            <p className="text-sm text-gray-600">{selectedCar.mileage.toLocaleString()} km</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Configuración</h4>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span>Precio inicial:</span>
                                            <span className="font-semibold">${formData.startPrice.toLocaleString()}</span>
                                        </div>
                                        {formData.reservePrice && (
                                            <div className="flex justify-between">
                                                <span>Precio de reserva:</span>
                                                <span className="font-semibold">${formData.reservePrice.toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span>Duración:</span>
                                            <span className="font-semibold">{formData.duration} horas</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Inicio:</span>
                                            <span className="font-semibold">{formData.startImmediately ? 'Inmediato' : 'Programado'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <>
                                {console.log('Error en CreateAuctionForm:', error)}
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{String(error)}</AlertDescription>
                                </Alert>
                            </>
                        )}
                        <div className="flex justify-between">
                            <Button onClick={() => setStep(2)} variant="outline" disabled={loading}>
                                Atrás
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creando subasta...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4" />
                                        Crear Subasta
                                    </div>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}