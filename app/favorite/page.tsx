'use client';
import React, { useEffect, useState } from 'react';
import { getFavoriteMovies } from '@/config/api';  // Importa la función
import { Movie } from '@/config/intefaces';
import Card from '@/components/card/container';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer/footer';

const FavoritesPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const favoriteMovies = await getFavoriteMovies(token);  // Usa la función
        setMovies(favoriteMovies);
      } catch (err) {
        setError('Failed to fetch favorite movies');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFavoriteMovies();
  }, []);

  if (loading) {
    return <p className="text-center text-white">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <>
      <Navbar/>
      <div className="min-h-screen text-white">
        {/* Renderizado de las tarjetas */}
        <section className="p-8">
          <h2 className="text-2xl font-bold mb-4">Your Favorite Movies & Shows</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
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
        </section>
      </div>
      <Footer />
    </>
  );
};

export default FavoritesPage;
