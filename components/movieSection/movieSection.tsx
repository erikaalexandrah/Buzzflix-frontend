import React from 'react';
import { Movie } from '@/config/intefaces';

interface MovieSectionProps {
  movie: Movie;
}

const MovieSection: React.FC<MovieSectionProps> = ({ movie }) => {
  const youtubeEmbedUrl = movie.trailerUrl.replace("watch?v=", "embed/");

  return (
    <div className="relative w-full h-[40vh] md:h-[85vh] overflow-hidden">
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

      {/* Degradado en la parte inferior */}
      <div className="absolute inset-0 flex flex-col justify-end">
        <div className="w-full h-32 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      {/* Overlay con un fondo negro semitransparente */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Contenido de la película */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-4 sm:p-6 md:p-10 text-white">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold">{movie.title}</h1>
        <p className="mt-2 sm:mt-4 text-xs sm:text-sm md:text-lg max-w-full sm:max-w-[60%] md:max-w-[40%] line-clamp-2 sm:line-clamp-none">{movie.description}</p>
        <div className="mt-3 sm:mt-6 flex flex-row items-center space-x-2 sm:space-x-4">
          <button className="flex-1 sm:flex-none bg-white text-black font-bold py-1.5 sm:py-2 px-4 sm:px-6 rounded text-xs sm:text-base">Reproducir</button>
          <button className="flex-1 sm:flex-none bg-gray-700 bg-opacity-70 text-white font-bold py-1.5 sm:py-2 px-4 sm:px-6 rounded text-xs sm:text-base">Más información</button>
        </div>
        <div className="mt-3 sm:mt-4 flex flex-wrap items-center text-xs sm:text-sm">
          <span className="bg-yellow-500 font-bold py-0.5 px-1.5 rounded text-xs sm:text-sm mr-2 mb-1 sm:mb-0">{`Top ${movie.rating}`}</span>
          <span className="mr-2 mb-1 sm:mb-0">{movie.genre}</span>
          <span className="mb-1 sm:mb-0">{`N.º ${movie.classification} en TV hoy`}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieSection;