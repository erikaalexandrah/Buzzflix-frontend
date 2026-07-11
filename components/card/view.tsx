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
        className="group relative z-20 aspect-[2/3] w-full cursor-pointer overflow-hidden rounded-md shadow-md ring-1 ring-white/5 transition-transform duration-300 hover:z-30 hover:scale-[1.04] hover:shadow-xl"
        onClick={openModal}
      >
        <img
          src={cover}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/80 via-black/10 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <h3 className="text-center text-sm font-semibold text-white md:text-base">{title}</h3>
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <div className="relative">
            <div className="relative aspect-video w-full overflow-hidden bg-black">
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
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#181818] to-transparent"></div>
            </div>
            <div className="p-5 sm:p-8">
              <h2 className="mb-3 text-2xl sm:text-3xl font-bold text-white">{title}</h2>
              <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                <span className="font-semibold text-green-500">98% Match</span>
                <span className="border border-gray-600 px-2 py-0.5 text-xs text-white/90">{classification}</span>
                <span className="text-white/70">{releaseDate.split('-')[0]}</span>
              </div>
              <p className="mb-5 text-sm sm:text-base leading-relaxed text-white/85">{description}</p>
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:gap-3">
                <button className="flex items-center justify-center gap-2 rounded-md bg-white px-8 py-2 font-semibold text-black transition hover:bg-white/85" onClick={handlePlayVideo}>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  Play
                </button>
                {isAuthenticated && (
                  <button
                    onClick={handleToggleFavorite}
                    className="rounded-md bg-white/15 px-8 py-2 font-semibold text-white transition hover:bg-white/25 disabled:opacity-60"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : (isInList ? 'Remove from My List' : 'Add to My List')}
                  </button>
                )}
              </div>
              <div className="space-y-1.5 border-t border-white/10 pt-4 text-xs sm:text-sm text-gray-400">
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
