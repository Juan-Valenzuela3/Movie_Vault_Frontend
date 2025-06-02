# 🎬 MovieVault - Frontend

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Framer_Motion-Latest-FF6B9D?style=for-the-badge&logo=framer" alt="Framer Motion">
</div>

---

**MovieVault** es una aplicación web moderna y elegante para descubrir, explorar y gestionar tu colección personal de películas. Construida con las últimas tecnologías web, ofrece una experiencia inmersiva con animaciones fluidas, diseño responsivo y una integración completa con The Movie Database (TMDb) API.

## ✨ Características Principales

### 🎭 **Experiencia Cinematográfica Completa**
- **Hero Dinámico**: Película destacada rotativa con información detallada
- **Exploración por Categorías**: Navega por géneros como Acción, Drama, Comedia, Terror, etc.
- **Búsqueda Inteligente**: Motor de búsqueda en tiempo real con autocompletado
- **Trailers Integrados**: Reproductor de trailers oficiales de YouTube embebido

### 👤 **Gestión Personal**
- **Colección Personalizada**: Añade películas a tu biblioteca personal
- **Sistema de Estados**: Marca películas como "Visto" o "Pendiente"
- **Autenticación Segura**: Sistema de login/registro con JWT tokens
- **Perfil de Usuario**: Gestiona tu información personal y preferencias

### 🎨 **Diseño y UX**
- **Interfaz Moderna**: Diseño dark theme con elementos glassmorphism
- **Animaciones Fluidas**: Transiciones suaves con Framer Motion
- **Responsive Design**: Optimizado para desktop, tablet y móvil
- **Componentes Accesibles**: UI components basados en Radix UI

## 🏗️ Arquitectura del Sistema

MovieVault utiliza una **arquitectura full-stack distribuida**:

