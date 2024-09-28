// src/components/CardView.tsx

import React, { useRef, useEffect } from 'react';
import Modal from './modal';

interface CardViewProps {
  isModalOpen: boolean;
  isInList: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  openModal: () => void;
  closeModal: () => void;
  handleToggleFavorite: (e: React.MouseEvent) => void;
  movieId: string;
  cover: string;
  title: string;
  trailerUrl: string;
  description: string;
  originalLanguage: string;
  actors: string[];
  releaseDate: string;
  subtitles: string;
  rating: number;
  classification: string;
  genre: string;
}

const CardView: React.FC<CardViewProps> = ({
  isModalOpen,
  isInList,
  isAuthenticated,
  isLoading,
  openModal,
  closeModal,
  handleToggleFavorite,
  movieId,
  cover,
  title,
  trailerUrl,
  description,
  originalLanguage,
  actors,
  releaseDate,
  subtitles,
  rating,
  classification,
  genre,
}) => {
  const youtubeRef = useRef<HTMLElement>(null);

  const handlePlayVideo = () => {
    if (youtubeRef.current) {
      youtubeRef.current.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    }
  };

  const videoId = trailerUrl.includes('v=')
    ? new URLSearchParams(new URL(trailerUrl).search).get('v')
    : trailerUrl.split('/').pop();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@justinribeiro/lite-youtube@1.5.0/lite-youtube.js';
    script.type = 'module';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <div
        className="relative cursor-pointer overflow-hidden rounded-lg shadow-lg h-48 w-32 md:h-64 md:w-48 z-20"
        onClick={openModal}
      >
        <img
          src={cover}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 transition-opacity duration-300 hover:opacity-100">
          <h3 className="text-white text-sm md:text-lg font-semibold text-center">{title}</h3>
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <div className="relative">
            <div className="relative w-full h-0 pb-[40%] max-h-[50vh] sm:pb-[56.25%] sm:max-h-[70vh] ">
              {React.createElement('lite-youtube', {
                videoid: videoId,
                style: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
                className: 'w-full h-full object-cover',
                title: title,
                params: 'autoplay=1&loop=1&controls=1&rel=0&modestbranding=1&mute=0',
                autoload: true,
                playlistCoverId: 'default',
                ref: youtubeRef,
              })}
              <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-32 bg-gradient-to-t from-[#181818] to-transparent sm:block hidden"></div>
            </div>
            <div className="p-4 sm:p-12 bg-[#181818] mt-4 sm:mt-8">
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">{title}</h2>
              <div className="flex flex-wrap items-center space-x-2 sm:space-x-4 mb-4">
                <span className="text-green-500 font-bold">98% Match</span>
                <span className="border border-gray-600 text-white px-2 py-1 text-xs sm:text-sm">{classification}</span>
                <span className="text-white">{releaseDate.split('-')[0]}</span>
              </div>
              <p className="text-white text-sm sm:text-base mb-4">{description}</p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
                <button className="bg-white text-black px-6 sm:px-8 py-2 rounded" onClick={handlePlayVideo}>Play</button>
                {isAuthenticated && (
                  <button
                    onClick={handleToggleFavorite}
                    className="bg-gray-500 text-white px-6 sm:px-8 py-2 rounded"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : (isInList ? 'Remove from My List' : 'Add to My List')}
                  </button>
                )}
              </div>
              <div className="text-gray-400 text-xs sm:text-sm space-y-2">
                <p>MovieID: {movieId} </p>
                <p><span className="text-gray-200">Cast:</span> {actors.join(', ')}</p>
                <p><span className="text-gray-200">Genres:</span> {genre}</p>
                <p><span className="text-gray-200">This title is:</span> {subtitles}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CardView;
