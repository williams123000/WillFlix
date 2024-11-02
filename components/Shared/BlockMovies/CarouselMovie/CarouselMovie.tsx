import Image from "next/image";
import { useEffect, useState } from "react";
import { FastAverageColor } from 'fast-average-color';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

import { ActionsButtons } from "./ActionsButtons";
import { ChaptersInfo } from "./ChaptersInfo";
import { FilmGenres } from "./FilmGenres";
import { CarouselMovieProps } from "./CarouselMovie.types";

export function CarouselMovie(props: CarouselMovieProps) {
  const { movies, isMyList } = props;
  const router = useRouter();
  // Objeto para almacenar los colores dominantes de cada película
  const [dominantColors, setDominantColors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fac = new FastAverageColor();
    
    // Función para obtener el color de una película individual
    const getMovieColor = async (movieId: string, thumbnailUrl: string) => {
      try {
        const color = await fac.getColorAsync(thumbnailUrl);
        setDominantColors(prev => ({
          ...prev,
          [movieId]: `rgba(${color.value[0]}, ${color.value[1]}, ${color.value[2]}, 0.8)`
        }));
      } catch (e) {
        console.error('Error getting average color:', e);
        // Color por defecto en caso de error
        setDominantColors(prev => ({
          ...prev,
          [movieId]: 'rgba(24, 24, 27, 0.8)'
        }));
      }
    };

    // Obtener colores para todas las películas
    movies.forEach(movie => {
      getMovieColor(movie.id, movie.thumbnailUrl);
    });
  }, [movies]);

  return (
    <Carousel className="w-full">
      <CarouselContent className="-ml-1 gap-2 scrollbar-hide">
        {movies.map((movie) => (
          <CarouselItem
            key={movie.id}
            className="pl-1 md:basis-1/2 lg:basis-1/5 transition delay-300 group relative hover:bg-transparent"
          >
            <Card className="cursor-pointer transition delay-300 group relative bg-zinc-900">
              <CardContent 
                className="flex aspect-video items-center justify-center p-6 relative border-none rounded-md bg-zinc-900" 
                onClick={() => router.push(`/movie/${movie.id}`)}
              >
                <Image
                  src={movie.thumbnailUrl}
                  alt="Image"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="rounded-md"
                />
                <div
                  className="opacity-0 absolute top-0 transition-all 
                    duration-300 z-10 invisible sm:visible delay-300
                    w-full bg-zinc-900 rounded-lg scale-0 
                    group-hover:lg:scale-125 group-hover:md:scale-150
                    group-hover:-translate-y-[5vw] group-hover:opacity-100"
                >
                  <Image
                    src={movie.thumbnailUrl}
                    alt="Movie"
                    width={200}
                    height={200}
                    className="cursor-pointer object-cover transition-all duration-300 shadow-xl w-full rounded-t-lg"
                  />
                  <div className="p-2 shadow-lg">
                    <ActionsButtons
                      movieId={movie.id}
                      movie={movie}
                      isMyList={isMyList}
                    />
                    <ChaptersInfo age={movie.age} duration={movie.duration} />
                    <FilmGenres genres={movie.genre} />
                  </div>
                </div>
              </CardContent>
              <div 
                className="relative overflow-hidden rounded-b-md"
                style={{
                  background: dominantColors[movie.id] || 'rgba(24, 24, 27, 0.8)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <p className="text-center text-white p-5 relative z-10">
                  <b>{movie.title}</b>
                </p>
              </div>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}