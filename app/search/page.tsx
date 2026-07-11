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
      {title && (
        <h2 className="b-display mb-6 inline-block bg-ink px-3 py-1.5 text-lg text-paper sm:text-xl">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-2 gap-4 px-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-5">
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
    <div className="flex flex-col min-h-screen bg-paper text-ink">
      <Navbar />
      <main className="flex-grow max-w-[1400px] w-full mx-auto px-4 sm:px-6 pt-10 pb-12">
        <span className="b-tag bg-grape text-paper">Búsqueda</span>
        <h1 className="b-display mt-3 text-4xl sm:text-6xl break-words">
          &ldquo;{query}&rdquo;
        </h1>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="h-12 w-12 animate-spin border-4 border-ink border-t-buzz"></div>
          </div>
        )}

        {error && (
          <div className="b-card mt-8 bg-coral p-4 text-center font-bold uppercase text-paper">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {movies.length > 0 ? (
              renderMovieGrid(movies, "")
            ) : (
              <div className="b-card mt-10 bg-buzz p-10 text-center">
                <p className="b-display text-2xl sm:text-3xl">Sin coincidencias</p>
                <p className="mt-2 text-sm font-bold uppercase">Prueba con otro título o actor.</p>
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
