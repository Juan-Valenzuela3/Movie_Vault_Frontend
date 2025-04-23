"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MainNav } from "@/components/main-nav"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { updateUserProfile } from "@/lib/api"
import { Loader2 } from "lucide-react"
import { MotionContainer } from "@/components/animations/motion-container"
import { FadeIn } from "@/components/animations/fade-in"
import { MotionButton } from "@/components/animations/motion-button"

export default function ProfilePage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const { isAuthenticated, user, token, logout, updateUserData } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Acceso denegado",
        description: "Debes iniciar sesión para ver tu perfil",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (user) {
      setName(user.name || "")
      setEmail(user.email || "")
    }
  }, [isAuthenticated, user, router, toast])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Solo enviar los campos que han cambiado
      const updates: { name?: string; email?: string } = {}
      if (name !== user?.name) updates.name = name
      if (email !== user?.email) updates.email = email

      // Si no hay cambios, no hacer nada
      if (Object.keys(updates).length === 0) {
        toast({
          title: "Sin cambios",
          description: "No se detectaron cambios en tu información",
        })
        setLoading(false)
        return
      }

      const updatedUser = await updateUserProfile(updates, token!)

      // Actualizar los datos del usuario en el contexto de autenticación
      updateUserData(updatedUser)

      toast({
        title: "Perfil actualizado",
        description: "Tu información ha sido actualizada correctamente",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar tu perfil",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="sticky top-0 z-50 w-full bg-black/90 backdrop-blur-sm">
        <div className="container mx-auto py-4">
          <MainNav />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <MotionContainer>
          <FadeIn>
            <h1 className="mb-8 text-3xl font-bold">Mi Perfil</h1>
          </FadeIn>

          <div className="mx-auto max-w-2xl">
            <FadeIn delay={0.2}>
              <Card className="border-gray-800 bg-gray-900">
                <CardHeader>
                  <CardTitle>Información personal</CardTitle>
                  <CardDescription className="text-gray-400">Actualiza tu información personal</CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdateProfile}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border-gray-700 bg-gray-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-gray-700 bg-gray-800"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <MotionButton type="submit" className="bg-red-600 hover:bg-red-700" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Actualizando...
                        </>
                      ) : (
                        "Guardar cambios"
                      )}
                    </MotionButton>
                    <MotionButton variant="outline" type="button" onClick={handleLogout}>
                      Cerrar sesión
                    </MotionButton>
                  </CardFooter>
                </form>
              </Card>
            </FadeIn>
          </div>
        </MotionContainer>
      </main>

      <footer className="bg-gray-900 py-6">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2025 MovieVault. Todos los derechos reservados.</p>
          <p className="mt-2 text-sm">Desarrollado con Next.js y la API de The Movie Database (TMDb).</p>
        </div>
      </footer>
    </div>
  )
}
