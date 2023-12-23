import { useEffect } from 'react';

export function useKey(key, functionName) {
  useEffect(
    function () {
      function callback(e) {
        if (e.code.toLowerCase() === key.toLowerCase()) {
          functionName();
        }
      }
      document.addEventListener('keydown', callback);
      return function () {
        document.removeEventListener('keydown', callback);
      };
    },
    [key, functionName]
  );
}
