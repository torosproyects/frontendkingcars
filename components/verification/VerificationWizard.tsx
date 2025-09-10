'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/lib/store/auth-store';
import { VerificationData, VerificationStep, AccountType } from '@/types/verification';
import { Form } from '@/components/ui/form';

import { ProgressIndicator } from './ProgressIndicator';
import { AccountTypeSelection } from './AccountTypeSelection';
import { BasicInfoStep } from './BasicInfoStep';
import { PhoneVerificationStep } from './PhoneVerificationStep';
import { SpecificInfoStep } from './SpecificInfoStep';
import { DocumentsStep } from './DocumentsStep';
import { ReviewStep } from './ReviewStep';

// Esquemas de validación
const baseSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(9, 'Número de teléfono inválido'),
  phoneVerified: z.boolean(),
  accountType: z.enum(['Taller', 'Usuario', 'Empresa']),
});

const tallerSchema = baseSchema.extend({
  tallerData: z.object({
    nombreTaller: z.string().min(2, 'Nombre del taller requerido'),
    cif: z.string().min(8, 'CIF inválido'),
    numeroRegistro: z.string().min(1, 'Número de registro requerido'),
    direccion: z.string().min(5, 'Dirección requerida'),
    codigoPostal: z.string().min(5, 'Código postal inválido'),
    provincia: z.string().min(1, 'Provincia requerida'),
    telefono: z.string().min(9, 'Teléfono inválido'),
    email: z.string().email('Email inválido'),
  }),
});

const usuarioSchema = baseSchema.extend({
  usuarioData: z.object({
    dni: z.string().min(8, 'DNI/NIE inválido'),
    fechaNacimiento: z.string().min(1, 'Fecha de nacimiento requerida'),
    direccion: z.string().min(5, 'Dirección requerida'),
    codigoPostal: z.string().min(5, 'Código postal inválido'),
    provincia: z.string().min(1, 'Provincia requerida'),
  }),
});

const empresaSchema = baseSchema.extend({
  empresaData: z.object({
    razonSocial: z.string().min(2, 'Razón social requerida'),
    cif: z.string().min(8, 'CIF inválido'),
    direccionFiscal: z.string().min(5, 'Dirección fiscal requerida'),
    codigoPostal: z.string().min(5, 'Código postal inválido'),
    provincia: z.string().min(1, 'Provincia requerida'),
    telefono: z.string().min(9, 'Teléfono inválido'),
    emailCorporativo: z.string().email('Email corporativo inválido'),
    representanteLegal: z.object({
      nombre: z.string().min(2, 'Nombre del representante requerido'),
      dni: z.string().min(8, 'DNI/NIE del representante inválido'),
      cargo: z.string().min(2, 'Cargo requerido'),
      telefono: z.string().min(9, 'Teléfono del representante inválido'),
      email: z.string().email('Email del representante inválido'),
    }),
  }),
});

