// src/config/api.ts

import axios from 'axios';
import { Movie, ApiResponseIsFavorite, FormDataSignIn, FormDataLogIn } from './intefaces';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const checkIfInList = async (movieId: string, token: string | null): Promise<ApiResponseIsFavorite | null> => {
  if (!token) return null;

  try {
    const response = await axios.get<ApiResponseIsFavorite>(`${API_URL}/movie/check-favorite/${movieId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error checking if movie is in list:', error);
    throw error;
  }
};

export const toggleFavorite = async (movieId: string, isInList: boolean, token: string | null): Promise<void> => {
    console.log('toggleFavorite called with:', { movieId, isInList, tokenExists: !!token });
    if (!token) throw new Error('No authentication token provided');
  
    const endpoint = isInList ? 'unfavorite' : 'favorite';
    console.log(`Using endpoint: ${API_URL}/movie/${endpoint}`);
    console.log(`Bearer ${token}`);
    console.log(`id: ${movieId}`);
  
    try {
      console.log('Sending request to server...');
      const controller = new AbortController();// 3 segundos de timeout
  
      const response = await fetch(`${API_URL}/movie/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: movieId }),
        signal: controller.signal
      });
  
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Server response received:', data);
    } catch (error) {
      console.error('Error in toggleFavorite:', error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error('Request timed out');
          throw new Error(`Request timed out while ${endpoint}ing the movie`);
        }
        throw new Error(`Failed to ${endpoint} movie: ${error.message}`);
      } else {
        throw new Error(`An unexpected error occurred while ${endpoint}ing the movie`);
      }
    }
  };

export const getLatestMovies = async (): Promise<Movie[]> => {
  try {
    const response = await axios.get<Movie[]>(`${API_URL}/movie/latest`);
    return response.data;
  } catch (error) {
    console.error('Error fetching latest movies:', error);
    throw error;
  }
};

export const getMoviesByGenre = async (genre: string): Promise<Movie[]> => {
  try {
    const response = await axios.get<Movie[]>(`${API_URL}/movie/by-genre`, {
      params: { genre },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching movies by genre: ${genre}`, error);
    throw error;
  }
};

export const registerUser = async (formData: FormDataSignIn) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, formData);
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  };

  export const searchMovies = async (query: string): Promise<{ movies: Movie[], actorMovies: Movie[] }> => {
    try {
      const response = await axios.get<{ movies: Movie[], actorMovies: Movie[] }>(`${API_URL}/movie/search`, {
        params: { name: query },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  };

  export const loginUser = async (formData: FormDataLogIn) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData);
      return response.data;
    } catch (error) {
      console.error("Error logging in user:", error);
      throw error;
    }
  };

  export const getFavoriteMovies = async (token: string | null): Promise<Movie[]> => {
    try {
      const response = await axios.get<Movie[]>(`${API_URL}/movie/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch favorite movies:', error);
      throw error;
    }
  };
