

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/lib/store/auth-store';
import { VerificationData, VerificationStep, AccountType, validateAge, validateDocument } from '@/types/verification';
import { Form } from '@/components/ui/form';
import { VerificationService } from '@/lib/api/verification';

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
  accountType: z.enum(['Particular', 'Empresa', 'Autónomo']),
  
  // Nueva información personal común
  fechaNacimiento: z.string().min(1, 'Fecha de nacimiento requerida')
    .refine((date) => validateAge(date), 'Debes ser mayor de 20 años'),
  documento: z.object({
    tipo: z.enum(['NIF', 'DNI', 'TIE', 'NIE']),
    numero: z.string().min(1, 'Número de documento requerido'),
  }).superRefine((data, ctx) => {
    if (data.tipo && data.numero) {
      if (!validateDocument(data.tipo, data.numero)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Número de documento inválido',
          path: ['numero'],
        });
      }
    }
  }),
  
  // Nueva información de dirección común
  direccion: z.string().min(5, 'Dirección requerida'),
  codigoPostal: z.string().min(4, 'Código postal requerido'),
  pais: z.string().min(2, 'País requerido'),
  ciudad: z.string().min(2, 'Ciudad requerida'),
  estado: z.string().min(2, 'Estado/Provincia requerido'),
});

const particularSchema = baseSchema.extend({
  particularData: z.object({
    numeroReciboServicio: z.string().min(1, 'Número de recibo requerido'),
  }),
});

const autonomoSchema = baseSchema.extend({
  autonomoData: z.object({
    altaAutonomo: z.string().min(1, 'Alta de autónomo requerida'),
    reta: z.string().min(1, 'RETA requerido'),
  }),
});

