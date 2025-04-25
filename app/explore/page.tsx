"use client"

import { useState, useEffect } from "react"
import { MainNav } from "@/components/main-nav"
import { MovieGrid } from "@/components/movie-grid"
import { FeaturedMovie } from "@/components/featured-movie"
import { fetchCategories, fetchMoviesByCategory } from "@/lib/tmdb-api"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { MotionContainer } from "@/components/animations/motion-container"
import { FadeIn } from "@/components/animations/fade-in"
import { motion } from "framer-motion"

interface Category {
  id: number
  name: string
}

interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string
  backdrop_path: string
}

export default function ExplorePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [movies, setMovies] = useState<Record<string, Movie[]>>({})
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories()
        setCategories(fetchedCategories)

        if (fetchedCategories.length > 0) {
          setSelectedCategory(fetchedCategories[0].id.toString())
        }
      } catch (error) {
        console.error("Error loading categories:", error)
      }
    }

    loadCategories()
  }, [])

  useEffect(() => {
    if (!selectedCategory) return

    const loadMovies = async () => {
      setLoading(true)
      try {
        if (!movies[selectedCategory]) {
          const fetchedMovies = await fetchMoviesByCategory(Number.parseInt(selectedCategory))
          setMovies((prev) => ({
            ...prev,
            [selectedCategory]: fetchedMovies,
          }))

          if (fetchedMovies.length > 0 && !featuredMovie) {
            setFeaturedMovie(fetchedMovies[0])
          }
        }
      } catch (error) {
        console.error("Error loading movies:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMovies()
  }, [selectedCategory, movies, featuredMovie])

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
            <div className="relative h-[60vh] w-full bg-gray-900">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
              </div>
            </div>
          )}

          <div className="container mx-auto px-4 py-8">
            <FadeIn>
              <h2 className="mb-6 text-2xl font-bold">Explorar películas</h2>
            </FadeIn>

            {/* Nuevo diseño de categorías con animación */}
            {categories.length > 0 ? (
              <div className="mb-8">
                <FadeIn delay={0.2}>
                  <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-2">
                    <motion.button
                      key="all"
                      onClick={() => setSelectedCategory(categories[0].id.toString())}
                      className={cn(
                        "px-6 py-2 rounded-full whitespace-nowrap transition-colors",
                        selectedCategory === categories[0].id.toString()
                          ? "bg-gray-700 text-white"
                          : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/70",
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Todas
                    </motion.button>
                    {categories.slice(1).map((category) => (
                      <motion.button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id.toString())}
                        className={cn(
                          "px-6 py-2 rounded-full whitespace-nowrap transition-colors",
                          selectedCategory === category.id.toString()
                            ? "bg-gray-700 text-white"
                            : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/70",
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {category.name}
                      </motion.button>
                    ))}
                  </div>
                </FadeIn>

                {loading && !movies[selectedCategory] ? (
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
                ) : (
                  <FadeIn delay={0.3}>
                    <MovieGrid movies={movies[selectedCategory] || []} onSelectMovie={handleMovieSelect} />
                  </FadeIn>
                )}
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
              </div>
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
