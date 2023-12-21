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

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

// structural component

// my key: c9aafbcd  http://www.omdbapi.com/?apikey=[yourkey]&
export const KEY = 'c9aafbcd';

export default function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  // const [watched, setWatched] = useState([]);
  const [watched, setWatched] = useState(function () {
    const storedValue = JSON.parse(localStorage.getItem('watched'));
    return storedValue;
  });

  function handleSelectMovie(id) {
    setSelectedId((i) => (i === id ? null : id));
  }

  function handleWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
    // localStorage.setItem('watched', JSON.stringify([...watched, movie]));
    // console.log(watched);
  }

  function handleDeleteWatched(id) {
    setWatched(watched.filter((mov) => mov.imdbID !== id));
    // const list = JSON.parse(localStorage.getItem('watched'));
    // const listModify = list.filter((el) => el.imdbID !== id);
    // localStorage.setItem('watched', JSON.stringify(listModify));
  }

  function handleCloseMovieDetails() {
    setSelectedId(null);
  }

  useEffect(
    function () {
      localStorage.setItem('watched', JSON.stringify(watched));
    },
    [watched]
  );

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
