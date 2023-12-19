import { MovieFromList } from './MovieFromList';

// statefull
// function BoxListMovies({ children }) {
//   const [isOpen1, setIsOpen1] = useState(true);
//   return (
//     <div className='box'>
//       <button
//         className='btn-toggle'
//         onClick={() => setIsOpen1((open) => !open)}
//       >
//         {isOpen1 ? '–' : '+'}
//       </button>
//       {isOpen1 && children}
//     </div>
//   );
// }
// statefull
export function MovieList({ movies, onSelectMovie, selectedId }) {
  return (
    <ul className='list list-movies'>
      {movies?.map((movie) => (
        <MovieFromList
          key={movie.imdbID}
          movie={movie}
          selectedId={selectedId}
          onSelectMovie={onSelectMovie}
        />
      ))}
    </ul>
  );
}
