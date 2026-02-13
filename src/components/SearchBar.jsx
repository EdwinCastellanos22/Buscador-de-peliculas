import { MOVIE_TYPES, MOVIE_TYPE_LABELS } from '../constants';

export default function SearchBar({ 
  searchTerm, 
  onSearchChange, 
  type, 
  onTypeChange, 
  onClear, 
  inputRef 
}) {
  return (
    <div className="container mb-4">
      <div className="row g-3 align-items-end">
        <div className="col-12 col-md-6 col-lg-6">
          <label htmlFor="search-input">
            Buscar
          </label>
          <input
            id="search-input"
            type="text"
            ref={inputRef}
            className="form-control"
            placeholder="Buscar películas, series..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Buscar películas"
          />
        </div>
        
        <div className="col-12 col-md-3 col-lg-3">
          <label htmlFor="type-select">
            Tipo
          </label>
          <select
            id="type-select"
            className="form-select"
            value={type}
            onChange={(e) => onTypeChange(e.target.value)}
            aria-label="Seleccionar tipo de contenido"
          >
            {Object.entries(MOVIE_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="col-12 col-md-3 col-lg-3">
          <button
            className="btn btn-outline-danger w-100"
            onClick={onClear}
            aria-label="Limpiar búsqueda"
          >
            <i className="bi bi-x-circle"></i> Limpiar
          </button>
        </div>
      </div>
    </div>
  );
}