- **Frontend**: Next.js 15 con App Router (este repositorio)
- **Backend**: API REST con Node.js y Spring Boot → [Ver Backend](https://github.com/Juan-Valenzuela3/MovieVault-Backend)
- **Base de Datos**: Sistema de persistencia para usuarios y colecciones
- **APIs Externas**: Integración con TMDb API para datos cinematográficos

## 🛠️ Stack Tecnológico

### **Core Framework**
- **Next.js 15.2.4** - Framework React con App Router
- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript 5** - Tipado estático para JavaScript

### **Estilizado y UI**
- **Tailwind CSS 3.4** - Framework CSS utility-first
- **shadcn/ui** - Componentes accesibles y personalizables
- **Radix UI** - Primitivos de UI sin estilos
- **Lucide React** - Iconografía moderna

### **Animaciones y UX**
- **Framer Motion** - Animaciones y transiciones fluidas
- **Embla Carousel** - Carruseles optimizados
- **React Hook Form** - Gestión de formularios
- **Sonner** - Sistema de notificaciones toast

### **Utilidades y Herramientas**
- **Zod** - Validación de esquemas TypeScript
- **Class Variance Authority** - Gestión de variantes de CSS
- **Date-fns** - Manipulación de fechas
- **clsx** - Utilidad para clases condicionales

## 📁 Estructura del Proyecto

```
MovieVault-Frontend/
├── 📂 app/                          # Next.js 15 App Router
│   ├── 📂 api/                      # API Routes (proxy endpoints)
│   │   ├── 📂 movies/               # Endpoints de películas
│   │   └── 📂 users/                # Endpoints de usuarios
│   ├── 📂 collection/               # Página de colección personal
│   ├── 📂 explore/                  # Catálogo de películas
│   ├── 📂 search/                   # Búsqueda de películas
│   ├── 📂 login/                    # Autenticación
│   ├── 📂 register/                 # Registro de usuarios
│   ├── 📂 profile/                  # Perfil de usuario
│   ├── layout.tsx                   # Layout principal
│   └── page.tsx                     # Página de inicio
├── 📂 components/                   # Componentes reutilizables
│   ├── 📂 ui/                       # Componentes base (shadcn/ui)
│   ├── 📂 animations/               # Componentes de animación
│   ├── main-nav.tsx                 # Navegación principal
│   ├── movie-grid.tsx               # Grid de películas
│   ├── movie-hero.tsx               # Hero de película destacada
│   ├── featured-movie.tsx           # Componente de película destacada
│   └── collection-grid.tsx          # Grid de colección personal
├── 📂 hooks/                        # Custom React Hooks
│   ├── use-auth.tsx                 # Hook de autenticación
│   ├── use-mobile.tsx               # Hook para detección móvil
│   └── use-toast.ts                 # Hook para notificaciones
├── 📂 lib/                          # Utilidades y servicios
│   ├── api.ts                       # Cliente API del backend
│   ├── tmdb-api.ts                  # Cliente TMDb API
│   └── utils.ts                     # Utilidades generales
├── 📂 public/                       # Archivos estáticos
└── 📂 styles/                       # Estilos globales
```

## 🎯 Páginas y Funcionalidades

### 🏠 **Página Principal**
- Hero dinámico con película destacada
- Llamadas a la acción para explorar y registrarse
- Información del proyecto y características

### 🔍 **Exploración de Películas**
- Navegación por categorías/géneros
- Grid infinito de películas con lazy loading
- Vista detallada de películas con trailers
- Añadir a colección personal

### 🔎 **Búsqueda Avanzada**
- Búsqueda en tiempo real por título
- Filtros por género y año
- Resultados con paginación
- Vista previa rápida de películas

### 📚 **Mi Colección**
- Vista de películas guardadas
- Filtros por estado: "Visto" / "Pendiente"
- Gestión de estados de visualización
- Eliminación de películas de la colección

### 👤 **Gestión de Usuario**
- Registro con validación de datos
- Login seguro con JWT
- Perfil editable
- Persistencia de sesión

## 🚀 Instalación y Configuración

### **Prerrequisitos**
- Node.js 18+ y npm/pnpm
- Cuenta en TMDb para API key
- Backend de MovieVault ejecutándose

### **1. Clonar el Repositorio**
```bash
git clone https://github.com/Juan-Valenzuela3/MovieVault-Frontend.git
cd MovieVault-Frontend
```

### **2. Instalar Dependencias**
```bash
npm install
# o
pnpm install
```

### **3. Configurar Variables de Entorno**
```bash
# Crear archivo .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_TMDB_API_KEY=tu_tmdb_api_key
```

### **4. Ejecutar en Desarrollo**
```bash
npm run dev
# o
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

### **5. Build para Producción**
```bash
npm run build
npm start
```

## 🔧 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linting con ESLint
```

## 🌐 Integración con Backend

Este frontend se conecta con el backend de MovieVault para:

- **Autenticación de usuarios** (registro, login, tokens)
- **Gestión de colecciones** (CRUD de películas personales)
- **Persistencia de datos** (estados, preferencias)
- **Sincronización** entre dispositivos

**Repositorio del Backend**: [MovieVault-Backend](https://github.com/Juan-Valenzuela3/MovieVault-Backend)

## 📱 Características Técnicas

### **Optimizaciones de Rendimiento**
- **Image Optimization**: Componente Next.js Image optimizado
- **Code Splitting**: Carga lazy de componentes
- **Static Generation**: Páginas pre-renderizadas
- **Caching**: Estrategias de cache para APIs

### **Accesibilidad**
- **Keyboard Navigation**: Navegación completa por teclado
- **Screen Reader**: Compatible con lectores de pantalla
- **ARIA Labels**: Etiquetas semánticas
- **Color Contrast**: Cumple estándares WCAG

### **SEO y Metadatos**
- **Meta Tags**: Optimización para motores de búsqueda
- **Open Graph**: Integración con redes sociales
- **Sitemap**: Generación automática
- **Schema.org**: Marcado estructurado

## 🎨 Diseño y Tema

MovieVault utiliza un **tema oscuro elegante** con:

- **Colores primarios**: Rojos cinematográficos (#DC2626, #EF4444)
- **Fondo**: Grises oscuros (#000000, #111111, #1F1F1F)
- **Acentos**: Grises medios para contraste (#6B7280, #9CA3AF)
- **Tipografía**: Inter font para legibilidad óptima

## 📊 Analytics y Métricas

MovieVault incluye tracking de:
- **Rendimiento**: Core Web Vitals
- **Usabilidad**: Heatmaps y user flows
- **Errores**: Error tracking y reporting
- **Engagement**: Métricas de uso y retención

## 🔒 Seguridad y Privacidad

- **Autenticación JWT** con refresh tokens
- **Validación client-side** con Zod schemas
- **Rate limiting** en API calls
- **Sanitización** de inputs de usuario
- **HTTPS** obligatorio en producción
- **Cookie policies** y GDPR compliance

## 📱 Capturas de Pantalla

### **Página Principal**
![Home Page](/public/Home-page.webp)

### **Exploración**
![Explore Page](/public/Explorer-page.webp)

### **Mi Colección**
![Collection Page](/public/Colletion-page.webp)

## 🏆 Reconocimientos

- **TMDb API** por proporcionar datos cinematográficos
- **shadcn/ui** por los componentes de interfaz
- **Vercel** por el hosting y deployment
- **Comunidad Open Source** por las librerías utilizadas

## 📄 Licencia

Este proyecto está licenciado bajo [Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License](https://creativecommons.org/licenses/by-nc-nd/4.0/).

### **Permisos**
- ✅ **Ver y compartir** - Puedes ver y compartir este código
- ✅ **Uso educativo** - Perfecto para aprender y referencia
- ✅ **Fork personal** - Para proyectos de aprendizaje

### **Restricciones**
- ❌ **No modificaciones** - No puedes modificar y redistribuir
- ❌ **No uso comercial** - No puedes usar este código comercialmente
- ❌ **Sin derivados** - No puedes crear trabajos basados en este código

### **Atribución Requerida**
Al usar o referenciar este código, debes dar crédito:
```
MovieVault por Juan Valenzuela
GitHub: https://github.com/Juan-Valenzuela3
```

## 👨‍💻 Autor

<div align="center">  
  
  **Juan Valenzuela**
  
  *Full Stack Developer & Movie Enthusiast*
  
  [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Juan-Valenzuela3)
  [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/juan-valenzuela-camelo)
</div>

---

<div align="center">
  <h3>🎬 ¡Gracias por explorar MovieVault! 🍿</h3>
  <p><em>Construido con ❤️ para los amantes del cine</em></p>
  
  **Si te gusta el proyecto, ¡no olvides darle una ⭐!**
</div>