export function VerificationWizard() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, refreshUser } = useAuthStore();
  
  const [currentStep, setCurrentStep] = useState<VerificationStep>('account-type');
  const [completedSteps, setCompletedSteps] = useState<VerificationStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<VerificationData>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      phone: '',
      phoneVerified: false,
      accountType: 'Usuario',
      tallerData: {
        nombreTaller: '',
        cif: '',
        numeroRegistro: '',
        direccion: '',
        codigoPostal: '',
        provincia: '',
        telefono: '',
        email: '',
      },
      usuarioData: {
        dni: '',
        fechaNacimiento: '',
        direccion: '',
        codigoPostal: '',
        provincia: '',
      },
      empresaData: {
        razonSocial: '',
        cif: '',
        direccionFiscal: '',
        codigoPostal: '',
        provincia: '',
        telefono: '',
        emailCorporativo: '',
        representanteLegal: {
          nombre: '',
          dni: '',
          cargo: '',
          telefono: '',
          email: '',
        },
      },
      documents: {},
    },
  });

  const watchedData = form.watch();

  const getCurrentSchema = () => {
    switch (watchedData.accountType) {
      case 'Taller': return tallerSchema;
      case 'Usuario': return usuarioSchema;
      case 'Empresa': return empresaSchema;
      default: return baseSchema;
    }
  };

  const validateCurrentStep = async (): Promise<boolean> => {
    try {
      // Para el primer paso, solo validamos que se haya seleccionado un tipo de cuenta
      if (currentStep === 'account-type') {
        return !!watchedData.accountType;
      }
      
      // Para el segundo paso, validamos los campos básicos
      if (currentStep === 'basic-info') {
        console.log('Validating basic-info:', {
          firstName: watchedData.firstName,
          lastName: watchedData.lastName,
          email: watchedData.email
        });
        return !!(watchedData.firstName && watchedData.lastName && watchedData.email);
      }
      
      // Para el tercer paso, validamos que el teléfono esté verificado
      if (currentStep === 'phone-verification') {
        console.log('Validating phone-verification:', {
          phoneVerified: watchedData.phoneVerified,
          phone: watchedData.phone
        });
        return !!watchedData.phoneVerified;
      }
      
      // Para el cuarto paso, validamos campos específicos según el tipo de cuenta
      if (currentStep === 'specific-info') {
        if (watchedData.accountType === 'Taller') {
          const tallerData = watchedData.tallerData;
          return !!(tallerData?.nombreTaller && tallerData?.cif && tallerData?.direccion && 
                   tallerData?.codigoPostal && tallerData?.provincia);
        } else if (watchedData.accountType === 'Usuario') {
          const usuarioData = watchedData.usuarioData;
          return !!(usuarioData?.dni && usuarioData?.fechaNacimiento && usuarioData?.direccion && 
                   usuarioData?.codigoPostal && usuarioData?.provincia);
        } else if (watchedData.accountType === 'Empresa') {
          const empresaData = watchedData.empresaData;
          return !!(empresaData?.razonSocial && empresaData?.cif && empresaData?.direccionFiscal && 
                   empresaData?.codigoPostal && empresaData?.provincia && empresaData?.representanteLegal?.nombre &&
                   empresaData?.representanteLegal?.dni && empresaData?.representanteLegal?.cargo &&
                   empresaData?.representanteLegal?.telefono && empresaData?.representanteLegal?.email);
        }
        return false;
      }
      
      const schema = getCurrentSchema();
      await schema.parseAsync(watchedData);
      return true;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  };

  const goToNextStep = async () => {
    const isValid = await validateCurrentStep();
    
    if (!isValid) {
      toast({
        title: "Información incompleta",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }

    const stepOrder: VerificationStep[] = [
      'account-type',
      'basic-info',
      'phone-verification',
      'specific-info',
      'documents',
      'review'
    ];

    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const goToPreviousStep = () => {
    const stepOrder: VerificationStep[] = [
      'account-type',
      'basic-info',
      'phone-verification',
      'specific-info',
      'documents',
      'review'
    ];

    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleAccountTypeSelect = (type: AccountType) => {
    form.setValue('accountType', type);
  };

  const handlePhoneVerified = () => {
    console.log('Phone verified callback called');
    form.setValue('phoneVerified', true);
    
    // Forzar la actualización del estado
    setTimeout(() => {
      console.log('Phone verified state updated:', form.getValues('phoneVerified'));
      goToNextStep();
    }, 100);
  };

  const handleDocumentCapture = (type: 'dni' | 'cif' | 'tallerRegistro', dataUrl: string) => {
    form.setValue(`documents.${type}`, dataUrl);
  };

  const handleDocumentDelete = (type: 'dni' | 'cif' | 'tallerRegistro') => {
    form.setValue(`documents.${type}`, '');
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Aquí iría la lógica para enviar los datos al backend
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulación
      
      await refreshUser();
      
      toast({
        title: "¡Solicitud enviada!",
        description: "Tu solicitud de verificación ha sido enviada exitosamente"
      });
      
      router.push('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar la solicitud. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'account-type':
        return (
          <AccountTypeSelection
            selectedType={watchedData.accountType}
            onSelect={handleAccountTypeSelect}
          />
        );
      
      case 'basic-info':
        return <BasicInfoStep form={form} />;
      
      case 'phone-verification':
        return (
          <PhoneVerificationStep
            phone={watchedData.phone}
            onPhoneChange={(phone) => form.setValue('phone', phone)}
            onVerified={handlePhoneVerified}
            isVerified={watchedData.phoneVerified}
          />
        );
      
      case 'specific-info':
        return (
          <SpecificInfoStep
            form={form}
            accountType={watchedData.accountType}
          />
        );
      
      case 'documents':
        return (
          <DocumentsStep
            accountType={watchedData.accountType}
            documents={watchedData.documents}
            onDocumentCapture={handleDocumentCapture}
            onDocumentDelete={handleDocumentDelete}
          />
        );
      
      case 'review':
        return (
          <ReviewStep
            data={watchedData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        );
      
      default:
        return null;
    }
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 'account-type':
        return !!watchedData.accountType;
      case 'basic-info':
        console.log('Basic info validation:', {
          firstName: watchedData.firstName,
          lastName: watchedData.lastName,
          email: watchedData.email,
          firstNameValid: !!watchedData.firstName,
          lastNameValid: !!watchedData.lastName,
          emailValid: !!watchedData.email
        });
        return watchedData.firstName && watchedData.lastName && watchedData.email;
      case 'phone-verification':
        console.log('Phone verification validation:', {
          phoneVerified: watchedData.phoneVerified,
          phone: watchedData.phone
        });
        return watchedData.phoneVerified;
      case 'specific-info':
        // Validar campos específicos según el tipo de cuenta
        if (watchedData.accountType === 'Taller') {
          const tallerData = watchedData.tallerData;
          return !!(tallerData?.nombreTaller && tallerData?.cif && tallerData?.direccion && 
                   tallerData?.codigoPostal && tallerData?.provincia);
        } else if (watchedData.accountType === 'Usuario') {
          const usuarioData = watchedData.usuarioData;
          return !!(usuarioData?.dni && usuarioData?.fechaNacimiento && usuarioData?.direccion && 
                   usuarioData?.codigoPostal && usuarioData?.provincia);
        } else if (watchedData.accountType === 'Empresa') {
          const empresaData = watchedData.empresaData;
          return !!(empresaData?.razonSocial && empresaData?.cif && empresaData?.direccionFiscal && 
                   empresaData?.codigoPostal && empresaData?.provincia && empresaData?.representanteLegal?.nombre &&
                   empresaData?.representanteLegal?.dni && empresaData?.representanteLegal?.cargo &&
                   empresaData?.representanteLegal?.telefono && empresaData?.representanteLegal?.email);
        }
        return false;
      case 'documents':
        return true; // Se valida en goToNextStep
      case 'review':
        return false; // No hay siguiente paso
      default:
        return false;
    }
  };

  const canGoPrevious = () => {
    return currentStep !== 'account-type';
  };

  return (
    <div className="container py-4 md:py-8 px-4 md:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4 text-center md:text-left">Verificación de Perfil</h1>
        <p className="text-sm md:text-base text-muted-foreground text-center md:text-left">
          Completa tu información para verificar tu cuenta y acceder a todas las funcionalidades
        </p>
      </div>

      <ProgressIndicator 
        currentStep={currentStep} 
        completedSteps={completedSteps} 
      />

      <Form {...form}>
        <div className="mb-8">
          {renderCurrentStep()}
        </div>

        {/* Navegación */}
        {currentStep !== 'review' && (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between px-4 md:px-0">
            <button
              onClick={goToPreviousStep}
              disabled={!canGoPrevious()}
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base order-2 sm:order-1"
            >
              Anterior
            </button>
            
            <button
              onClick={goToNextStep}
              disabled={!canGoNext()}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base order-1 sm:order-2"
            >
              Siguiente
            </button>
          </div>
        )}
      </Form>
    </div>
  );
}
