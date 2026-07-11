'use client'
import React, { useRef, useState, useEffect } from "react";
import Card from "../card/container";
import { TopCarouselProps } from "@/config/intefaces";

const TopCarousel: React.FC<TopCarouselProps> = ({ movies, title }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(185);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setCardWidth(140);
      else if (width < 768) setCardWidth(155);
      else if (width < 1024) setCardWidth(170);
      else setCardWidth(190);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollByPage = (dir: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir * carouselRef.current.clientWidth * 0.85, behavior: "smooth" });
    }
  };

  return (
    <div className="border-y-2 border-ink bg-buzz">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6">
        {/* Cabecera */}
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="b-display inline-block bg-ink px-3 py-1.5 text-lg text-buzz sm:text-xl">
            {title}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scrollByPage(-1)}
              className="b-border flex h-9 w-9 items-center justify-center bg-paper shadow-brutal-sm transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              aria-label="Anterior"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scrollByPage(1)}
              className="b-border flex h-9 w-9 items-center justify-center bg-paper shadow-brutal-sm transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              aria-label="Siguiente"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Pista */}
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-scroll scroll-smooth scrollbar-hide px-1 py-3"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {movies.slice(0, 9).map((movie, index) => (
            <div
              key={index}
              className="flex flex-shrink-0 items-end"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Numeral display gigante */}
              <span
                className="b-display mr-[-14px] select-none text-[7rem] leading-none text-paper sm:text-[9rem]"
                style={{ WebkitTextStroke: '3px #111111' }}
              >
                {index + 1}
              </span>
              <div style={{ width: `${cardWidth}px` }}>
                <Card {...movie} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopCarousel;
