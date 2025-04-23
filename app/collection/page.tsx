"use client"

import { useState, useEffect } from "react"
import { MainNav } from "@/components/main-nav"
import { CollectionGrid } from "@/components/collection-grid"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserMovies, updateMovieStatus, deleteMovie } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { MotionContainer } from "@/components/animations/motion-container"
import { FadeIn } from "@/components/animations/fade-in"
import { MotionButton } from "@/components/animations/motion-button"

interface Movie {
  id?: number
  nameMovie: string
  category: string
  image: string
  status: "Visto" | "Pendiente"
  tmdbId?: number
}

export default function CollectionPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "Visto" | "Pendiente">("all")
  const { isAuthenticated, token } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Acceso denegado",
        description: "Debes iniciar sesión para ver tu colección",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    const loadMovies = async () => {
      setLoading(true)
      try {
        const userMovies = await getUserMovies(token!)
        setMovies(userMovies)
      } catch (error) {
        console.error("Error loading user movies:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar tu colección de películas",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadMovies()
  }, [isAuthenticated, token, router, toast])

  const filteredMovies = filter === "all" ? movies : movies.filter((movie) => movie.status === filter)

  const handleStatusChange = async (movieId: number, newStatus: "Visto" | "Pendiente") => {
    try {
      await updateMovieStatus(movieId, newStatus, token!)

      // Actualizar el estado local
      setMovies(movies.map((movie) => (movie.id === movieId ? { ...movie, status: newStatus } : movie)))

      toast({
        title: "Estado actualizado",
        description: `Película marcada como ${newStatus}`,
      })
    } catch (error) {
      console.error("Error updating movie status:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la película",
        variant: "destructive",
      })
    }
  }

  const handleDeleteMovie = async (movieId: number) => {
    try {
      await deleteMovie(movieId, token!)

      // Actualizar el estado local
      setMovies(movies.filter((movie) => movie.id !== movieId))

      toast({
        title: "Película eliminada",
        description: "La película ha sido eliminada de tu colección",
      })
    } catch (error) {
      console.error("Error deleting movie:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la película de tu colección",
        variant: "destructive",
      })
    }
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
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <FadeIn>
              <h1 className="text-3xl font-bold">Mi Colección</h1>
            </FadeIn>
            <FadeIn delay={0.2} className="mt-4 sm:mt-0">
              <Tabs
                value={filter}
                onValueChange={(value) => setFilter(value as "all" | "Visto" | "Pendiente")}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 bg-gray-900">
                  <TabsTrigger value="all">Todas</TabsTrigger>
                  <TabsTrigger value="Visto">Vistas</TabsTrigger>
                  <TabsTrigger value="Pendiente">Pendientes</TabsTrigger>
                </TabsList>
              </Tabs>
            </FadeIn>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-red-600" />
            </div>
          ) : filteredMovies.length === 0 ? (
            <FadeIn delay={0.3}>
              <div className="flex flex-col items-center justify-center rounded-lg border border-gray-800 bg-gray-900 p-8 text-center">
                <h2 className="mb-2 text-xl font-semibold">Tu colección está vacía</h2>
                <p className="mb-6 text-gray-400">
                  {filter === "all"
                    ? "Añade películas desde la sección de exploración para comenzar tu colección."
                    : `No tienes películas marcadas como ${filter.toLowerCase()}.`}
                </p>
                <MotionButton asChild className="bg-red-600 hover:bg-red-700">
                  <a href="/explore">Explorar películas</a>
                </MotionButton>
              </div>
            </FadeIn>
          ) : (
            <FadeIn delay={0.3}>
              <CollectionGrid
                movies={filteredMovies}
                onStatusChange={handleStatusChange}
                onDeleteMovie={handleDeleteMovie}
              />
            </FadeIn>
          )}
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
