import Link from "next/link"
import { MovieHero } from "@/components/movie-hero"
import { MainNav } from "@/components/main-nav"
import { MotionContainer } from "@/components/animations/motion-container"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerContainer } from "@/components/animations/stagger-container"
import { StaggerItem } from "@/components/animations/stagger-item"
import { MotionButton } from "@/components/animations/motion-button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="fixed top-0 z-50 w-full bg-gradient-to-b from-black/80 to-transparent">
        <div className="container mx-auto py-4">
          <MainNav />
        </div>
      </header>

      <main className="flex-1">
        <MotionContainer>
          <MovieHero />

          <section className="container mx-auto px-4 py-16 text-center">
            <FadeIn delay={0.3}>
              <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
                Descubre y organiza tus películas favoritas
              </h1>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
                MovieVault te permite explorar miles de películas, crear tu colección personal y mantener un registro de
                lo que has visto y lo que quieres ver.
              </p>
            </FadeIn>
            <FadeIn delay={0.5} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <MotionButton asChild size="lg" className="bg-red-600 hover:bg-red-700">
                <Link href="/explore">Explorar películas</Link>
              </MotionButton>
              <MotionButton asChild variant="outline" size="lg">
                <Link href="/register">Crear cuenta</Link>
              </MotionButton>
            </FadeIn>
          </section>

          <section className="container mx-auto px-4 py-16">
            <h2 className="mb-8 text-center text-3xl font-bold">Características principales</h2>
            <StaggerContainer className="grid gap-8 md:grid-cols-3">
              <StaggerItem className="rounded-lg bg-gray-900 p-6">
                <h3 className="mb-4 text-xl font-semibold">Explora películas</h3>
                <p className="text-gray-300">Navega por un extenso catálogo de películas organizadas por categorías.</p>
              </StaggerItem>
              <StaggerItem className="rounded-lg bg-gray-900 p-6">
                <h3 className="mb-4 text-xl font-semibold">Gestiona tu colección</h3>
                <p className="text-gray-300">
                  Añade películas a tu colección personal y marca su estado como Visto o Pendiente.
                </p>
              </StaggerItem>
              <StaggerItem className="rounded-lg bg-gray-900 p-6">
                <h3 className="mb-4 text-xl font-semibold">Personaliza tu perfil</h3>
                <p className="text-gray-300">Edita tu información personal y mantén tu cuenta actualizada.</p>
              </StaggerItem>
            </StaggerContainer>
          </section>
        </MotionContainer>
      </main>

      <footer className="bg-gray-900 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2025 MovieVault. Todos los derechos reservados.</p>
          <p className="mt-2 text-sm">Desarrollado por <strong className="italic">Juan Valenzuela</strong></p>
        </div>
      </footer>
    </div>
  )
}
