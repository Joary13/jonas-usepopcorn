import { useEffect } from 'react';
import { useState } from 'react';

const KEY = 'c9aafbcd';

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // my key: c9aafbcd  http://www.omdbapi.com/?apikey=[yourkey]&

  useEffect(
    function () {
      // callback?.();
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
      // handleCloseMovieDetails();
      fetchData();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, error };
}
