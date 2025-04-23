"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, Clock, MoreVertical, Trash, Play, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { StaggerContainer } from "@/components/animations/stagger-container"
import { StaggerItem } from "@/components/animations/stagger-item"
import { motion } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { fetchMovieTrailer } from "@/lib/tmdb-api"
import { useToast } from "@/hooks/use-toast"

interface Movie {
  id?: number
  nameMovie: string
  category: string
  image: string
  status: "Visto" | "Pendiente"
  tmdbId?: number
}

interface CollectionGridProps {
  movies: Movie[]
  onStatusChange: (movieId: number, newStatus: "Visto" | "Pendiente") => void
  onDeleteMovie: (movieId: number) => void
}

export function CollectionGrid({ movies, onStatusChange, onDeleteMovie }: CollectionGridProps) {
  const [movieToDelete, setMovieToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [trailerOpen, setTrailerOpen] = useState(false)
  const [trailerKey, setTrailerKey] = useState<string | null>(null)
  const [trailerLoading, setTrailerLoading] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const { toast } = useToast()

  const handleDeleteConfirm = async () => {
    if (movieToDelete !== null) {
      setIsDeleting(true)
      await onDeleteMovie(movieToDelete)
      setIsDeleting(false)
      setMovieToDelete(null)
    }
  }

  const handleMovieClick = async (movie: Movie) => {
    setSelectedMovie(movie)
    setTrailerLoading(true)
    setTrailerOpen(true)

    try {
      // Si tenemos el ID de TMDb, usarlo directamente
      if (movie.tmdbId) {
        const key = await fetchMovieTrailer(movie.tmdbId)
        setTrailerKey(key)
      } else {
        // Si no, intentar buscar la película por título
        const key = await fetchMovieTrailer(0) // Esto se reemplazará con fetchMovieIdByTitle cuando esté implementado
        setTrailerKey(key)
      }
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
      <StaggerContainer className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {movies.map((movie) => (
          <StaggerItem key={movie.id || `movie-${movie.nameMovie}-${Math.random()}`}>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
              <Card className="overflow-hidden border-gray-600 bg-gray-900">
                <CardContent className="p-0 cursor-pointer" onClick={() => handleMovieClick(movie)}>
                  <div className="relative aspect-[2/3] w-full">
                    <Image
                      src={movie.image || "/placeholder.svg"}
                      alt={movie.nameMovie}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute right-2 top-2">
                      <Badge variant={movie.status === "Visto" ? "default" : "outline"}>{movie.status}</Badge>
                    </div>
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <div className="p-2">
                    <h3 className="line-clamp-2 text-sm font-medium">{movie.nameMovie}</h3>
                    <p className="text-xs text-gray-400">{movie.category}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-2">
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onStatusChange(movie.id!, movie.status === "Visto" ? "Pendiente" : "Visto")
                      }}
                    >
                      {movie.status === "Visto" ? <Clock className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </motion.div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 bg-gray-900 text-white">
                      <DropdownMenuItem
                        className="text-red-500 focus:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation()
                          setMovieToDelete(movie.id!)
                        }}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Modal para confirmar eliminación */}
      <AlertDialog open={movieToDelete !== null} onOpenChange={(open) => !open && setMovieToDelete(null)}>
        <AlertDialogContent className="bg-gray-900 text-white border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Esta acción eliminará la película de tu colección y no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                title={`Trailer de ${selectedMovie?.nameMovie || "la película"}`}
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
