// src/config/api.ts

import axios from 'axios';
import { Movie, ApiResponseIsFavorite, FormDataSignIn, FormDataLogIn } from './intefaces';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const NORMALIZED_API_URL = API_URL?.replace(/\/+$/, '');

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

export interface BackfillResult {
  mode: string;
  startPage: number;
  nextPage: number;
  importedMovies: number;
  skippedMovies: number;
  processedPages: number;
}

export class BackfillError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'BackfillError';
    this.status = status;
  }
}

/**
 * Adelanta el cron de importación trayendo `pages` páginas de TMDB de golpe.
 * Solo funciona para usuarios con role "admin".
 * Lanza BackfillError con el status (401/403/…) en caso de fallo.
 */
export const backfillMovies = async (token: string | null, pages = 10): Promise<BackfillResult> => {
  if (!token) throw new BackfillError(401, 'No authentication token provided');

  const safePages = Math.min(Math.max(1, Math.trunc(pages)), 50);

  const response = await fetch(`${API_URL}/import/admin/movies/backfill?pages=${safePages}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 201) {
    return response.json() as Promise<BackfillResult>;
  }

  throw new BackfillError(
    response.status,
    response.status === 403
      ? 'El usuario no es administrador'
      : response.status === 401
      ? 'Token inválido o ausente'
      : `Error al importar (${response.status})`
  );
};

export interface VoteCountStatus {
  total: number;
  completed: number;
  remaining: number;
  percentage: number;
  complete: boolean;
}

export interface VoteCountBackfillResponse extends VoteCountStatus {
  processed: number;
  updated: number;
  failed: number;
  failures: Array<{
    id: string | number;
    error: string;
  }>;
}

const getAdminHeaders = (token: string | null) => {
  if (!token) throw new BackfillError(401, 'Token inválido o ausente');
  return { Authorization: `Bearer ${token}` };
};

const throwVoteCountError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    throw new BackfillError(
      status,
      status === 401
        ? 'Token inválido o ausente'
        : status === 403
        ? 'El usuario no es administrador'
        : status === 0
        ? 'No se pudo conectar con el servidor'
        : `Error al actualizar votaciones (${status})`
    );
  }
  throw error;
};

export const getVoteCountBackfillStatus = async (
  token: string | null,
  signal?: AbortSignal
): Promise<VoteCountStatus> => {
  try {
    const response = await axios.get<VoteCountStatus>(
      `${NORMALIZED_API_URL}/import/admin/movies/vote-counts/status`,
      { headers: getAdminHeaders(token), signal }
    );
    return response.data;
  } catch (error) {
    return throwVoteCountError(error);
  }
};

export const backfillVoteCounts = async (
  token: string | null,
  batchSize = 50,
  signal?: AbortSignal
): Promise<VoteCountBackfillResponse> => {
  try {
    const safeBatchSize = Math.min(Math.max(1, Math.trunc(batchSize)), 100);
    const response = await axios.post<VoteCountBackfillResponse>(
      `${NORMALIZED_API_URL}/import/admin/movies/vote-counts/backfill`,
      null,
      {
        params: { batchSize: safeBatchSize },
        headers: getAdminHeaders(token),
        signal,
      }
    );
    return response.data;
  } catch (error) {
    return throwVoteCountError(error);
  }
};

const LANDING_MOVIES_LIMIT = 20;

export type LandingRailType = 'genre' | 'suggestion';

export interface LandingRail {
  name: string;
  type: LandingRailType;
  movies: Movie[];
}

export interface LandingResponse {
  latest: Movie[];
  genres: LandingRail[];
}

export const getLandingMovies = async (
  genres: string[],
  signal?: AbortSignal,
  token?: string | null
): Promise<LandingResponse> => {
  const response = await axios.get<LandingResponse>(`${NORMALIZED_API_URL}/movie/landing`, {
    params: {
      genres: genres.join(','),
      limit: LANDING_MOVIES_LIMIT,
    },
    // Autenticación opcional: con sesión activa el back devuelve carruseles
    // personalizados; sin token responde el landing genérico sin fallar.
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    signal,
  });

  return response.data;
};

export const getLatestMovies = async (signal?: AbortSignal): Promise<Movie[]> => {
  try {
    const response = await axios.get<Movie[]>(`${API_URL}/movie/latest`, {
      params: { limit: LANDING_MOVIES_LIMIT },
      signal,
    });
    return response.data.slice(0, LANDING_MOVIES_LIMIT);
  } catch (error) {
    console.error('Error fetching latest movies:', error);
    throw error;
  }
};

export const getMoviesByGenre = async (genre: string, signal?: AbortSignal): Promise<Movie[]> => {
  try {
    const response = await axios.get<Movie[]>(`${API_URL}/movie/by-genre`, {
      params: { genre, limit: LANDING_MOVIES_LIMIT },
      signal,
    });
    return response.data.slice(0, LANDING_MOVIES_LIMIT);
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

  export interface UserProfile {
    username: string;
    age?: number;
    country?: string;
    favoriteGenre?: string;
    role?: string;
  }

  export const getUserProfile = async (
    token: string | null,
    signal?: AbortSignal
  ): Promise<UserProfile> => {
    if (!token) throw new Error('No authentication token provided');
    const response = await axios.get<UserProfile>(`${NORMALIZED_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      signal,
    });
    return response.data;
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
