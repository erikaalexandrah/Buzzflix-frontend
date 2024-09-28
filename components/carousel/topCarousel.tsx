'use client'
import React, { useRef, useState, useEffect } from "react";
import Card from "../card/container";
import { TopCarouselProps } from "@/config/intefaces";

const TopCarousel: React.FC<TopCarouselProps> = ({ movies, title }) => {
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
    <div className="relative w-full my-5 p-3 bg-black">
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
          className="flex space-x-8 sm:space-x-14 overflow-x-scroll scroll-smooth scrollbar-hide"
          style={{ 
            scrollSnapType: 'x mandatory',
            overflowY: 'hidden', // Oculta el scroll vertical
            whiteSpace: 'nowrap',  // Asegura que las tarjetas se alineen horizontalmente
            WebkitOverflowScrolling: 'touch', // Para una experiencia de scroll suave en dispositivos móviles
            msOverflowStyle: 'none',  // Oculta scrollbar en IE y Edge
            scrollbarWidth: 'none'  // Oculta scrollbar en Firefox
          }}
        >
          {movies.slice(0, 9).map((movie, index) => ( 
            <div 
              key={index} 
              className="flex-shrink-0 relative"
              style={{ 
                width: `${cardWidth}px`,
                scrollSnapAlign: 'start'
              }}
            >
              {/* Superimpose the number */}
              <div 
                className="absolute  md:top-[-10%] lg:top-[-23%] left-[-35%] lg:left-[-45%] text-white font-bold text-[8rem] md:text-[12rem] lg:text-[16rem] opacity-20"
                style={{ zIndex: 1 }}  
              >
                {index + 1}
              </div>
              <div style={{ zIndex: 2 }}> 
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
            viewBox="0 24 24"
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

export default TopCarousel;