const empresaSchema = baseSchema.extend({
  empresaData: z.object({
    cif: z.string().min(8, 'CIF inválido'),
    numeroEscrituraConstitucion: z.string().min(1, 'Número de escritura requerido'),
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
      accountType: 'Particular',
      
      // Nueva información personal común
      fechaNacimiento: '',
      documento: {
        tipo: 'DNI',
        numero: '',
      },
      
      // Nueva información de dirección común
      direccion: '',
      codigoPostal: '',
      pais: 'ES', // España por defecto
      ciudad: '',
      estado: '',
      
      // Datos específicos por tipo
      particularData: {
        numeroReciboServicio: '',
      },
      autonomoData: {
        altaAutonomo: '',
        reta: '',
      },
      empresaData: {
        cif: '',
        numeroEscrituraConstitucion: '',
      },
      documents: {},
    },
  });

  const watchedData = form.watch();

  const getCurrentSchema = () => {
    switch (watchedData.accountType) {
      case 'Particular': return particularSchema;
      case 'Autónomo': return autonomoSchema;
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
         return !!(
          watchedData.firstName && 
          watchedData.lastName && 
          watchedData.email &&
          watchedData.fechaNacimiento &&
          validateAge(watchedData.fechaNacimiento) &&
          watchedData.documento.tipo &&
          watchedData.documento.numero &&
          validateDocument(watchedData.documento.tipo, watchedData.documento.numero) &&
          watchedData.direccion &&
          watchedData.codigoPostal &&
          watchedData.pais &&
          watchedData.ciudad &&
          watchedData.estado
        );
      }
      
      // Para el tercer paso, validamos que el teléfono esté verificado
      if (currentStep === 'phone-verification') {
          return !!watchedData.phoneVerified;
      }
      
      // Para el cuarto paso, validamos campos específicos según el tipo de cuenta
      if (currentStep === 'specific-info') {
        if (watchedData.accountType === 'Particular') {
          const particularData = watchedData.particularData;
          return !!(particularData?.numeroReciboServicio);
        } else if (watchedData.accountType === 'Autónomo') {
          const autonomoData = watchedData.autonomoData;
          return !!(autonomoData?.altaAutonomo && autonomoData?.reta);
        } else if (watchedData.accountType === 'Empresa') {
          const empresaData = watchedData.empresaData;
          return !!(empresaData?.cif && empresaData?.numeroEscrituraConstitucion);
        }
        return false;
      }
      
      // Para el quinto paso, validamos que todos los documentos requeridos estén capturados
      if (currentStep === 'documents') {
        const documents = watchedData.documents;
        
        if (!documents?.documentoIdentidad) {
          return false;
        }
        
        if (watchedData.accountType === 'Particular') {
          const isValid = !!(documents?.reciboServicio && documents?.certificadoBancario);
            return isValid;
        } else if (watchedData.accountType === 'Autónomo') {
          const isValid = !!(documents?.altaAutonomo && documents?.reta && documents?.certificadoBancario);
             return isValid;
        } else if (watchedData.accountType === 'Empresa') {
          const isValid = !!(documents?.escriturasConstitucion && documents?.iaeAno && 
                            documents?.tarjetaCif && documents?.certificadoTitularidadBancaria);
           return isValid;
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

  const handleDocumentCapture = (type: 'documentoIdentidad', dataUrl: string) => {
    form.setValue(`documents.${type}`, dataUrl);
  };

  const handleDocumentDelete = (type: 'documentoIdentidad') => {
    form.setValue(`documents.${type}`, '');
  };

  const handleFileUpload = (type: string, file: File) => {
    form.setValue(`documents.${type}` as any, file);
  };

  const handleFileDelete = (type: string) => {
    form.setValue(`documents.${type}` as any, undefined);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Obtener todos los datos del formulario
      const formData = form.getValues();
      
      // Llamar al backend real
      const response = await VerificationService.submitVerification(formData);
      
      if (response.success) {
        await refreshUser();
        
        toast({
          title: "¡Solicitud enviada!",
          description: response.message || "Tu solicitud de verificación ha sido enviada exitosamente"
        });
        
        router.push('/');
      } else {
        throw new Error(response.message || 'Error enviando la solicitud');
      }
    } catch (error) {
      console.error('Error submitting verification:', error);
      
      let errorMessage = "No se pudo enviar la solicitud. Intenta nuevamente.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
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
            onFileUpload={handleFileUpload}
            onFileDelete={handleFileDelete}
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
          fechaNacimiento: watchedData.fechaNacimiento,
          documento: watchedData.documento,
          direccion: watchedData.direccion,
          codigoPostal: watchedData.codigoPostal,
          pais: watchedData.pais,
          ciudad: watchedData.ciudad,
          estado: watchedData.estado
        });
        
        return !!(
          watchedData.firstName && 
          watchedData.lastName && 
          watchedData.email &&
          watchedData.fechaNacimiento &&
          validateAge(watchedData.fechaNacimiento) &&
          watchedData.documento.tipo &&
          watchedData.documento.numero &&
          validateDocument(watchedData.documento.tipo, watchedData.documento.numero) &&
          watchedData.direccion &&
          watchedData.codigoPostal &&
          watchedData.pais &&
          watchedData.ciudad &&
          watchedData.estado
        );
      case 'phone-verification':
        console.log('Phone verification validation:', {
          phoneVerified: watchedData.phoneVerified,
          phone: watchedData.phone
        });
        return watchedData.phoneVerified;
      case 'specific-info':
        // Validar campos específicos según el tipo de cuenta
        if (watchedData.accountType === 'Particular') {
          const particularData = watchedData.particularData;
          return !!(particularData?.numeroReciboServicio);
        } else if (watchedData.accountType === 'Autónomo') {
          const autonomoData = watchedData.autonomoData;
          return !!(autonomoData?.altaAutonomo && autonomoData?.reta);
        } else if (watchedData.accountType === 'Empresa') {
          const empresaData = watchedData.empresaData;
          return !!(empresaData?.cif && empresaData?.numeroEscrituraConstitucion);
        }
        return false;
      case 'documents':
        // Validar que todos los documentos requeridos estén capturados
        const documents = watchedData.documents;
        console.log('Documents validation:', {
          accountType: watchedData.accountType,
          documents: documents,
          documentoIdentidad: documents?.documentoIdentidad
        });
        
        // Foto de documento de identidad es obligatoria para todos
        if (!documents?.documentoIdentidad) {
          return false;
        }
        
        if (watchedData.accountType === 'Particular') {
          const isValid = !!(documents?.reciboServicio && documents?.certificadoBancario);
          console.log('Particular documents valid:', isValid);
          return isValid;
        } else if (watchedData.accountType === 'Autónomo') {
          const isValid = !!(documents?.altaAutonomo && documents?.reta && documents?.certificadoBancario);
          console.log('Autónomo documents valid:', isValid);
          return isValid;
        } else if (watchedData.accountType === 'Empresa') {
          const isValid = !!(documents?.escriturasConstitucion && documents?.iaeAno && 
                            documents?.tarjetaCif && documents?.certificadoTitularidadBancaria);
          console.log('Empresa documents valid:', isValid);
          return isValid;
        }
        return false;
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


