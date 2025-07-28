"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface CaptchaProps {
  onVerify: (token: string) => void
}

export function Captcha({ onVerify }: CaptchaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [captchaText, setCaptchaText] = useState("")
  const [userInput, setUserInput] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")

  // Generar un texto aleatorio para el captcha
  const generateCaptchaText = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
    let result = ""
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Dibujar el captcha en el canvas
  const drawCaptcha = (text: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Fondo
    ctx.fillStyle = "#f3f4f6"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Dibujar líneas aleatorias
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 1
    for (let i = 0; i < 10; i++) {
      ctx.beginPath()
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
      ctx.stroke()
    }

    // Dibujar puntos aleatorios
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.5)`
      ctx.beginPath()
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2)
      ctx.fill()
    }

    // Configurar el texto
    ctx.font = "bold 24px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Dibujar cada carácter con rotación y color aleatorio
    for (let i = 0; i < text.length; i++) {
      ctx.save()
      ctx.translate(20 + i * 25, canvas.height / 2)
      ctx.rotate((Math.random() - 0.5) * 0.4)
      ctx.fillStyle = `rgb(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100})`
      ctx.fillText(text[i], 0, 0)
      ctx.restore()
    }
  }

  // Regenerar el captcha
  const refreshCaptcha = () => {
    setUserInput("")
    setIsVerified(false)
    setError("")
    const newCaptchaText = generateCaptchaText()
    setCaptchaText(newCaptchaText)
    drawCaptcha(newCaptchaText)
  }

  // Verificar el captcha
  const verifyCaptcha = () => {
    if (userInput.toLowerCase() === captchaText.toLowerCase()) {
      setIsVerified(true)
      setError("")
      // Generar un token simple (en producción usaríamos algo más seguro)
      const token = btoa(`${captchaText}-${Date.now()}`)
      onVerify(token)
    } else {
      setError("El texto no coincide. Inténtalo de nuevo.")
      refreshCaptcha()
    }
  }

  // Inicializar el captcha al cargar el componente
  useEffect(() => {
    const newCaptchaText = generateCaptchaText()
    setCaptchaText(newCaptchaText)
    drawCaptcha(newCaptchaText)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <canvas ref={canvasRef} width={180} height={60} className="border rounded"></canvas>
        <Button type="button" variant="ghost" size="icon" onClick={refreshCaptcha} className="ml-2">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {!isVerified ? (
        <>
          <div className="flex space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ingresa el texto"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button type="button" onClick={verifyCaptcha}>
              Verificar
            </Button>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </>
      ) : (
        <p className="text-sm text-green-500">Verificación completada</p>
      )}
    </div>
  )
}
