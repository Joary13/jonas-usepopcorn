import { useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import { Loader } from './Loader';
import { ErrorMessage } from './ErrorMessage';
import { InputMovie } from './InputMovie';
import { NumResults } from './NumResults';
import { Main } from './Main';
import { MovieList } from './MovieList';
import { SelectedMovie } from './SelectedMovie';
import { BoxMovie } from './BoxMovie';
import { MoviesWatchedSummary } from './MoviesWatchedSummary';
import { WatchedMoviesList } from './WatchedMoviesList';

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

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

// structural component

// my key: c9aafbcd  http://www.omdbapi.com/?apikey=[yourkey]&
export const KEY = 'c9aafbcd';

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

  function handleWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
    // console.log(watched);
  }

  function handleDeleteWatched(id) {
    setWatched(watched.filter((mov) => mov.imdbID !== id));
  }

  function handleCloseMovieDetails() {
    setSelectedId(null);
  }

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchData() {
        try {
          setIsLoading(true);
          setError('');

          const result = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!result.ok)
            throw new Error('something went wrong with fetching movies');
          const data = await result.json();
          // console.log(data);
          if (data.Response === 'False') throw new Error(data.Error);
          setMovies(data.Search);
          // console.log(data.Search);
          setError('');
        } catch (err) {
          if (err.name !== 'AbortError') {
            setError(err.message);
          }
          // console.error(err.name);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError('');
        return;
      }
      handleCloseMovieDetails();
      fetchData();
      return function () {
        controller.abort();
      };
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
              onAddWatched={handleWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <MoviesWatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </BoxMovie>
      </Main>
    </>
  );
}
