export default function MovieDetails({ movie, isLoading }) {
  if (isLoading) {
    return (
      <div className="modal-body text-center p-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <>
      <div className="modal-header border-secondary">
        <h3 className="modal-title text-warning h5">{movie.Title}</h3>
        <button 
          type="button" 
          className="btn-close btn-close-white" 
          data-bs-dismiss="modal"
          aria-label="Cerrar"
        />
      </div>
      
      <div className="modal-body">
        <div className="row g-4">
          <div className="col-12 col-md-4 text-center">
            <img 
              src={movie.Poster} 
              className="img-fluid rounded shadow" 
              alt={`Poster de ${movie.Title}`}
            />
          </div>
          
          <div className="col-12 col-md-8">
            {movie.imdbRating && movie.imdbRating !== 'N/A' && (
              <div className="mb-3">
                <span className="text-info h5">
                  ⭐ {movie.imdbRating} <small className="text-muted">/ 10</small>
                </span>
              </div>
            )}
            
            {movie.Plot && movie.Plot !== 'N/A' && (
              <p className="text-white-50">{movie.Plot}</p>
            )}
            
            <hr className="border-secondary" />
            
            {movie.Director && movie.Director !== 'N/A' && (
              <p className="small mb-1">
                <strong className="text-white-50">Director:</strong>{' '}
                <span className="text-white">{movie.Director}</span>
              </p>
            )}
            
            {movie.Actors && movie.Actors !== 'N/A' && (
              <p className="small mb-3">
                <strong className="text-white-50">Actores:</strong>{' '}
                <span className="text-white">{movie.Actors}</span>
              </p>
            )}
            
            <div className="d-flex flex-wrap gap-2">
              {movie.Genre && movie.Genre !== 'N/A' && (
                <span className="badge bg-info">{movie.Genre}</span>
              )}
              {movie.Runtime && movie.Runtime !== 'N/A' && (
                <span className="badge bg-primary">{movie.Runtime}</span>
              )}
              {movie.Rated && movie.Rated !== 'N/A' && (
                <span className="badge bg-warning text-dark">{movie.Rated}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}