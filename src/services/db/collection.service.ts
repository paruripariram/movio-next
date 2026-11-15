"use server"

import { db } from "@/lib/db";
import type { collectionItem } from "@/types";
import 'temporal-polyfill/global';
import { getMovieGenres, getTvGenres } from "@/services/tmdb/movieService";

type MediaStatus = {
    status: "watched" | "wishlist";
    platform?: string;
} | null;

export async function getCollection(userId: string): Promise<collectionItem[]> {
    const collection = await db.orm.public.Collection.where({ userId }).all();
    if (collection.length === 0) return [];

    const formattedItems: collectionItem[] = [];

    for (const item of collection) {
        const movie = await db.orm.public.Movie.where({
            tmdbId: item.movieId,
        }).first();

        if (!movie) continue;

        const movieGenres = await db.orm.public.MovieGenre.where({
            movieId: item.movieId,
        }).all();

        const genreIds = movieGenres.map((mg) => mg.genreId);

        formattedItems.push({
            id: movie.tmdbId,
            title: movie.title,
            type: movie.type as "movie" | "tv",
            poster_path: movie.posterPath,
            vote_average: movie.voteAverage ?? 0,
            genre_ids: genreIds,
            release_date: movie.releaseDate
                ? movie.releaseDate.toString().split("T")[0]
                : "",
            status: item.status as "watched" | "wishlist",
            platform: item.platform || "",
            addedAt: item.addedAt ? item.addedAt.toString() : undefined,
            watchedAt: item.watchedAt ? item.watchedAt.toString() : null,
        });
    }
    return formattedItems;
}

export async function checkMediaStatus(
    userId: string,
    type: "movie" | "tv",
    mediaId: number,
): Promise<MediaStatus> {
    const item = await db.orm.public.Collection.where({
        userId,
        movieId: mediaId,
    }).first();

    if (!item) return null;

    if (item.status === "watched" || item.status === "wishlist") {
        return { status: item.status, platform: item.platform ?? "" };
    }
    return null;
}

export async function addToCollection(
    userId: string,
    type: "movie" | "tv",
    mediaId: number,
    movieData: collectionItem,
): Promise<void> {
    const existingMovies = await db.orm.public.Movie.where({
        tmdbId: mediaId,
    }).all();

    if (existingMovies.length === 0) {
        await db.orm.public.Movie.create({
            tmdbId: mediaId,
            title: movieData.title,
            type,
            posterPath: movieData.poster_path,
            voteAverage: movieData.vote_average,
            releaseDate: movieData.release_date
                ? Temporal.Instant.from(
                      new Date(movieData.release_date).toISOString(),
                  )
                : null,
        });

        if(movieData.genre_ids && movieData.genre_ids.length > 0) {
            const [movieGenres, tvGenres] = await Promise.all([
                            getMovieGenres(),
                            getTvGenres(),
                        ]);
            for(const genreId of movieData.genre_ids) {
                const existingGenre = await db.orm.public.Genre.where({id: genreId}).all();
                if(existingGenre.length === 0) {
                    const genreName = (type === "movie" ? movieGenres[genreId] : tvGenres[genreId]) || "Неизвестно";
                    await db.orm.public.Genre.create({
                        id: genreId,
                        name: genreName,
                    })
                }
                await db.orm.public.MovieGenre.create({
                    movieId: mediaId,
                    genreId: genreId,
                });
            }
        }
    } else {
        await db.orm.public.Movie.where({ tmdbId: mediaId }).update({
            voteAverage: movieData.vote_average ?? 0,
            posterPath: movieData.poster_path ?? null,
        });

        const existingEntry = await db.orm.public.Collection.where({
            userId,
            movieId: mediaId,
        }).all();

        if (existingEntry.length > 0) {
            await db.orm.public.Collection.where({
                userId,
                movieId: mediaId,
            }).update({
                status: movieData.status,
                platform: movieData.platform ?? null,
                watchedAt: movieData.watchedAt
                    ? Temporal.Instant.from(
                          new Date(movieData.watchedAt).toISOString(),
                      )
                    : null,
            });
        } else {
            await db.orm.public.Collection.create({
                userId,
                movieId: mediaId,
                status: movieData.status,
                platform: movieData.platform ?? null,
                addedAt: Temporal.Now.instant(),
                watchedAt: movieData.watchedAt
                    ? Temporal.Instant.from(
                          new Date(movieData.watchedAt).toISOString(),
                      )
                    : null,
            });
        }
    }
}

export async function removeFromCollection(
    userId: string,
    type: "movie" | "tv",
    mediaId: number,
): Promise<void> {
    await db.orm.public.Collection.where({
        userId,
        movieId: mediaId,
    }).delete();
}
