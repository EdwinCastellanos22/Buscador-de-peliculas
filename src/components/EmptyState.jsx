import logo from '../assets/movie.svg';

export default function EmptyState({ message = 'No se encontraron resultados' }) {
  return (
    <div className="col-12 text-center text-white-50 mt-5">
      <img 
        src={logo} 
        style={{ width: '100px', opacity: 0.3 }} 
        alt="Icono de película" 
        aria-hidden="true"
      />
      <p className="mt-3">{message}</p>
    </div>
  );
}