// src/components/card/container.tsx

'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { checkIfInList, toggleFavorite } from '@/config/api';
import { Movie } from '@/config/intefaces';
import CardView from './view';

const Card: React.FC<Movie> = ({
  id,
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInList, setIsInList] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const checkAuthentication = useCallback(() => {
    const token = localStorage.getItem('jwt');
    setIsAuthenticated(!!token);
    return !!token;
  }, []);

  useEffect(() => {
    const fetchIfInList = async () => {
      const token = localStorage.getItem('jwt');
      const response = await checkIfInList(id, token);
      setIsInList(response?.isFavorite ?? false);
      setIsLoading(false);
    };

    if (checkAuthentication()) {
      fetchIfInList();
    } else {
      setIsLoading(false);
    }
  }, [id, checkAuthentication]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('You need to be logged in to modify your list.');
      return;
    }
  
    setIsLoading(true);
    console.log('Starting toggle favorite process');
    try {
      const token = localStorage.getItem('jwt');
      console.log('Token retrieved, calling toggleFavorite');
      await toggleFavorite(id, isInList, token);
      console.log('toggleFavorite completed successfully');
      setIsInList((prevIsInList) => !prevIsInList);
    } catch (error) {
      console.error('Error in handleToggleFavorite:', error);
      if (error instanceof Error) {
        alert(`An error occurred: ${error.message}`);
      } else {
        alert('An unknown error occurred while modifying your list.');
      }
    } finally {
      console.log('Resetting loading state');
      setIsLoading(false);
    }
  };
  
  return (
    <CardView
      isModalOpen={isModalOpen}
      isInList={isInList}
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      openModal={openModal}
      closeModal={closeModal}
      handleToggleFavorite={handleToggleFavorite}
      movieId={id}
      cover={cover}
      title={title}
      trailerUrl={trailerUrl}
      description={description}
      originalLanguage={originalLanguage}
      actors={actors}
      releaseDate={releaseDate}
      subtitles={subtitles}
      rating={rating}
      classification={classification}
      genre={genre}
    />
  );
};

export default Card;
