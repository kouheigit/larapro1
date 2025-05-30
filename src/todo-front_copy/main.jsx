import React from 'react';
import { createRoot } from 'react-dom/client';
import Todo from './components/Todo';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <Todo />
  </React.StrictMode>,
)
