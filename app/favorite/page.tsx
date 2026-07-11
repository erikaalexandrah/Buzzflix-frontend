'use client';
import React, { useEffect, useState } from 'react';
import { getFavoriteMovies } from '@/config/api';  
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

  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-paper text-ink">
        <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
          <span className="b-tag bg-grape text-paper">Mi lista</span>
          <h1 className="b-display mt-3 mb-8 text-4xl sm:text-6xl">Mis favoritos</h1>

          {loading && (
            <div className="flex justify-center py-20">
              <div className="h-12 w-12 animate-spin border-4 border-ink border-t-buzz"></div>
            </div>
          )}

          {error && (
            <div className="b-card bg-coral p-4 text-center font-bold uppercase text-paper">{error}</div>
          )}

          {!loading && !error && (
            movies.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 px-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-5">
                {movies.map((movie) => (
                  <Card key={movie.id} {...movie} />
                ))}
              </div>
            ) : (
              <div className="b-card bg-buzz p-10 text-center">
                <p className="b-display text-2xl sm:text-3xl">Tu lista está vacía</p>
                <p className="mt-2 text-sm font-bold uppercase">Añade trailers desde el catálogo.</p>
              </div>
            )
          )}
        </section>
      </div>
      <Footer />
    </>
  );
};

export default FavoritesPage;
