const API_KEY = import.meta.env.VITE_TOKEN;
const BASE_URL = 'https://www.omdbapi.com/';

class OmdbApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'OmdbApiError';
    this.status = status;
  }
}

const handleResponse = async (response) => {
  if (!response.ok) {
    throw new OmdbApiError(
      `Error de conexión: ${response.statusText}`,
      response.status
    );
  }
  
  const data = await response.json();
  
  if (data.Response === 'False') {
    throw new OmdbApiError(data.Error || 'Error desconocido');
  }
  
  return data;
};

export const fetchMovies = async (search, type) => {
  if (!search) return null;
  
  const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(search)}&type=${type}`;
  const response = await fetch(url);
  
  return handleResponse(response);
};

export const getMovieDetails = async (movieId) => {
  if (!movieId) return null;
  
  const url = `${BASE_URL}?apikey=${API_KEY}&i=${movieId}`;
  const response = await fetch(url);
  
  return handleResponse(response);
};