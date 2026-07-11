'use client';
import React, { useState, useEffect } from 'react';
import Card from '@/components/card/container';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar';
import { Movie } from '@/config/intefaces';
import { searchMovies } from '@/config/api';

const Search: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [actorMovies, setActorMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Extrae el valor del parámetro `query` directamente desde la URL
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('query') || '';
    setQuery(searchQuery);
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      if (!query) return;

      try {
        setLoading(true);
        const { movies, actorMovies } = await searchMovies(query);
        setMovies(movies);
        setActorMovies(actorMovies);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setError('Error fetching movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [query]);

  const renderMovieGrid = (movieList: Movie[], title: string) => (
    <div className="mt-8 mb-12">
      {title && <h2 className="text-white text-lg sm:text-xl font-semibold mb-5">{title}</h2>}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
        {movieList.map((movie) => (
          <Card
            key={movie.id}
            id={movie.id}
            cover={movie.cover}
            title={movie.title}
            trailerUrl={movie.trailerUrl}
            description={movie.description}
            originalLanguage={movie.originalLanguage}
            actors={movie.actors}
            releaseDate={movie.releaseDate}
            subtitles={movie.subtitles}
            rating={movie.rating}
            classification={movie.classification}
            genre={movie.genre}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#141414]">
      <Navbar />
      <main className="flex-grow max-w-[1400px] w-full mx-auto px-4 sm:px-8 pt-24 pb-12">
        <p className="text-sm text-white/50">Resultados de búsqueda</p>
        <h1 className="text-white text-2xl sm:text-3xl font-bold mb-2">
          &ldquo;{query}&rdquo;
        </h1>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/20 border-t-white"></div>
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {movies.length > 0 ? (
              renderMovieGrid(movies, "")
            ) : (
              <div className="mt-16 text-center text-white/60">
                <p className="text-lg sm:text-xl">No encontramos coincidencias</p>
                <p className="mt-2 text-sm text-white/40">Prueba con otro título o actor.</p>
              </div>
            )}

            {actorMovies.length > 0 && renderMovieGrid(actorMovies, "También te puede interesar")}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Search;
