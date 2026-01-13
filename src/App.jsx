import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import logo from "./assets/movie.svg"

const key = import.meta.env.VITE_TOKEN;

const fetchMovies = async (search) => {
  if (!search) return null;
  const res = await fetch(`https://www.omdbapi.com/?apikey=${key}&s=${search}`);
  if (!res.ok) throw new Error("Error de conexión");
  return res.json();
};

const getMovieDetails = async (movie_id) => {
  const response = await fetch(`https://www.omdbapi.com/?apikey=${key}&i=${movie_id}`);
  if (!response.ok) throw new Error("Error de conexión");
  return response.json();
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState("Python");
  const [selectedMovieId, setSelectedMovieId] = useState(""); 

  
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
            style={{width: '400px', marginLeft: '110px'}}
            placeholder="Escribe una película (mínimo 3 letras)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <button
            className="btn btn-primary btn-lg shadow-sm"
            style={{marginLeft: '140px'}}
            onClick={() => setSearchTerm("")}
          >
            Limpiar
          </button>
          
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
        <div className="alert alert-danger d-flex align-items-center animate-shake bg-white text-dark" role="alert">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill me-2" viewBox="0 0 16 16">
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
          </svg>
          <div>¡Vaya! Hubo un problema al conectar con el servidor.</div>
        </div>
      )}

      <div className="container-fluid min-h-screen bg-dark py-5">
        
        <div className="row g-4 px-4">
          {searchTerm.length >= 2 && searchTerm != "" ? (data?.Search?.map((m) => (
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
                  <span className="badge bg-warning rounded-pill m-1">{m.Type}</span>
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
          ))) : (
          <div className="col-12 text-center text-white">
              <p className="lead">
                Usa el buscador para encontrar tus películas favoritas.
              </p>
              <img
                src={logo}
                alt="Film Reel"
                style={{ width: "150px", opacity: 0.5 }}
                className="mt-3"
              />
            </div>
          )}
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
                    <h5 className="modal-title fw-bold text-warning">{movieDetails?.Title}</h5>
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-4">
                        <img src={movieDetails?.Poster} className="img-fluid rounded shadow-sm hover:`scale(1.05)`" alt="" />
                      </div>
                      <div className="col-md-8">
                        <p className="text-warning fw-bold">⭐ {movieDetails?.imdbRating}</p>
                        <p className="text-success fw-bold"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#46e416ff" viewBox="0 0 16 16">
  <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11V10.937c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.51 5a2 2 0 1 0 .01 4 2 2 0 0 0-.01-4zm10 0a2 2 0 1 0 .01 4 2 2 0 0 0-.01-4z"/>
</svg> {movieDetails?.Awards}</p>
                        <p><strong>Sinopsis:</strong> {movieDetails?.Plot}</p>
                        <p><strong>Director:</strong> {movieDetails?.Director}</p>
                        <p><strong>Actores:</strong> {movieDetails?.Actors}</p>
                        {movieDetails?.Type === "series" && (
                          <>
                            <p><strong>Temporadas:</strong> {movieDetails?.totalSeasons}</p>
                          </>
                        )}
                        <div className="mt-3">
                        </div>
                        <div className="mt-3">
                          <span className="badge bg-info text-dark me-2">Genero: {movieDetails?.Genre}</span>
                          <span className="badge bg-info text-dark me-2">Duracion: {movieDetails?.Runtime}</span>
                        </div>
                        <div className="mt-3">
                          <span className="badge bg-info text-dark me-2">Lanzamiento: {movieDetails?.Released}</span>
                          <span className="badge bg-info text-dark me-2">Tipo: {movieDetails?.Type}</span>
                          <span className="badge bg-info text-dark me-2">Pais: {movieDetails?.Country}</span>
                          <span className="badge bg-info text-dark me-2">Clasificacion: {movieDetails?.Rated}</span>
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