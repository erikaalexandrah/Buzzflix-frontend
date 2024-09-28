export interface Movie {
    id: string;
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
  
  export interface CarouselProps {
    movies: Movie[];
    title: string;
  }
  
  export interface TopCarouselProps {
    movies: Movie[];
    title: string;
  }

  export interface ApiResponseIsFavorite {
    isFavorite: boolean;
  }

  export interface FormDataLogIn {
    username: string;
    password: string;
  }
  
  export interface FormDataSignIn {
    username: string;
    password: string;
    favoriteGenre: string;
    country: string;
    age: number;
  }