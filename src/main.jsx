import React from 'react';
import { createRoot } from 'react-dom/client';
import './global.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import SyllabusPage from './pages/Syllabus.jsx';
import NotesPage from './pages/Notes.jsx';
import HubPage from './pages/Hub.jsx';
import CalendarPage from './pages/Calendar.jsx';

createRoot(document.getElementById('root')).render(
	<BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/hub" element={<HubPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/syllabus" element={<SyllabusPage />} />
        <Route path="/notes" element={<NotesPage />} />
      </Routes>
    </AuthProvider>
	</BrowserRouter>
);
