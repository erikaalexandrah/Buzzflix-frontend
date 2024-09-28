'use client';
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import DaisyCarousel from "@/components/carousel/carousel";
import Footer from "@/components/footer/footer";
import MovieSection from "@/components/movieSection/movieSection";
import GuestLoginModal from "@/components/guestModal/guestModal";
import TopCarousel from "@/components/carousel/topCarousel";
import LazyLoader from "@/components/lazyLoader/page";
import { Movie } from "@/config/intefaces";
import { getLatestMovies, getMoviesByGenre } from "@/config/api"; 
import { genres } from "@/config/data";

export default function Home() {
  const [latestMovies, setLatestMovies] = useState<Movie[]>([]);
  const [moviesByGenre, setMoviesByGenre] = useState<{ [key: string]: Movie[] }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const latestMovies = await getLatestMovies();  
        setLatestMovies(latestMovies);

        const genreResponses = await Promise.all(
          genres.map(async (genre) => {
            const movies = await getMoviesByGenre(genre); 
            return { genre, movies };
          })
        );

        const genreMoviesMap = genreResponses.reduce((acc, { genre, movies }) => {
          acc[genre] = movies;
          return acc;
        }, {} as { [key: string]: Movie[] });

        setMoviesByGenre(genreMoviesMap);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <main className="text-slate-500">
      <Navbar />
      <GuestLoginModal />
      {latestMovies.length > 0 && (
        <>
          <div className="md:mb-12">
            <MovieSection movie={latestMovies[0]} />
          </div>
          <TopCarousel title="Últimas películas" movies={latestMovies} />
        </>
      )}
      {genres.map((genre) => (
        moviesByGenre[genre]?.length > 0 && (
          <LazyLoader key={genre}>
            <DaisyCarousel
              title={`Lo último en el género ${genre}`}
              movies={moviesByGenre[genre]}
            />
          </LazyLoader>
        )
      ))}
      <Footer />
    </main>
  );
}
