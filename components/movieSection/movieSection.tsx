import React from 'react';
import { Movie } from '@/config/intefaces';

interface MovieSectionProps {
  movie: Movie;
}

const MovieSection: React.FC<MovieSectionProps> = ({ movie }) => {
  const youtubeEmbedUrl = movie.trailerUrl.replace("watch?v=", "embed/");

  return (
    <div className="relative w-full h-[56vh] md:h-[80vh] overflow-hidden">
      {/* Video de fondo */}
      <div className="absolute inset-0 top-[-50px] overflow-hidden">
        <iframe
          src={`${youtubeEmbedUrl}?autoplay=1&loop=1&playlist=${youtubeEmbedUrl.split("/").pop()}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`}
          className="absolute top-1/2 left-1/2 w-[150%] h-[150%] transform -translate-x-1/2 -translate-y-1/2"
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
        ></iframe>
      </div>

      {/* Degradado inferior que funde con el fondo de la página */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent"></div>
      {/* Degradado lateral para legibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>

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