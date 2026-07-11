'use client';
import React, { useState } from 'react';
import { Movie } from '@/config/intefaces';

interface MovieSectionProps {
  movie: Movie;
}

const MovieSection: React.FC<MovieSectionProps> = ({ movie }) => {
  const youtubeEmbedUrl = movie.trailerUrl.replace("watch?v=", "embed/");
  const videoId = youtubeEmbedUrl.split("/").pop();

  const [videoReady, setVideoReady] = useState(false);
  const [muted, setMuted] = useState(true);

  return (
    <div className="relative w-full h-[56vh] md:h-[80vh] overflow-hidden bg-[#141414]">
      {/* Portada: se muestra al instante como fondo mientras carga el vídeo */}
      {movie.cover && (
        <img
          src={movie.cover}
          alt={movie.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Video de fondo (se funde encima cuando está listo) */}
      <div
        className={`absolute inset-0 top-[-50px] overflow-hidden transition-opacity duration-700 ${
          videoReady ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <iframe
          src={`${youtubeEmbedUrl}?autoplay=1&mute=${muted ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1`}
          className="absolute top-1/2 left-1/2 w-[150%] h-[150%] transform -translate-x-1/2 -translate-y-1/2"
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
          onLoad={() => setVideoReady(true)}
        ></iframe>
      </div>

      {/* Degradado inferior que funde con el fondo de la página */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent"></div>
      {/* Degradado lateral para legibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>

      {/* Botón de sonido */}
      <button
        onClick={() => setMuted((m) => !m)}
        className="absolute bottom-6 right-4 sm:bottom-10 sm:right-8 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white transition hover:border-white hover:bg-white/10"
        aria-label={muted ? 'Activar sonido' : 'Silenciar'}
      >
        {muted ? (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 00-2.5-4.03v8.06A4.5 4.5 0 0016.5 12zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" opacity="0.35" /><path d="M4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.94 8.94 0 003.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z" /></svg>
        ) : (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 00-2.5-4.03v8.06A4.5 4.5 0 0016.5 12zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
        )}
      </button>

      {/* Contenido de la película */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end px-4 pb-10 sm:px-8 sm:pb-14 md:px-14 md:pb-20 text-white">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">{movie.title}</h1>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-white/85 max-w-full sm:max-w-[60%] md:max-w-[42%] leading-relaxed line-clamp-3">{movie.description}</p>
        <div className="mt-5 sm:mt-6 flex flex-row items-center gap-3">
          <button className="flex items-center gap-2 bg-white text-black font-semibold py-2 px-6 sm:px-8 rounded-md text-sm sm:text-base transition hover:bg-white/85">
            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            Reproducir
          </button>
          <button className="flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white font-semibold py-2 px-6 sm:px-8 rounded-md text-sm sm:text-base transition hover:bg-white/25">
            Más información
          </button>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-white/80">
          <span className="rounded bg-yellow-500 px-2 py-0.5 font-semibold text-black">{`Top ${movie.rating}`}</span>
          <span>{movie.genre}</span>
          <span className="text-white/50">•</span>
          <span>{`N.º ${movie.classification} en TV hoy`}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieSection;