import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const fetchMovies = async (search) => {
  if (!search) return null;
  const res = await fetch(`https://www.omdbapi.com/?apikey=e5d9474c&s=${search}`);
  if (!res.ok) throw new Error("Error de conexión");
  return res.json();
};

const getMovieDetails = async (movie_id) => {
  const response = await fetch(`https://www.omdbapi.com/?apikey=e5d9474c&i=${movie_id}`);
  if (!response.ok) throw new Error("Error de conexión");
  return response.json();
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState("Python");
  const [selectedMovieId, setSelectedMovieId] = useState(""); // Cambié el nombre para mayor claridad

  
  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", searchTerm],
    queryFn: () => fetchMovies(searchTerm),
    enabled: searchTerm.length > 2,
  });

  
  const { data: movieDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["movie", selectedMovieId],
    queryFn: () => getMovieDetails(selectedMovieId),
    enabled: selectedMovieId.length > 2,
  });

  return (
    <div className="container py-5 bg-dark justify-content-center align-items-center d-flex flex-column">
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in { animation: fadeInDown 0.5s ease-out; }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        .movie-card:hover { transform: translateY(-10px); transition: 0.3s; }
      `}</style>

      <h1 className="text-center mb-4 display-4 fw-bold text-primary animate-fade-in">
        Buscador de Peliculas
      </h1>

      <div className="justify-content-center align-items-center d-flex mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control form-control-lg shadow-sm"
            placeholder="Escribe una película (mínimo 3 letras)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6 m-2">
          <button onClick={() => setSearchTerm("")} className="btn btn-outline-secondary shadow-sm mt-2 m-auto"><i className="bi bi-x-circle" ></i> Limpiar</button>
        </div>
      </div>

      {isLoading && (
        <div className="d-flex flex-column align-items-center my-5 bg-dark">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2 fw-bold text-primary animate-pulse">Buscando películas...</p>
        </div>
      )}

      {isError && (
        <div className="alert alert-danger d-flex align-items-center animate-shake bg-dark" role="alert">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill me-2" viewBox="0 0 16 16">
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
          </svg>
          <div>¡Vaya! Hubo un problema al conectar con el servidor.</div>
        </div>
      )}

      <div className="container-fluid min-h-screen bg-dark py-5">
        
        <div className="row g-4 px-4">
          {data?.Search?.map((m) => (
            <div key={m.imdbID} className="col-6 col-md-4 col-lg-3 animate-fade-in">
              <div className="card h-100 shadow border-0 movie-card bg-secondary text-white">
                <img
                  src={m.Poster !== "N/A" ? m.Poster : "https://via.placeholder.com/300x450"}
                  className="card-img-top"
                  alt={m.Title}
                  style={{ height: '350px', objectFit: 'cover' }}
                />
                <div className="card-body text-center">
                  <h6 className="card-title text-truncate">{m.Title}</h6>
                  <span className="badge bg-primary rounded-pill">{m.Year}</span>
                </div>
                <div className="card-footer border-0 bg-dark pb-3">
                  <button
                    className="btn btn-outline-success w-100 btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#modalMovie"
                    onClick={() => setSelectedMovieId(m.imdbID)} 
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        
        <div className="modal fade" id="modalMovie" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark text-white border-secondary">
              {isLoadingDetails ? (
                <div className="modal-body text-center p-5">
                  <div className="spinner-border text-success" role="status"></div>
                </div>
              ) : (
                <>
                  <div className="modal-header border-secondary">
                    <h5 className="modal-title">{movieDetails?.Title}</h5>
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-4">
                        <img src={movieDetails?.Poster} className="img-fluid rounded" alt="" />
                      </div>
                      <div className="col-md-8">
                        <p className="text-warning fw-bold">⭐ {movieDetails?.imdbRating}</p>
                        <p><strong>Sinopsis:</strong> {movieDetails?.Plot}</p>
                        <p><strong>Director:</strong> {movieDetails?.Director}</p>
                        <p><strong>Actores:</strong> {movieDetails?.Actors}</p>
                        <div className="mt-3">
                          <span className="badge bg-info text-dark me-2">{movieDetails?.Genre}</span>
                          <span className="badge bg-outline-secondary">{movieDetails?.Runtime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="modal-footer border-secondary">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}