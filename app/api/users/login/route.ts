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
    const { email, password } = await request.json()

    // Validar datos
    if (!email || !password) {
      return NextResponse.json({ message: "Faltan campos requeridos" }, { status: 400 })
    }

    // Buscar usuario
    const user = users.find((user) => user.email === email && user.password === password)

    if (!user) {
      return NextResponse.json({ message: "Credenciales incorrectas" }, { status: 401 })
    }

    // Generar token (simulado)
    const token = `token_${Date.now()}_${user.id}`

    // Devolver respuesta sin incluir la contraseña
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    console.error("Error en login:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
