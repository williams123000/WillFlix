import { BlockMovies } from "@/components/Shared/BlockMovies";
import { ListMoviesProps } from "./ListMovies.types";

export function ListMovies(props: ListMoviesProps) {
    const { movies } = props;
    return (
    <div>
        <BlockMovies 
        title="Películas más recientes" 
        movies={movies}
        isMyList={false}
        />
        </div>
    )
    }