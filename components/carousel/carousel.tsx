'use client'
import React, { useRef } from "react";
import Card from "../card/container";
import { CarouselProps } from "@/config/intefaces";

const DaisyCarousel: React.FC<CarouselProps> = ({ movies, title }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollByPage = (dir: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir * carouselRef.current.clientWidth * 0.85, behavior: "smooth" });
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6">
      {/* Cabecera */}
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="b-display inline-block bg-ink px-3 py-1.5 text-lg text-paper sm:text-xl">
          {title}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scrollByPage(-1)}
            className="b-border flex h-9 w-9 items-center justify-center bg-paper shadow-brutal-sm transition hover:bg-buzz hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            aria-label="Anterior"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scrollByPage(1)}
            className="b-border flex h-9 w-9 items-center justify-center bg-paper shadow-brutal-sm transition hover:bg-buzz hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
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
        className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide px-1 pb-4 pt-2 sm:gap-5"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {movies.map((movie, index) => (
          <div
            key={index}
            className="w-[clamp(158px,42vw,210px)] flex-shrink-0 sm:w-[180px] md:w-[195px] lg:w-[210px]"
            style={{ scrollSnapAlign: 'start' }}
          >
            <Card {...movie} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DaisyCarousel;
