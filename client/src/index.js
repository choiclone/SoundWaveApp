import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { FileContextProvider } from './contexts/fileContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <FileContextProvider>
    <App />
  </FileContextProvider>
  // </React.StrictMode>
);