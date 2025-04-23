"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Film, User, LogIn, Menu, X, Search, BookmarkCheck } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"

export function MainNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const toggleSearch = () => {
    setSearchOpen(!searchOpen)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery("")
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-red-600">
          <Film className="h-6 w-6" />
          <span>MovieVault</span>
        </Link>

        {/* Navegación de escritorio */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/explore"
            className={cn(
              "text-sm font-medium transition-colors hover:text-red-600 flex items-center gap-1",
              pathname === "/explore" ? "text-red-600" : "text-gray-300",
            )}
          >
            <Search className="h-4 w-4" />
            Explorar
          </Link>
          {isAuthenticated && (
            <>
              <Link
                href="/collection"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-red-600 flex items-center gap-1",
                  pathname === "/collection" ? "text-red-600" : "text-gray-300",
                )}
              >
                <BookmarkCheck className="h-4 w-4" />
                Mi Colección
              </Link>
              <Link
                href="/profile"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-red-600 flex items-center gap-1",
                  pathname === "/profile" ? "text-red-600" : "text-gray-300",
                )}
              >
                <User className="h-4 w-4" />
                Mi Perfil
              </Link>
            </>
          )}
        </nav>

        {/* Botones de escritorio */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleSearch}>
            <Search className="h-5 w-5" />
          </Button>

          {isAuthenticated ? (
            <Button variant="outline" size="sm" onClick={logout}>
              Cerrar Sesión
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Iniciar Sesión
                </Link>
              </Button>
              <Button asChild className="bg-red-600 hover:bg-red-700" size="sm">
                <Link href="/register">Registrarse</Link>
              </Button>
            </>
          )}
        </div>

        {/* Botón de menú móvil */}
        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleSearch}>
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 bg-gray-900 rounded-lg shadow-lg p-4 border border-gray-800"
          >
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Buscar películas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-gray-700 bg-gray-800 flex-1"
                autoFocus
              />
              <Button type="submit" className="bg-red-600 hover:bg-red-700">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menú móvil */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 bg-gray-900 rounded-lg shadow-lg p-4 border border-gray-800 md:hidden"
          >
            <nav className="flex flex-col gap-4">
              <Link
                href="/explore"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-red-600 py-2 flex items-center gap-2",
                  pathname === "/explore" ? "text-red-600" : "text-gray-300",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Search className="h-4 w-4" />
                Explorar
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    href="/collection"
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-red-600 py-2 flex items-center gap-2",
                      pathname === "/collection" ? "text-red-600" : "text-gray-300",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <BookmarkCheck className="h-4 w-4" />
                    Mi Colección
                  </Link>
                  <Link
                    href="/profile"
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-red-600 py-2 flex items-center gap-2",
                      pathname === "/profile" ? "text-red-600" : "text-gray-300",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Mi Perfil
                  </Link>
                </>
              )}
              <div className="border-t border-gray-800 my-2"></div>
              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                  >
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button asChild variant="ghost" size="sm" className="justify-start">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <LogIn className="mr-2 h-4 w-4" />
                      Iniciar Sesión
                    </Link>
                  </Button>
                  <Button asChild className="bg-red-600 hover:bg-red-700" size="sm">
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      Registrarse
                    </Link>
                  </Button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
