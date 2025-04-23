"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ScaleOnHover } from "@/components/animations/scale-on-hover"
import { StaggerContainer } from "@/components/animations/stagger-container"
import { StaggerItem } from "@/components/animations/stagger-item"

interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string
  backdrop_path: string
}

interface MovieGridProps {
  movies: Movie[]
  onSelectMovie: (movie: Movie) => void
}

export function MovieGrid({ movies, onSelectMovie }: MovieGridProps) {
  return (
    <StaggerContainer className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {movies.map((movie) => (
        <StaggerItem key={movie.id}>
          <ScaleOnHover>
            <Card
              className="overflow-hidden border-gray-800 bg-gray-900 transition-transform cursor-pointer"
              onClick={() => onSelectMovie(movie)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-[2/3] w-full">
                  {movie.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-800 text-gray-400">
                      No imagen
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <h3 className="line-clamp-2 text-sm font-medium">{movie.title}</h3>
                </div>
              </CardContent>
            </Card>
          </ScaleOnHover>
        </StaggerItem>
      ))}
    </StaggerContainer>
  )
}
