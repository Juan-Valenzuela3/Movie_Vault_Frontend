"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Play, Plus, Check, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { addMovieToCollection, checkMovieInCollection } from "@/lib/api"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { fetchMovieTrailer } from "@/lib/tmdb-api"
import { motion } from "framer-motion"

interface Movie {
  id: number
  title: string
  overview: string
  backdrop_path: string
  poster_path: string
}

interface FeaturedMovieProps {
  movie: Movie
}

export function FeaturedMovie({ movie }: FeaturedMovieProps) {
  const [inCollection, setInCollection] = useState(false)
  const [loading, setLoading] = useState(false)
  const [trailerOpen, setTrailerOpen] = useState(false)
  const [trailerKey, setTrailerKey] = useState<string | null>(null)
  const [trailerLoading, setTrailerLoading] = useState(false)
  const { isAuthenticated, token } = useAuth()
  const { toast } = useToast()

  // Verificar si la película ya está en la colección
  useEffect(() => {
    if (isAuthenticated && token) {
      checkMovieInCollection(movie.id, token)
        .then((result) => setInCollection(result))
        .catch((error) => console.error("Error checking collection:", error))
    }
  }, [isAuthenticated, token, movie.id])

  const handleAddToCollection = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Inicia sesión para continuar",
        description: "Necesitas iniciar sesión para añadir películas a tu colección",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      await addMovieToCollection(
        {
          nameMovie: movie.title,
          category: "General", // Podría ser mejorado para usar categorías reales
          image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          tmdbId: movie.id, // Guardar el ID de TMDb para poder buscar el trailer después
        },
        token!,
      )

      setInCollection(true)

      toast({
        title: "Película añadida",
        description: "La película ha sido añadida a tu colección",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo añadir la película a tu colección",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenTrailer = async () => {
    setTrailerLoading(true)
    setTrailerOpen(true)

    try {
      const key = await fetchMovieTrailer(movie.id)
      setTrailerKey(key)
    } catch (error) {
      console.error("Error fetching trailer:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar el trailer de la película",
        variant: "destructive",
      })
    } finally {
      setTrailerLoading(false)
    }
  }

  return (
    <>
      <div className="relative h-[60vh] w-full">
        {/* Capa de oscurecimiento mejorada para mejor contraste */}
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>

        {movie.backdrop_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-900"></div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-8 md:bottom-20 md:left-20 md:max-w-2xl">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">{movie.title}</h1>
          <p className="mb-6 text-gray-300 line-clamp-3">{movie.overview}</p>
          <div className="flex flex-wrap gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-red-600 hover:bg-red-700" onClick={handleOpenTrailer}>
                <Play className="mr-2 h-4 w-4" /> Ver trailer
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" onClick={handleAddToCollection} disabled={loading || inCollection}>
                {inCollection ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> En tu colección
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" /> Añadir a mi colección
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal para reproducir el trailer */}
      <Dialog open={trailerOpen} onOpenChange={setTrailerOpen}>
        <DialogContent className="sm:max-w-[900px] p-0 bg-black border-gray-800">
          <div className="relative pt-[56.25%] w-full">
            <Button
              className="absolute right-2 top-2 z-50 rounded-full bg-black/70 p-2 w-8 h-8"
              variant="ghost"
              size="icon"
              onClick={() => setTrailerOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            {trailerLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
              </div>
            ) : trailerKey ? (
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title={`Trailer de ${movie.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <p className="text-gray-400">No se encontró un trailer para esta película</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
