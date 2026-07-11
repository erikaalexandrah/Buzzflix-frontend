'use client'
import React, { useRef, useState, useEffect } from "react";
import Card from "../card/container";
import {CarouselProps } from "@/config/intefaces";

const DaisyCarousel: React.FC<CarouselProps> = ({ movies, title }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(180); // Default width for larger screens

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) { // sm
        setCardWidth(130);
      } else if (width < 768) { // md
        setCardWidth(150);
      } else if (width < 1024) { // lg
        setCardWidth(165);
      } else { // xl and above
        setCardWidth(185);
      }
    };

    handleResize(); // Call once to set initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollByPage = (dir: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir * carouselRef.current.clientWidth * 0.85, behavior: "smooth" });
    }
  };

  const scrollLeft = () => scrollByPage(-1);
  const scrollRight = () => scrollByPage(1);

  return (
    <div className="relative w-full my-6 px-4 sm:px-8">
      <h2 className="text-white text-lg sm:text-xl font-semibold mb-3">{title}</h2>
      <div className="flex items-center">
        <button
          className="mr-2 shrink-0 rounded-full bg-black/50 p-2 text-white/80 shadow-md transition hover:bg-black/80 hover:text-white"
          onClick={scrollLeft}
          aria-label="Anterior"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div
          ref={carouselRef}
          className="flex space-x-2 sm:space-x-4 overflow-x-scroll scrollbar-hide scroll-smooth"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {movies.map((movie, index) => (
            <div 
              key={index} 
              className="flex-shrink-0"
              style={{ 
                width: `${cardWidth}px`,
                scrollSnapAlign: 'start'
              }}
            >
              <Card
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
            </div>
          ))}
        </div>
        <button
          className="ml-2 shrink-0 rounded-full bg-black/50 p-2 text-white/80 shadow-md transition hover:bg-black/80 hover:text-white"
          onClick={scrollRight}
          aria-label="Siguiente"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DaisyCarousel;
