"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
//import { useAuth } from "@/hooks/use-auth"
import { useAuthStore } from "@/lib/store/auth-store";
import type { LoginCredentials } from '@/lib/types/auth';
import { Captcha } from "@/components/auth/captcha"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { validateEmail } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from 'lucide-react'
import Image from 'next/image';
import logo from '@/public/logoisocol.png';

//eliminar esta importaciones es para simular

import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)

  const { login } = useAuthStore();
  const { toast } = useToast();

  
  const router = useRouter() 
  const emailIsValid = validateEmail(email)
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };


  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones básicas
    if (!email || !password) {
      setError("Por favor, completa todos los campos.")
      return
    }
    if (!emailIsValid) {
      setError("Por favor, ingresa un correo electrónico válido.")
      return
    }

    if (!captchaToken) {
      setError("Por favor, completa la verificación de captcha.")
      return
    }

    setIsSubmitting(true)
    setError("")
    setNeedsVerification(false)
    
    try {
      const data: LoginCredentials = {
            email:  email as string,
            password:  password as string,
            capchat: captchaToken as string,
            
          };

      const result = await login(data)

      if (result) {
        toast({
        title: "Bienvenido Carking",
        description: "Sitio de carros para todos los Gustos",
        variant: "success",
      });
        router.push("/")
      }  else {
        toast({
        title: "Credenciales incorrectas",
        description: "Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
        setError( "Credenciales incorrectas. Por favor, inténtalo de nuevo.")
      }
    } catch (err) {
      toast({
        title: "Credenciales incorrectas",
        description: "Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
      setError("Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.")
      
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
  <div className="container flex items-center justify-center min-h-screen py-12 px-4 md:px-6 lg:px-8">
    <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
            <div className="h-16 w-16 flex items-center justify-center">
              <Image 
                src={logo}
                alt="Logo"
                width={100}  // Ajusta según necesidad
                height={100}
                className="h-14 w-14 object-contain" // Mantienes las mismas dimensiones
              />
            </div>
            </div>
            <CardTitle className="text-2xl text-center">Iniciar Sesion</CardTitle>
            <CardDescription className="text-center">Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
      </CardHeader>
      <CardContent>
        {needsVerification ? (
          <div className="space-y-4">
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertDescription className="text-yellow-800">
                Tu cuenta no ha sido verificada. Por favor, verifica tu correo electrónico para continuar.
              </AlertDescription>
            </Alert>
            <Button
              className="w-full"
              onClick={() => router.push(`/verificacion?email=${encodeURIComponent(email)}`)}
            >
              Ir a verificación
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={email && !emailIsValid ? "border-red-500" : ""}
              />
              {email && !emailIsValid && (
                <p className="text-sm text-red-500">Por favor, ingresa un correo electrónico válido.</p>
              )}
            </div>            

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link href="#" className="text-sm text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="pr-10" // Espacio para el ícono
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground hover:text-primary"
          onClick={toggleShowPassword}
        >
          {showPassword ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>
            </div>

            <div className="space-y-2">
              <Label>Verificación de Captcha</Label>
              <Captcha onVerify={handleCaptchaVerify} />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          ¿No tienes una cuenta?{" "}
          <Link href="/registro" className="text-primary hover:underline">
            Regístrate
          </Link>
        </p>
      </CardFooter>
    </Card>
   </div>
  )
}