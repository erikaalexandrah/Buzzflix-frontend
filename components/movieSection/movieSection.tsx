'use client';
import React, { useState } from 'react';
import { Movie } from '@/config/intefaces';

interface MovieSectionProps {
  movie: Movie;
}

const MovieSection: React.FC<MovieSectionProps> = ({ movie }) => {
  const youtubeEmbedUrl = movie.trailerUrl.replace('watch?v=', 'embed/');
  const videoId = youtubeEmbedUrl.split('/').pop();

  const [videoReady, setVideoReady] = useState(false);
  const [muted, setMuted] = useState(true);

  return (
    <section className="border-b-2 border-ink bg-paper">
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-12">
        {/* Etiqueta superior */}
        <div className="mb-4 flex items-center gap-3">
          <span className="b-tag bg-coral text-paper">Destacado</span>
          <span className="b-tag bg-buzz">Sin spoilers</span>
        </div>

        <div className="grid items-stretch gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Caja del trailer */}
          <div className="b-card relative aspect-video overflow-hidden bg-ink">
            {movie.cover && (
              <img
                src={movie.cover}
                alt={movie.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <div
              className={`absolute inset-0 transition-opacity duration-700 ${
                videoReady ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <iframe
                src={`${youtubeEmbedUrl}?autoplay=1&mute=${muted ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1`}
                className="absolute left-1/2 top-1/2 h-[135%] w-[135%] -translate-x-1/2 -translate-y-1/2"
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
                onLoad={() => setVideoReady(true)}
              />
            </div>

            {/* Botón de sonido */}
            <button
              onClick={() => setMuted((m) => !m)}
              className="b-border absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center bg-buzz shadow-brutal-sm transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              aria-label={muted ? 'Activar sonido' : 'Silenciar'}
            >
              {muted ? (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 00-2.5-4.03v8.06A4.5 4.5 0 0016.5 12zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.94 8.94 0 003.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z" /></svg>
              ) : (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 00-2.5-4.03v8.06A4.5 4.5 0 0016.5 12zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
              )}
            </button>
          </div>

          {/* Bloque de información */}
          <div className="flex flex-col justify-between gap-6">
            <div>
              <h1 className="b-display text-4xl sm:text-5xl lg:text-6xl">{movie.title}</h1>
              <p className="mt-4 max-w-prose text-sm font-medium leading-relaxed text-ink/80 sm:text-base line-clamp-4">
                {movie.description}
              </p>
            </div>

            <div>
              <div className="mb-5 flex flex-wrap gap-2">
                <span className="b-tag bg-grape text-paper">{`★ ${movie.rating}`}</span>
                <span className="b-tag bg-paper">{movie.genre}</span>
                <span className="b-tag bg-electric text-paper">{`N.º ${movie.classification}`}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="b-btn bg-buzz">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  Reproducir
                </button>
                <button className="b-btn bg-paper">Más info</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovieSection;
