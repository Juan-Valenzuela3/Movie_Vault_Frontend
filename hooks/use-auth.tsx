"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { loginUser, registerUser } from "@/lib/api"

interface User {
  id?: number
  name: string
  email: string
}

// Definir la interfaz para la respuesta del registro
interface RegisterResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<RegisterResponse>
  logout: () => void
  updateUserData: (userData: User) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => ({ token: '', user: { name: '', email: '' } }),
  logout: () => {},
  updateUserData: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Cargar datos de autenticación desde localStorage al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
  }, [])

  // Función para iniciar sesión
  const login = async (email: string, password: string) => {
    const response = await loginUser(email, password)

    setToken(response.token)
    setUser(response.user)
    setIsAuthenticated(true)

    // Guardar en localStorage
    localStorage.setItem("token", response.token)
    localStorage.setItem("user", JSON.stringify(response.user))
  }

  // Función para registrarse
  const register = async (name: string, email: string, password: string) => {
    const response = await registerUser(name, email, password)
    
    // Para un registro que requiere confirmación por email, no deberíamos
    // establecer el token ni considerar al usuario como autenticado aún
    
    // Solo guardamos la información del usuario para mostrarla en el modal de confirmación
    // pero sin autenticar la sesión
    setUser({ name, email });
    
    // No establecemos el token ni isAuthenticated
    // No guardamos información en localStorage
    
    return response;
  }

  // Función para cerrar sesión
  const logout = () => {
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)

    // Eliminar de localStorage
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  // Función para actualizar los datos del usuario en el contexto
  const updateUserData = (userData: User) => {
    // Si tenemos un usuario actual, mantener los campos que no se actualizan
    const updatedUser = user ? { ...user, ...userData } : userData

    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, register, logout, updateUserData }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
