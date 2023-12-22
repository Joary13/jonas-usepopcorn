import { useEffect, useRef } from 'react';

// stateful component
export function InputMovie({ query, setQuery }) {
  const inputEl = useRef(null);

  useEffect(
    function () {
      function handleFocus(e) {
        if (document.activeElement === inputEl.current) return;
        if (e.code === 'Enter') {
          setQuery('');
          inputEl.current.focus();
        }
      }
      document.addEventListener('keydown', handleFocus);
      return function () {
        document.removeEventListener('keydown', handleFocus);
      };
    },
    [setQuery]
  );
  // useEffect(function () {
  //   const el = document.querySelector('.search');
  //   el.focus();
  // }, []);
  return (
    <input
      className='search'
      type='text'
      placeholder='Search movies...'
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
