import { NextResponse } from "next/server"

// Simulación de base de datos para usuarios
const users = [
  {
    id: 1,
    name: "Usuario Demo",
    email: "demo@example.com",
    password: "password123",
  },
]

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validar datos
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Faltan campos requeridos" }, { status: 400 })
    }

    // Verificar si el correo ya existe
    const existingUser = users.find((user) => user.email === email)
    if (existingUser) {
      return NextResponse.json({ message: "El correo electrónico ya está registrado" }, { status: 409 })
    }

    // Crear nuevo usuario
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password, // En una aplicación real, la contraseña debería estar hasheada
    }

    users.push(newUser)

    // Generar token (simulado)
    const token = `token_${Date.now()}_${newUser.id}`

    // Devolver respuesta sin incluir la contraseña
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    console.error("Error en registro:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
