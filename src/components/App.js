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
import { useMovies } from './useMovies';
import { useLocalStorageState } from './useLocalStorageState';

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

// structural component

export default function App() {
  const [query, setQuery] = useState('');

  const [selectedId, setSelectedId] = useState(null);
  // const [watched, setWatched] = useState([]);

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

  const [watched, setWatched] = useLocalStorageState([], 'watched');

  const { movies, isLoading, error } = useMovies(query);

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
