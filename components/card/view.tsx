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
        className="group relative cursor-pointer border-2 border-ink bg-paper shadow-brutal transition-all duration-100 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-brutal-lg"
        onClick={openModal}
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-ink">
          <img src={cover} alt={title} className="absolute inset-0 h-full w-full object-cover" />
          {/* Rating flotante */}
          <span className="b-tag absolute left-2 top-2 bg-buzz">{`★ ${rating}`}</span>
        </div>
        <div className="flex items-center justify-between gap-2 border-t-2 border-ink px-2.5 py-2">
          <h3 className="truncate text-xs font-bold uppercase tracking-tight">{title}</h3>
          <span className="text-xs font-bold text-grape transition group-hover:translate-x-0.5">▶</span>
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <div className="relative aspect-video w-full overflow-hidden border-b-2 border-ink bg-ink">
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
          </div>

          <div className="p-5 sm:p-7">
            <h2 className="b-display text-3xl sm:text-4xl">{title}</h2>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="b-tag bg-grape text-paper">98% Match</span>
              <span className="b-tag bg-paper">{classification}</span>
              <span className="b-tag bg-electric text-paper">{releaseDate.split('-')[0]}</span>
              <span className="b-tag bg-buzz">{`★ ${rating}`}</span>
            </div>

            <p className="mt-5 text-sm font-medium leading-relaxed text-ink/85 sm:text-base">{description}</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button className="b-btn bg-buzz" onClick={handlePlayVideo}>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                Play
              </button>
              {isAuthenticated && (
                <button
                  onClick={handleToggleFavorite}
                  className={`b-btn ${isInList ? 'bg-coral text-paper' : 'bg-paper'}`}
                  disabled={isLoading}
                >
                  {isLoading ? '...' : (isInList ? '– Quitar de mi lista' : '+ Añadir a mi lista')}
                </button>
              )}
            </div>

            <div className="mt-6 space-y-1.5 border-t-2 border-ink pt-4 text-xs font-medium text-ink/70 sm:text-sm">
              <p><span className="font-bold uppercase text-ink">Reparto:</span> {actors.join(', ')}</p>
              <p><span className="font-bold uppercase text-ink">Género:</span> {genre}</p>
              <p><span className="font-bold uppercase text-ink">Subtítulos:</span> {subtitles}</p>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CardView;
