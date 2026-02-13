import { useQuery } from '@tanstack/react-query';
import { fetchMovies, getMovieDetails } from '../services/omdbApi';
import { MIN_SEARCH_LENGTH } from '../constants';

export const useMovieSearch = (searchTerm, type) => {
  return useQuery({
    queryKey: ['movies', searchTerm, type],
    queryFn: () => fetchMovies(searchTerm, type),
    enabled: searchTerm.length >= MIN_SEARCH_LENGTH,
    staleTime: 5 * 60 * 1000, 
    retry: 2
  });
};

export const useMovieDetails = (movieId) => {
  return useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => getMovieDetails(movieId),
    enabled: Boolean(movieId),
    staleTime: 10 * 60 * 1000 
  });
};