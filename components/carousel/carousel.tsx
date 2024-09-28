'use client'
import React, { useRef, useState, useEffect } from "react";
import Card from "../card/container";
import {CarouselProps } from "@/config/intefaces";

const DaisyCarousel: React.FC<CarouselProps> = ({ movies, title }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(256); // Default width for larger screens
  const [visibleCards, setVisibleCards] = useState(4); // Default number of visible cards

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) { // sm
        setCardWidth(160);
        setVisibleCards(2);
      } else if (width < 768) { // md
        setCardWidth(192);
        setVisibleCards(3);
      } else if (width < 1024) { // lg
        setCardWidth(224);
        setVisibleCards(4);
      } else { // xl and above
        setCardWidth(256);
        setVisibleCards(5);
      }
    };

    handleResize(); // Call once to set initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full my-5 p-3 bg-[]">
      <h2 className="text-white text-xl sm:text-2xl font-semibold mb-2">{title}</h2>
      <div className="flex items-center">
        <button
          className="mr-2 bg-black text-white p-1 sm:p-2 rounded-full shadow-md"
          onClick={scrollLeft}
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
          className="ml-2 bg-black text-white p-1 sm:p-2 rounded-full shadow-md"
          onClick={scrollRight}
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
