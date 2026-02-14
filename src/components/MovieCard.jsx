import { DEFAULT_POSTER, MOVIE_LANGUAGE_LABELS } from '../constants';
import { useTraduccion } from '../hooks/traductor';
import movieIcon from '../assets/movie.png';

export default function MovieCard({ movie, onDetailsClick }) {
  const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : movieIcon;

  const { resultado: titleEs, cargando: traduciendoTitle } = useTraduccion(movie?.Title, 'es');
  const type = movie?.Type == 'series' ? 'serie' : 'película';

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
      <article className="card h-100 shadow border-0 movie-card bg-secondary text-white">
        <img
          src={posterUrl}
          className="card-img-top"
          alt={`Poster de ${titleEs}`}
          style={{ height: '350px', objectFit: 'cover' }}
          loading="lazy"
        />

        <div className="card-body d-flex flex-column">
          <h2 className="h6 card-title text-truncate" title={movie.Title}>
            {traduciendoTitle ? (
              <span className="fst-italic opacity-50">Traduciendo título...</span>
            ) : (
              titleEs
            )}
          </h2>

          <div className="mt-auto">
            <span className="badge bg-primary me-1">{movie.Year}</span>
            <span className="badge bg-warning text-dark text-capitalize">
              {type}
            </span>
          </div>
        </div>

        <div className="card-footer border-0 bg-transparent pb-3">
          <button
            className="btn btn-success w-100"
            data-bs-toggle="modal"
            data-bs-target="#modalMovie"
            onClick={() => onDetailsClick(movie.imdbID)}
            aria-label={`Ver detalles de ${movie.Title}`}
          >
            Ver Detalles
          </button>
        </div>
      </article>
    </div>
  );
}