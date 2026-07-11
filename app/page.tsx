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

type GenreStatus = "loading" | "loaded" | "error";

export default function Home() {
  const [latestMovies, setLatestMovies] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [moviesByGenre, setMoviesByGenre] = useState<{ [key: string]: Movie[] }>({});

  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [latestLoading, setLatestLoading] = useState(true);
  const [genreStatuses, setGenreStatuses] = useState<Record<string, GenreStatus>>({});

  useEffect(() => {
    const controller = new AbortController();

    // Load the hero independently: it must not wait for TMDB catalogue calls.
    getFeaturedMovie(controller.signal)
      .then(setFeaturedMovie)
      .catch((error) => {
        if (error.name !== "AbortError") console.error("Error fetching featured movie:", error);
      })
      .finally(() => setFeaturedLoading(false));

    const loadLandingCarousels = async () => {
      // Prioritize the first carousel before putting the genre requests in flight.
      try {
        const latest = await getLatestMovies(controller.signal);
        setLatestMovies(latest);
      } catch (error) {
        if (!controller.signal.aborted) console.error("Error fetching latest movies:", error);
      } finally {
        if (!controller.signal.aborted) setLatestLoading(false);
      }

      if (controller.signal.aborted) return;

      setGenreStatuses(
        genres.reduce((statuses, genre) => {
          statuses[genre] = "loading";
          return statuses;
        }, {} as Record<string, GenreStatus>)
      );

      // Each response updates its own section; one slow genre no longer blocks the rest.
      genres.forEach(async (genre) => {
        try {
          const movies = await getMoviesByGenre(genre, controller.signal);
          setMoviesByGenre((current) => ({ ...current, [genre]: movies }));
          setGenreStatuses((current) => ({ ...current, [genre]: "loaded" }));
        } catch (error) {
          if (!controller.signal.aborted) {
            console.error(`Error fetching movies by genre: ${genre}`, error);
            setGenreStatuses((current) => ({ ...current, [genre]: "error" }));
          }
        }
      });
    };

    loadLandingCarousels();

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
      {genres.map((genre, index) => {
        const status = genreStatuses[genre];

        if (!status || status === "loading") {
          return (
            <CarouselSkeleton
              key={genre}
              accent={SKELETON_ACCENTS[index % SKELETON_ACCENTS.length]}
              titleWidth={260}
            />
          );
        }

        return moviesByGenre[genre]?.length > 0 ? (
          <LazyLoader key={genre}>
            <DaisyCarousel
              title={`Lo último en el género ${genre}`}
              movies={moviesByGenre[genre]}
            />
          </LazyLoader>
        ) : null;
      })}

      <Footer />
    </main>
  );
}
