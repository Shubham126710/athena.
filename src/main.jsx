import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './global.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoadingScreen from './components/LoadingScreen.jsx';

// Lazy loaded routes
const Landing = React.lazy(() => import('./pages/Landing.jsx'));
const Login = React.lazy(() => import('./pages/Login.jsx'));
const SyllabusPage = React.lazy(() => import('./pages/Syllabus.jsx'));
const NotesPage = React.lazy(() => import('./pages/Notes.jsx'));
const HubPage = React.lazy(() => import('./pages/Hub.jsx'));
const CalendarPage = React.lazy(() => import('./pages/Calendar.jsx'));
const NotFound = React.lazy(() => import('./pages/NotFound.jsx'));

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/hub" element={<HubPage />} />
          <Route path="/syllabus" element={<SyllabusPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  </BrowserRouter>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.error('ServiceWorker registration failed: ', err);
    });
  });
}
