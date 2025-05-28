import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import SeriesPage from './pages/SeriesPage';
import ProfilePage from './pages/ProfilePage';
import DetailPage from './pages/DetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CategoryPage from './pages/CategoryPage';
import RatingsPage from './pages/RatingsPage';
import ChatBoxWrapper from './components/ChatBoxWrapper';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="filmler" element={<MoviesPage />} />
          <Route path="diziler" element={<SeriesPage />} />
          <Route path="profil" element={<ProfilePage />} />
          <Route path="puanlamalarim" element={<RatingsPage />} />
          <Route path="film/:id" element={<DetailPage />} />
          <Route path="dizi/:id" element={<DetailPage />} />
          <Route path="kategori/:category" element={<CategoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route path="/giris" element={<LoginPage />} />
        <Route path="/kayit" element={<RegisterPage />} />
      </Routes>

      {/* Sağ alttaki sabit buton */}
      <ChatBoxWrapper />

      {/* Toast bildirimleri */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
      />
    </BrowserRouter>
  );
}

export default App;
