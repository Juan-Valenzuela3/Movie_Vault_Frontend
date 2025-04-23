import { NextResponse } from "next/server"
import { headers } from "next/headers"

// Simulación de base de datos para usuarios
const users = [
  {
    id: 1,
    name: "Usuario Demo",
    email: "demo@example.com",
    password: "password123",
  },
]

export async function PUT(request: Request) {
  try {
    // Verificar token (simulado)
    const headersList = headers()
    const authHeader = headersList.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const userId = Number.parseInt(token.split("_")[2])

    // Buscar usuario
    const userIndex = users.findIndex((user) => user.id === userId)

    if (userIndex === -1) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 })
    }

    const { name, email, password, currentPassword } = await request.json()

    // Actualizar datos
    if (name) {
      users[userIndex].name = name
    }

    if (email) {
      // Verificar si el correo ya existe en otro usuario
      const emailExists = users.some((user) => user.email === email && user.id !== userId)
      if (emailExists) {
        return NextResponse.json({ message: "El correo electrónico ya está en uso" }, { status: 409 })
      }
      users[userIndex].email = email
    }

    if (password) {
      // Verificar contraseña actual
      if (currentPassword && users[userIndex].password !== currentPassword) {
        return NextResponse.json({ message: "Contraseña actual incorrecta" }, { status: 400 })
      }
      users[userIndex].password = password
    }

    // Devolver usuario actualizado sin contraseña
    const { password: _, ...userWithoutPassword } = users[userIndex]

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Error al actualizar usuario:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
