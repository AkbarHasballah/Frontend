import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import LoginPage from './pages/LoginPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LoginPage />
  </React.StrictMode>,
);
