import { Movie } from "@prisma/client"

export type ActionButtonsProps = {
    movieId: string
    movie: Movie
    isMyList: boolean
}