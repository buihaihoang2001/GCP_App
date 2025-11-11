import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Import file CSS toàn cục
import App from './App'; // Import component App.jsx mới của bạn

// Tìm element 'root' trong public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render component App chính vào đó
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);