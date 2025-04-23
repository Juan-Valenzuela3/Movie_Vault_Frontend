// API Key y token de acceso para TMDb
const API_KEY = "903b831294edeb282e522c317292762e"
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MDNiODMxMjk0ZWRlYjI4MmU1MjJjMzE3MjkyNzYyZSIsIm5iZiI6MTc0NTM3MDE0OS42NzYsInN1YiI6IjY4MDgzYzI1Mjc2YmY2NGU0MWFiMmIxNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rToCAWGLlBOuR22kDgwIgmzj0w41Qac3g6EsZ71q-dg"

// URL base para la API de TMDb
const BASE_URL = "https://api.themoviedb.org/3"

// Opciones para las solicitudes a la API
const options = {
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
}

// Interfaz para las categorías (géneros)
interface Category {
  id: number
  name: string
}

// Interfaz para las películas
interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string
  backdrop_path: string
}

// Interfaz para los videos
interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
}

// Función para obtener las categorías (géneros) de películas
export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${BASE_URL}/genre/movie/list?language=es`, options)

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()
    return data.genres
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

// Función para obtener películas por categoría (género)
export async function fetchMoviesByCategory(categoryId: number): Promise<Movie[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?with_genres=${categoryId}&language=es&sort_by=popularity.desc`,
      options,
    )

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()
    return data.results
  } catch (error) {
    console.error("Error fetching movies by category:", error)
    return []
  }
}

// Función para obtener una película destacada (película popular)
export async function fetchFeaturedMovie(): Promise<Movie> {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?language=es&page=1`, options)

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()
    // Devolver la primera película de la lista de populares
    return data.results[0]
  } catch (error) {
    console.error("Error fetching featured movie:", error)
    throw error
  }
}

// Función para buscar películas por término
export async function searchMovies(query: string): Promise<Movie[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=es&page=1`,
      options,
    )

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()
    return data.results
  } catch (error) {
    console.error("Error searching movies:", error)
    return []
  }
}

// Función para obtener detalles de una película específica
export async function fetchMovieDetails(movieId: number): Promise<Movie> {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?language=es`, options)

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching movie details:", error)
    throw error
  }
}

// Función para obtener videos (trailers) de una película
export async function fetchMovieVideos(movieId: number): Promise<Video[]> {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?language=es`, options)

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()

    // Si no hay videos en español, intentar con videos en inglés
    if (data.results.length === 0) {
      const enResponse = await fetch(`${BASE_URL}/movie/${movieId}/videos?language=en-US`, options)

      if (!enResponse.ok) {
        throw new Error(`Error: ${enResponse.status}`)
      }

      const enData = await enResponse.json()
      return enData.results
    }

    return data.results
  } catch (error) {
    console.error("Error fetching movie videos:", error)
    return []
  }
}

// Función para obtener el trailer de una película
export async function fetchMovieTrailer(movieId: number): Promise<string | null> {
  try {
    const videos = await fetchMovieVideos(movieId)

    // Buscar primero un trailer oficial
    const trailer = videos.find(
      (video) => video.site === "YouTube" && (video.type === "Trailer" || video.type === "Teaser"),
    )

    // Si no hay trailer, devolver el primer video disponible
    if (!trailer && videos.length > 0) {
      return videos[0].key
    }

    return trailer ? trailer.key : null
  } catch (error) {
    console.error("Error fetching movie trailer:", error)
    return null
  }
}

// Función para obtener el ID de TMDb de una película por su título
export async function fetchMovieIdByTitle(title: string): Promise<number | null> {
  try {
    const movies = await searchMovies(title)

    if (movies.length > 0) {
      return movies[0].id
    }

    return null
  } catch (error) {
    console.error("Error fetching movie ID by title:", error)
    return null
  }
}
