// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // ✅ import this
import App from './App';
import './index.css';
import supabase from './supabaseClient';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId="1091707651801-v48hfgmq9fphchb6ph8shjbg8ko4q8g1.apps.googleusercontent.com"> {/* ✅ public test client */}
        <App />
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
