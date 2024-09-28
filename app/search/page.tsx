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
      <h2 className="text-white text-xl sm:text-2xl font-semibold mb-8">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center sm:justify-items-start">
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
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      <main className="flex-grow container mx-auto px-2 sm:px-4 py-8">
        <h1 className="text-white text-xl sm:text-2xl font-semibold mb-2">
          Search Results for "{query}"
        </h1>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center text-xl p-4 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {movies.length > 0 ? (
              renderMovieGrid(movies, "")
            ) : (
              <div className="text-white text-center text-xl sm:text-2xl">
                No matches found
              </div>
            )}

            {actorMovies.length > 0 && renderMovieGrid(actorMovies, "You might also be interested in")}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Search;
