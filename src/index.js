import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import StarRating from './StarRating';
import App from './App.js';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// root.render(
//   <React.StrictMode>
//     <StarRating
//       maxRating={5}
//       color='blue'
//       size='24'
//       className='test'
//       message={['horrible', 'bad', 'ok', 'good', 'super']}
//     />
//     <Test />
//     <StarRating maxRating={10} defaultRating={2} />
//   </React.StrictMode>
// );

// function Test() {
//   const [movieRating, setMovieRating] = useState(0);

//   return (
//     <div>
//       <StarRating maxRating={7} onMovieRating={setMovieRating} />
//       <p>this movie is a {movieRating} star rating</p>
//     </div>
//   );
// }
