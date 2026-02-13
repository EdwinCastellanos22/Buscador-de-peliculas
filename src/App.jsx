import { useState, useRef } from 'react';
import SearchBar from './components/SearchBar';
import MovieCard from './components/MovieCard';
import MovieDetails from './components/MovieDetails';
import EmptyState from './components/EmptyState';
import { useMovieSearch, useMovieDetails } from './hooks/useMovies';
import { MOVIE_TYPES } from './constants';
import './App.css';
import './styles/animations.css';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('Batman');
  const [selectedMovieId, setSelectedMovieId] = useState('');
  const [type, setType] = useState(MOVIE_TYPES.MOVIE);
  const inputRef = useRef(null);

  const { data: moviesData, isLoading, isError } = useMovieSearch(searchTerm, type);
  const { data: movieDetails, isLoading: isLoadingDetails } = useMovieDetails(selectedMovieId);

  const handleClear = () => {
    setSearchTerm('');
    setType(MOVIE_TYPES.MOVIE);
    setSelectedMovieId('');
    inputRef.current?.focus();
  };

  const handleMovieSelect = (movieId) => {
    setSelectedMovieId(movieId);
  };

  const movies = moviesData?.Search || [];
  const hasResults = movies.length > 0;
  const showEmptyState = !isLoading && !hasResults && searchTerm.length >= 3;

  return (
      
      <div className="container-fluid bg-dark min-vh-100 py-4">
        <header>
        <h1 className="animate-fade-in">
          Películas y Series
        </h1>
        <p>
          Descubre dónde ver tus películas y series favoritas
        </p>
      </header>

        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          type={type}
          onTypeChange={setType}
          onClear={handleClear}
          inputRef={inputRef}
        />

        <main className="container">
          {isError && (
            <div className="alert alert-danger text-center" role="alert">
              ⚠️ Ocurrió un error al cargar las películas. Por favor intenta de nuevo.
            </div>
          )}

          {isLoading && (
            <div className="text-center my-5" role="status">
              <div className="spinner-border text-primary" aria-hidden="true"></div>
              <p className="text-primary mt-2">Buscando contenido...</p>
            </div>
          )}

          <div className="row g-4">
            {hasResults && movies.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
                onDetailsClick={handleMovieSelect}
              />
            ))}

            {showEmptyState && (
              <EmptyState message="No se encontraron resultados. Intenta con otro término." />
            )}
          </div>
        </main>

        {/* Modal de detalles */}
        <div
          className="modal fade"
          id="modalMovie"
          tabIndex="-1"
          aria-labelledby="modalMovieLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark text-white border-secondary">
              <MovieDetails movie={movieDetails} isLoading={isLoadingDetails} />
            </div>
          </div>
        </div>
      </div>
    
  );
}