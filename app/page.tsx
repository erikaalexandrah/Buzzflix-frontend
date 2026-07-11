'use client';
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import DaisyCarousel from "@/components/carousel/carousel";
import Footer from "@/components/footer/footer";
import MovieSection from "@/components/movieSection/movieSection";
import TopCarousel from "@/components/carousel/topCarousel";
import LazyLoader from "@/components/lazyLoader/page";
import CarouselSkeleton from "@/components/skeleton/carouselSkeleton";
import HeroSkeleton from "@/components/skeleton/heroSkeleton";
import { Movie } from "@/config/intefaces";
import { getLatestMovies, getMoviesByGenre } from "@/config/api";
import { getFeaturedMovie } from "@/config/featured";
import { genres } from "@/config/data";

// Acentos que rotan en las cabeceras de los skeletons para dar ritmo visual.
const SKELETON_ACCENTS = ["bg-grape", "bg-coral", "bg-electric", "bg-ink", "bg-bubble"];

export default function Home() {
  const [latestMovies, setLatestMovies] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [moviesByGenre, setMoviesByGenre] = useState<{ [key: string]: Movie[] }>({});

  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [latestLoading, setLatestLoading] = useState(true);
  const [catalogLoading, setCatalogLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    // Load the hero independently: it must not wait for TMDB catalogue calls.
    getFeaturedMovie(controller.signal)
      .then(setFeaturedMovie)
      .catch((error) => {
        if (error.name !== "AbortError") console.error("Error fetching featured movie:", error);
      })
      .finally(() => setFeaturedLoading(false));

    getLatestMovies()
      .then(setLatestMovies)
      .catch((error) => console.error("Error fetching latest movies:", error))
      .finally(() => setLatestLoading(false));

    Promise.allSettled(
      genres.map(async (genre) => ({ genre, movies: await getMoviesByGenre(genre) }))
    )
      .then((results) => {
        const genreResponses = results
          .filter((result): result is PromiseFulfilledResult<{ genre: string; movies: Movie[] }> => result.status === "fulfilled")
          .map((result) => result.value);

        setMoviesByGenre(
          genreResponses.reduce((acc, { genre, movies }) => {
            acc[genre] = movies;
            return acc;
          }, {} as { [key: string]: Movie[] })
        );
      })
      .finally(() => setCatalogLoading(false));

    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <Navbar />

      {/* Hero */}
      {featuredMovie ? (
        <div className="md:mb-10">
          <MovieSection movie={featuredMovie} />
        </div>
      ) : featuredLoading ? (
        <div className="md:mb-10">
          <HeroSkeleton />
        </div>
      ) : null}

      {/* Top: últimas películas */}
      {latestMovies.length > 0 ? (
        <TopCarousel title="Últimas películas" movies={latestMovies} />
      ) : latestLoading ? (
        <CarouselSkeleton accent="bg-coral" titleWidth={200} />
      ) : null}

      {/* Géneros */}
      {catalogLoading
        ? SKELETON_ACCENTS.slice(0, 3).map((accent, i) => (
            <CarouselSkeleton key={i} accent={accent} titleWidth={260} />
          ))
        : genres.map((genre) =>
            moviesByGenre[genre]?.length > 0 ? (
              <LazyLoader key={genre}>
                <DaisyCarousel
                  title={`Lo último en el género ${genre}`}
                  movies={moviesByGenre[genre]}
                />
              </LazyLoader>
            ) : null
          )}

      <Footer />
    </main>
  );
}
