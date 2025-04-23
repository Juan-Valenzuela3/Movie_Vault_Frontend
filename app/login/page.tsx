"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Film } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { MotionContainer } from "@/components/animations/motion-container"
import { FadeIn } from "@/components/animations/fade-in"
import { motion } from "framer-motion"
import { MotionButton } from "@/components/animations/motion-button"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(email, password)
      toast({
        title: "Inicio de sesión exitoso",
        description: "Has iniciado sesión correctamente",
      })
      router.push("/explore")
    } catch (error) {
      toast({
        title: "Error al iniciar sesión",
        description: "Credenciales incorrectas. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
              <CardTitle className="text-xl">Iniciar sesión</CardTitle>
              <CardDescription className="text-gray-400">
                Ingresa tus credenciales para acceder a tu cuenta
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
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
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <MotionButton type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                  {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                </MotionButton>
                <p className="text-center text-sm text-gray-400">
                  ¿No tienes una cuenta?{" "}
                  <Link href="/register" className="text-red-600 hover:underline">
                    Regístrate
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </FadeIn>
      </MotionContainer>
    </div>
  )
}
