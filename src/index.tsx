// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // optional global CSS
import App from './App';

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
