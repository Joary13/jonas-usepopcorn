import { useEffect, useState } from 'react';
import StarRating from '../StarRating';
import { Loader } from './Loader';
import { KEY } from './App';

export function SelectedMovie({
  selectedId,
  onCloseMovieDetails,
  onAddWatched,
  watched,
}) {
  const [movieInfos, setMovieInfos] = useState({});
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState('');
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movieInfos;

  const isWatched = watched.find((mov) => mov.imdbID === selectedId);

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovieDetails();
  }

  useEffect(
    function () {
      // if (isWatched) {
      //   setMovieInfos(isWatched);
      //   setUserRating(isWatched.userRating);
      // }
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

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;
      return function () {
        document.title = 'usePopcorn';
      };
    },
    [title]
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
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className='rating'>
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    defaultRating={userRating || 0}
                    onMovieRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className='btn-add' onClick={handleAdd}>
                      Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  you rated this movie {isWatched.userRating} <span>💥</span>
                </p>
              )}
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
