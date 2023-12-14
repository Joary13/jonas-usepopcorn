import { useEffect, useState } from 'react';
import StarRating from './StarRating';

const tempMovieData = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt0133093',
    Title: 'The Matrix',
    Year: '1999',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt6751668',
    Title: 'Parasite',
    Year: '2019',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg',
  },
];

const tempWatchedData = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: 'tt0088763',
    Title: 'Back to the Future',
    Year: '1985',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

// structural component

// my key: c9aafbcd  http://www.omdbapi.com/?apikey=[yourkey]&
const KEY = 'c9aafbcd';

export default function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  // useEffect(function () {
  //   console.log('after initial render');
  // }, []);

  // useEffect(function () {
  //   console.log('after every render');
  // });

  // console.log('during render');

  // useEffect(function () {
  //   console.log('after initial render');
  // }, [query]);

  function handleSelectMovie(id) {
    setSelectedId((i) => (i === id ? null : id));
  }

  function handleCloseMovieDetails() {
    setSelectedId(null);
  }

  useEffect(
    function () {
      async function fetchData() {
        try {
          setIsLoading(true);
          setError('');

          const result = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );
          if (!result.ok)
            throw new Error('something went wrong with fetching movies');
          const data = await result.json();
          console.log(data);
          if (data.Response === 'False') throw new Error(data.Error);
          setMovies(data.Search);
          console.log(data.Search);
        } catch (err) {
          console.error(err.message);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError('');
        return;
      }
      fetchData();
    },
    [query]
  );

  return (
    <>
      <Navbar>
        <InputMovie query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>
      <Main>
        {/* <BoxMovie element={<MovieList movies={movies} />} /> */}
        {/* <BoxMovie
          element={
            <>
              <MoviesWatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} />
            </>
          }
        /> */}
        <BoxMovie>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              onSelectMovie={handleSelectMovie}
              selectedId={selectedId}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </BoxMovie>
        <BoxMovie>
          {selectedId ? (
            <SelectedMovie
              selectedId={selectedId}
              onCloseMovieDetails={handleCloseMovieDetails}
            />
          ) : (
            <>
              <MoviesWatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} />
            </>
          )}
        </BoxMovie>
      </Main>
    </>
  );
}

// structural component

function Navbar({ children }) {
  return (
    <nav className='nav-bar'>
      <Logo />
      {children}
    </nav>
  );
}

function Loader() {
  return <p className='loader'>Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className='error'>
      <span>⛔</span>
      {message}
    </p>
  );
}

//stateless/presentational component

function Logo() {
  return (
    <div className='logo'>
      <span role='img'>🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

// stateful component

function InputMovie({ query, setQuery }) {
  return (
    <input
      className='search'
      type='text'
      placeholder='Search movies...'
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

// stateless/presentational

function NumResults({ movies }) {
  return (
    <p className='num-results'>
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

// structural
function Main({ children }) {
  return <main className='main'>{children}</main>;
}

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
function MovieList({ movies, onSelectMovie, selectedId }) {
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

// stateless/presentational

function MovieFromList({ movie, onSelectMovie, selectedId }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function SelectedMovie({ selectedId, onCloseMovieDetails }) {
  const [movieInfos, setMovieInfos] = useState({});
  const [loading, setLoading] = useState(false);
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    ImdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movieInfos;

  useEffect(
    function () {
      async function fetchMovie() {
        try {
          setLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
          );
          // console.log(res);
          if (!res.ok) throw new Error('pb de fetching');
          const movieDetails = await res.json();
          if (movieDetails) setMovieInfos(movieDetails);
          setLoading(false);
        } catch (err) {
          console.log(err);
        }
      }
      fetchMovie();
    },
    [selectedId]
  );

  return (
    <div className='details'>
      {loading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className='btn-back' onClick={onCloseMovieDetails}>
              &larr;
            </button>
            <img src={poster} alt={`poster of ${title}`} />
            <div className='details-overview'>
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⚡</span>
                {ImdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className='rating'>
              <StarRating maxRating={10} size={24} />
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

// statefull
// function BoxWatchedMovies() {
//   const [isOpen2, setIsOpen2] = useState(true);
//   const [watched, setWatched] = useState(tempWatchedData);

//   return (
//     <div className='box'>
//       <button
//         className='btn-toggle'
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? '–' : '+'}
//       </button>
//       {isOpen2 && (
//         <>
//           <MoviesWatchedSummary watched={watched} />
//           <WatchedMoviesList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }

function BoxMovie({ children, loading, selectedId }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className='box'>
      <button className='btn-toggle' onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? '–' : '+'}
      </button>
      {isOpen && children}
    </div>
  );
}

// stateless/presentational
function MoviesWatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className='summary'>
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

// stateless
function WatchedMoviesList({ watched }) {
  return (
    <ul className='list'>
      {watched.map((movie) => (
        <MovieWatched key={movie.imdbID} movie={movie} />
      ))}
    </ul>
  );
}

// stateless/presentational
function MovieWatched({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}
