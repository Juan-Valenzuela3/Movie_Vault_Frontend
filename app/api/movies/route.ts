import { NextResponse } from "next/server"
import { headers } from "next/headers"

// Simulación de base de datos para películas
const movies = [
  {
    id: 1,
    userId: 1,
    nameMovie: "Inception",
    category: "Ciencia Ficción",
    image: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    status: "Visto" as const,
    tmdbId: 27205, // ID de TMDb para Inception
  },
  {
    id: 2,
    userId: 1,
    nameMovie: "The Dark Knight",
    category: "Acción",
    image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    status: "Pendiente" as const,
    tmdbId: 155, // ID de TMDb para The Dark Knight
  },
]

// GET - Obtener películas del usuario
export async function GET(request: Request) {
  try {
    // Verificar token (simulado)
    const headersList = headers()
    const authHeader = headersList.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const userId = Number.parseInt(token.split("_")[2])

    // Filtrar películas por usuario
    const userMovies = movies.filter((movie) => movie.userId === userId)

    return NextResponse.json(userMovies)
  } catch (error) {
    console.error("Error al obtener películas:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}

// POST - Añadir película a la colección
export async function POST(request: Request) {
  try {
    // Verificar token (simulado)
    const headersList = headers()
    const authHeader = headersList.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const userId = Number.parseInt(token.split("_")[2])

    const { nameMovie, category, image, tmdbId } = await request.json()

    // Validar datos
    if (!nameMovie || !category || !image) {
      return NextResponse.json({ message: "Faltan campos requeridos" }, { status: 400 })
    }

    // Crear nueva película
    const newMovie = {
      id: movies.length + 1,
      userId,
      nameMovie,
      category,
      image,
      status: "Pendiente" as const,
      tmdbId, // Guardar el ID de TMDb
    }

    movies.push(newMovie)

    return NextResponse.json(newMovie)
  } catch (error) {
    console.error("Error al añadir película:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
