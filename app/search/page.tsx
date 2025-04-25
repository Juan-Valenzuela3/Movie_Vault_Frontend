"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { MovieGrid } from "@/components/movie-grid"
import { FeaturedMovie } from "@/components/featured-movie"
import { searchMovies } from "@/lib/tmdb-api"
import { Skeleton } from "@/components/ui/skeleton"
import { MotionContainer } from "@/components/animations/motion-container"
import { FadeIn } from "@/components/animations/fade-in"

interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string
  backdrop_path: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null)

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return

      setLoading(true)
      try {
        const results = await searchMovies(query)
        setMovies(results)

        // Establecer la primera película como destacada si hay resultados
        if (results.length > 0) {
          setFeaturedMovie(results[0])
        } else {
          setFeaturedMovie(null)
        }
      } catch (error) {
        console.error("Error searching movies:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSearchResults()
  }, [query])

  const handleMovieSelect = (movie: Movie) => {
    setFeaturedMovie(movie)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="sticky top-0 z-50 w-full bg-black/90 backdrop-blur-sm">
        <div className="container mx-auto py-4">
          <MainNav />
        </div>
      </header>

      <main className="flex-1">
        <MotionContainer>
          {featuredMovie ? (
            <FeaturedMovie movie={featuredMovie} />
          ) : (
            <div className="relative h-[40vh] w-full bg-gray-900 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Búsqueda de películas</h1>
                <p className="text-gray-400">Ingresa un término de búsqueda para encontrar películas</p>
              </div>
            </div>
          )}

          <div className="container mx-auto px-4 py-8">
            <FadeIn>
              <h2 className="mb-6 text-2xl font-bold">
                {query ? `Resultados para "${query}"` : "Búsqueda de películas"}
              </h2>
            </FadeIn>

            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {Array(10)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))}
              </div>
            ) : movies.length > 0 ? (
              <FadeIn delay={0.3}>
                <MovieGrid movies={movies} onSelectMovie={handleMovieSelect} />
              </FadeIn>
            ) : (
              <FadeIn delay={0.3}>
                <div className="flex flex-col items-center justify-center rounded-lg border border-gray-800 bg-gray-900 p-8 text-center">
                  <h3 className="mb-2 text-xl font-semibold">No se encontraron resultados</h3>
                  <p className="text-gray-400">
                    No se encontraron películas que coincidan con "{query}". Intenta con otro término de búsqueda.
                  </p>
                </div>
              </FadeIn>
            )}
          </div>
        </MotionContainer>
      </main>

      <footer className="bg-gray-900 py-6">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2025 MovieVault. Todos los derechos reservados.</p>
          <p className="mt-2 text-sm">Desarrollado por <strong className="italic">Juan Valenzuela</strong></p>
        </div>
      </footer>
    </div>
  )
}
