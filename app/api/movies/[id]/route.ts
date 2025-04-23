import { NextResponse } from "next/server"
import { headers } from "next/headers"

// Simulación de base de datos para películas
let movies = [
  {
    id: 1,
    userId: 1,
    nameMovie: "Inception",
    category: "Ciencia Ficción",
    image: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    status: "Visto" as const,
  },
  {
    id: 2,
    userId: 1,
    nameMovie: "The Dark Knight",
    category: "Acción",
    image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    status: "Pendiente" as const,
  },
]

// DELETE - Eliminar película
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const movieId = Number.parseInt(params.id)

    // Verificar token (simulado)
    const headersList = headers()
    const authHeader = headersList.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const userId = Number.parseInt(token.split("_")[2])

    // Buscar película
    const movieIndex = movies.findIndex((movie) => movie.id === movieId && movie.userId === userId)

    if (movieIndex === -1) {
      return NextResponse.json({ message: "Película no encontrada" }, { status: 404 })
    }

    // Eliminar película
    movies = movies.filter((_, index) => index !== movieIndex)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar película:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}

// PATCH - Actualizar estado de la película
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const movieId = Number.parseInt(params.id)

    // Verificar token (simulado)
    const headersList = headers()
    const authHeader = headersList.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const userId = Number.parseInt(token.split("_")[2])

    // Buscar película
    const movieIndex = movies.findIndex((movie) => movie.id === movieId && movie.userId === userId)

    if (movieIndex === -1) {
      return NextResponse.json({ message: "Película no encontrada" }, { status: 404 })
    }

    const { status } = await request.json()

    // Validar estado
    if (status !== "Visto" && status !== "Pendiente") {
      return NextResponse.json({ message: "Estado no válido" }, { status: 400 })
    }

    // Actualizar estado
    movies[movieIndex].status = status

    return NextResponse.json(movies[movieIndex])
  } catch (error) {
    console.error("Error al actualizar película:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
