"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Film, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { MotionContainer } from "@/components/animations/motion-container"
import { FadeIn } from "@/components/animations/fade-in"
import { motion } from "framer-motion"
import { MotionButton } from "@/components/animations/motion-button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const router = useRouter()
  const { register } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "Error de validación",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Ahora register devuelve la respuesta directamente
      const response = await register(name, email, password)
      
      // Si llegamos aquí sin error, el registro fue exitoso
      // y mostramos el modal de confirmación
      setShowConfirmation(true)
    } catch (error: any) {
      console.error("Error en registro:", error)
      
      // Verificamos los mensajes de error específicos
      if (error?.message?.includes('email already exists')) {
        toast({
          title: "Error al registrarse",
          description: "Este correo ya está registrado. Por favor intenta con otro.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error al registrarse",
          description: error?.message || "No se pudo crear la cuenta. Inténtalo de nuevo.",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmationClose = () => {
    // Redireccionar a la página de login cuando se cierra el modal
    router.push("/login")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <MotionContainer className="w-full max-w-md">
        <FadeIn className="mb-8 flex items-center justify-center gap-2 text-2xl font-bold text-red-600">
          <motion.div initial={{ rotate: -10 }} animate={{ rotate: 0 }} transition={{ duration: 0.5, type: "spring" }}>
            <Film className="h-8 w-8" />
          </motion.div>
          <span>MovieVault</span>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Card className="border-gray-800 bg-gray-900 text-white">
            <CardHeader>
              <CardTitle className="text-xl">Crear cuenta</CardTitle>
              <CardDescription className="text-gray-400">
                Regístrate para comenzar a gestionar tu colección de películas
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border-gray-700 bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-gray-700 bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-gray-700 bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="border-gray-700 bg-gray-800"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <MotionButton type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                  {loading ? "Creando cuenta..." : "Registrarse"}
                </MotionButton>
                <p className="text-center text-sm text-gray-400">
                  ¿Ya tienes una cuenta?{" "}
                  <Link href="/login" className="text-red-600 hover:underline">
                    Inicia sesión
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </FadeIn>
      </MotionContainer>

      {/* Modal de confirmación de registro */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="w-[90%] max-w-md sm:max-w-[500px] border-gray-800 bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-center">¡Felicidades! Te has registrado exitosamente</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-6">
            <div className="bg-gray-800 rounded-full p-4 mb-4">
              <Mail className="h-12 w-12 text-red-600" />
            </div>
            <p className="text-center text-gray-300 mb-2">
              Para continuar, por favor, confirma tu email para iniciar sesión.
            </p>
            <p className="text-center text-gray-400 text-sm">
              Hemos enviado un correo de confirmación a <span className="font-semibold text-white">{email}</span>
            </p>
          </div>

          <DialogFooter>
            <Button 
              className="w-full bg-red-600 hover:bg-red-700"
              onClick={handleConfirmationClose}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
