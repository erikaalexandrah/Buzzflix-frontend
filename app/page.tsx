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
import { getLandingMovies, LandingRail } from "@/config/api";
import { getFeaturedMovie } from "@/config/featured";
import { genres } from "@/config/data";

// Acentos que rotan en las cabeceras de los skeletons para dar ritmo visual.
const SKELETON_ACCENTS = ["bg-grape", "bg-coral", "bg-electric", "bg-ink", "bg-bubble"];

type RailsStatus = "loading" | "loaded" | "error";

export default function Home() {
  const [latestMovies, setLatestMovies] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  // Rails en el orden exacto que devuelve el back (géneros y sugerencias intercalados).
  const [rails, setRails] = useState<LandingRail[]>([]);

  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [railsStatus, setRailsStatus] = useState<RailsStatus>("loading");

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
      setRailsStatus("loading");

      try {
        // Autenticación opcional: si hay sesión activa mandamos el Bearer para
        // recibir carruseles personalizados; si no, cae al landing genérico.
        const token = localStorage.getItem("jwt");
        const landing = await getLandingMovies(genres, controller.signal, token);

        if (controller.signal.aborted) return;

        setLatestMovies(landing.latest);
        setRails(landing.genres);
        setRailsStatus("loaded");
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Error fetching landing movies:", error);
          setRailsStatus("error");
        }
      }
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
      ) : railsStatus === "loading" ? (
        <CarouselSkeleton accent="bg-coral" titleWidth={200} />
      ) : null}

      {/* Rails: géneros y sugerencias en el orden recibido del back */}
      {railsStatus === "loading"
        ? genres.map((genre, index) => (
            <CarouselSkeleton
              key={genre}
              accent={SKELETON_ACCENTS[index % SKELETON_ACCENTS.length]}
              titleWidth={260}
            />
          ))
        : rails.map((rail, index) =>
            rail.movies.length > 0 ? (
              <LazyLoader key={`${rail.type}-${rail.name}-${index}`}>
                <DaisyCarousel
                  title={
                    rail.type === "suggestion"
                      ? rail.name
                      : `Lo último en el género ${rail.name}`
                  }
                  movies={rail.movies}
                  variant={rail.type}
                />
              </LazyLoader>
            ) : null
          )}

      <Footer />
    </main>
  );
}
