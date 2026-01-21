import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// IMPORTACIÓN DEL CSS
import './assets/estilos.css'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);