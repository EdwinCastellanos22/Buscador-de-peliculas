import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import logo from "./assets/movie.svg";

const key = import.meta.env.VITE_TOKEN;

const fetchMovies = async (search, tipe) => {
  if (!search) return null;
  const res = await fetch(`https://www.omdbapi.com/?apikey=${key}&s=${search}&type=${tipe}`);
  if (!res.ok) throw new Error("Error de conexión");
  return res.json();
};

const getMovieDetails = async (movie_id) => {
  if (!movie_id) return null;
  const response = await fetch(`https://www.omdbapi.com/?apikey=${key}&i=${movie_id}`);
  if (!response.ok) throw new Error("Error de conexión");
  return response.json();
};

export default function App() {
  const [searchTerm, setSearchTerm] = useState("Python");
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [tipe, seTipe] = useState("movie");
  const inputRef = useRef(null);

  const handleClear = () => {
    setSearchTerm("");
    seTipe("movie");
    inputRef.current?.focus(); 
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", searchTerm, tipe],
    queryFn: () => fetchMovies(searchTerm, tipe),
    enabled: searchTerm.length > 2,
  });

  const { data: movieDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["movie", selectedMovieId],
    queryFn: () => getMovieDetails(selectedMovieId),
    enabled: selectedMovieId.length > 2,
  });

  return (
    <div className="container-fluid bg-dark min-vh-100 py-3">
      <style>{`
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeInDown 0.5s ease-out; }
        .movie-card { transition: transform 0.3s; }
        .movie-card:hover { transform: translateY(-10px); }
      `}</style>

      <h1 className="text-center mb-4 text-primary animate-fade-in fw-bold">
        Buscador de Películas
      </h1>

      
      <div className="container mb-5">
        <div className="row g-3 justify-content-center align-items-end">
          <div className="col-12 col-md-6 col-lg-5">
            <label className="text-white-50 small mb-1">Buscar título:</label>
            <input
              type="text"
              ref={inputRef}
              className="form-control form-control-lg shadow-sm"
              placeholder="Ej: Batman, Inception..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-3 col-lg-2">
            <label className="text-white-50 small mb-1">Tipo:</label>
            <select
              className="form-select form-control-lg shadow-sm"
              value={tipe}
              onChange={(e) => seTipe(e.target.value)}
            >
              <option value="movie">Película</option>
              <option value="series">Serie</option>
              <option value="episode">Episodio</option>
            </select>
          </div>
          <div className="col-12 col-md-3 col-lg-2">
            <button
              className="btn btn-outline-danger btn-lg w-100 shadow-sm"
              onClick={handleClear}
            >
              <i className="bi bi-trash"></i> Limpiar
            </button>
          </div>
        </div>
      </div>

     
      <div className="container">
        {isLoading && (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-primary mt-2">Buscando...</p>
          </div>
        )}

        <div className="row g-4">
          {data?.Search?.map((m) => (
            <div key={m.imdbID} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 shadow border-0 movie-card bg-secondary text-white">
                <img
                  src={m.Poster !== "N/A" ? m.Poster : "https://via.placeholder.com/300x450"}
                  className="card-img-top"
                  alt={m.Title}
                  style={{ height: '350px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title text-truncate">{m.Title}</h6>
                  <div className="mt-auto">
                    <span className="badge bg-primary me-1">{m.Year}</span>
                    <span className="badge bg-warning text-dark">{m.Type}</span>
                  </div>
                </div>
                <div className="card-footer border-0 bg-transparent pb-3">
                  <button
                    className="btn btn-success w-100"
                    data-bs-toggle="modal"
                    data-bs-target="#modalMovie"
                    onClick={() => setSelectedMovieId(m.imdbID)}
                  >
                    Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}

          {(!data?.Search && !isLoading) && (
             <div className="col-12 text-center text-white-50 mt-5">
                <img src={logo} style={{ width: "100px", opacity: 0.3 }} alt="logo" />
                <p className="mt-3">No se encontraron resultados o escribe más letras.</p>
             </div>
          )}
        </div>
      </div>

     
      <div className="modal fade" id="modalMovie" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content bg-dark text-white border-secondary">
            {isLoadingDetails ? (
              <div className="modal-body text-center p-5">
                <div className="spinner-border text-success"></div>
              </div>
            ) : (
              <>
                <div className="modal-header border-secondary">
                  <h5 className="modal-title text-warning">{movieDetails?.Title}</h5>
                  <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div className="modal-body">
                  <div className="row g-4">
                    <div className="col-12 col-md-4 text-center">
                      <img src={movieDetails?.Poster} className="img-fluid rounded shadow" alt="poster" />
                    </div>
                    <div className="col-12 col-md-8">
                       <h5 className="text-info">⭐ {movieDetails?.imdbRating} / 10</h5>
                       <p>{movieDetails?.Plot}</p>
                       <hr className="border-secondary" />
                       <p className="small mb-1"><strong>Director:</strong> {movieDetails?.Director}</p>
                       <p className="small mb-3"><strong>Actores:</strong> {movieDetails?.Actors}</p>
                       <div className="d-flex flex-wrap gap-2">
                          <span className="badge bg-outline-info border text-info">{movieDetails?.Genre}</span>
                          <span className="badge bg-outline-info border text-info">{movieDetails?.Runtime}</span>
                          <span className="badge bg-outline-info border text-info">{movieDetails?.Rated}</span>
                       </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}