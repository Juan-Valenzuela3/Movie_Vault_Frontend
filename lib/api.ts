// URL base para la API del backend
const API_BASE_URL = "https://movievault-backend.onrender.com"

// Interfaz para el usuario
interface User {
  id?: number
  name: string
  email: string
}

// Interfaz para la película en la colección
interface Movie {
  id?: number
  nameMovie: string
  category: string
  image: string
  status: "Visto" | "Pendiente"
  tmdbId?: number
}

// Interfaz para la película tal como viene del backend
interface BackendMovie {
  idMovie: number
  nameMovie: string
  category: string
  image: string
  status: "WATCHED" | "PENDING"
  tmdbId?: number
  userId?: string
  // ... otros campos que pueda tener
}

// Interfaz para la actualización del perfil
interface ProfileUpdate {
  name?: string
  email?: string
}

// Interfaz para la respuesta de autenticación de Supabase
interface AuthResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  user: {
    id: string
    email: string
    user_metadata: {
      name: string
    }
  }
}

// Función para registrar un nuevo usuario
export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<{ token: string; user: User }> {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      name: name,
      email: email,
      password: password,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || "Error al registrar usuario")
  }

  // Al tratarse de un registro con confirmación por email, 
  // es posible que no recibamos un token ni todos los datos del usuario aún
  const data = await response.json()
  
  // Creamos un objeto de usuario con la información que tenemos disponible
  const user = {
    name: name, // Usamos el nombre proporcionado en la solicitud
    email: email // Usamos el email proporcionado en la solicitud
  }

  const token = data.access_token || ""

  return {
    token: token,
    user: user,
  }
}

// Función para iniciar sesión
export async function loginUser(email: string, password: string): Promise<{ token: string; user: User }> {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      email: email,
      password: password,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || "Error al iniciar sesión")
  }

  const data = (await response.json()) as AuthResponse

  // Extraer información del usuario del token JWT
  // En una aplicación real, podrías decodificar el JWT para obtener más información
  const user = {
    name: data.user.user_metadata.name,
    email: data.user.email,
  }

  return {
    token: data.access_token,
    user,
  }
}

// Función para obtener las películas del usuario
export async function getUserMovies(token: string): Promise<Movie[]> {
  const response = await fetch(`${API_BASE_URL}/movies`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || "Error al obtener películas")
  }

  const movies = await response.json() as BackendMovie[];
  // Convertir la respuesta del backend al formato esperado por el frontend
  return movies.map(movie => ({
    ...movie,
    status: movie.status === "WATCHED" ? "Visto" : "Pendiente",
    id: movie.idMovie
  }));
}

// Función para añadir una película a la colección
export async function addMovieToCollection(movie: Omit<Movie, "id" | "status">, token: string): Promise<Movie> {
  // Asegurarse de que la película tenga el estado "Pendiente" por defecto
  // y que siempre tenga tmdbId si está disponible
  const movieWithStatus = {
    ...movie,
    status: "PENDING",
    tmdbId: movie.tmdbId || null  // Asegurarnos de incluir el tmdbId
  }

  const response = await fetch(`${API_BASE_URL}/movies`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movieWithStatus),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || "Error al añadir película")
  }

  const addedMovie = await response.json();
  // Convertir la respuesta del backend al formato esperado por el frontend
  return {
    ...addedMovie,
    status: addedMovie.status === "WATCHED" ? "Visto" : "Pendiente",
    id: addedMovie.idMovie,
    tmdbId: addedMovie.tmdbId || movie.tmdbId  // Preservar el tmdbId aunque el backend no lo devuelva
  };
}

// Función para eliminar una película de la colección
export async function deleteMovie(movieId: number, token: string): Promise<void> {
  // Verificar que movieId no sea undefined o null
  if (!movieId) {
    throw new Error("ID de película no válido");
  }
  
  const response = await fetch(`${API_BASE_URL}/movies/${movieId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || "Error al eliminar película")
  }
}

// Función para actualizar el estado de una película
export async function updateMovieStatus(movieId: number, status: "Visto" | "Pendiente", token: string): Promise<Movie> {
  // Verificar que movieId no sea undefined o null
  if (!movieId) {
    throw new Error("ID de película no válido");
  }
  
  // Convertir el estado del frontend al formato esperado por el backend
  const statusBackend = status === "Visto" ? "WATCHED" : "PENDING";

  const response = await fetch(`${API_BASE_URL}/movies/${movieId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      status: statusBackend 
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || "Error al actualizar estado")
  }

  const movie = await response.json();
  // Convertir el estado del backend al formato esperado por el frontend
  return {
    ...movie,
    status: movie.status === "WATCHED" ? "Visto" : "Pendiente",
    id: movie.idMovie
  };
}

// Función para actualizar el perfil del usuario
export async function updateUserProfile(profileData: ProfileUpdate, token: string): Promise<User> {
  // Construir los parámetros de consulta
  const params = new URLSearchParams()
  if (profileData.name) params.append("name", profileData.name)
  if (profileData.email) params.append("email", profileData.email)

  const response = await fetch(`${API_BASE_URL}/users/update?${params.toString()}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || "Error al actualizar perfil")
  }

  const updatedUser: User = {
    name: profileData.name || "",
    email: profileData.email || "",
  }

  return updatedUser
}

// Función para verificar si una película está en la colección
export async function checkMovieInCollection(movieId: number, token: string): Promise<boolean> {
  try {
    const movies = await getUserMovies(token)
    return movies.some((movie) => movie.tmdbId === movieId)
  } catch (error) {
    console.error("Error checking movie in collection:", error)
    return false
  }
}
