"use client";

import Image from "next/image";
import { TrendingMoviesProps } from "./TrendingMovies.types";
import { InfoExtraFilm } from "./InfoExtraFilm";
import { useRouter } from "next/navigation";

export function TrendingMovies(props: TrendingMoviesProps) {
  const { movies } = props;
  const router = useRouter();
  return (
    <div className="pt-11 md:pt-0 md:-top-24 lg:-top-28 relative px-[4%]">
      <h3 className="text-2xl font-semibold mb-3">
        Las películas más populares hoy
      </h3>

      <div>
        <div className="grid sm:grid-cols-1 md:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex cursor-pointer transition delay-300  group relative"
            >
              <div
                className="flex md:transition md:duration 
              md:group-hover:opacity-90 md:delay-300 w-full justify-center"
                onClick={() => router.push(`/movie/${movie.id}`)}
              >
                <Image
                  src={`https://raw.githubusercontent.com/ratasi/images-netflix-clone/refs/heads/main/ranking/${movie.ranking}.png`}
                  alt="Number"
                  width={116}
                  height={150}
                  className="object-contain	 w-auto md:max-h-[180px] lg:max-h-full"
                />
                <Image
                  src={movie.thumbnailUrl}
                  alt="Image"
                  width={116}
                  height={150}
                  className=" md:max-h-[180px] lg:max-h-full"
                />
              </div>
              <InfoExtraFilm movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
