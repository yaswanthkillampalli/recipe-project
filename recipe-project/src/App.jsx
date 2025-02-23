import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import Saved from './pages/Saved';
import Published from './pages/Published';
import Recipe from './pages/Recipe';
import NotLHome from './pages/NotLHome';
import Trending from './pages/Trending';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem("username");
    setIsLoggedIn(!!username);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<NotLHome />} /> {/* No redirect for non-logged-in */}
      <Route path="/login" element={isLoggedIn ? <Navigate to="/home" /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="/register" element={isLoggedIn ? <Navigate to="/home" /> : <Register setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
      <Route path="/published" element={isLoggedIn ? <Published /> : <Navigate to="/login" />} />
      <Route path="/recipe/:id" element={<Recipe />} /> {/* Accessible to all */}
      <Route path="/saved" element={isLoggedIn ? <Saved /> : <Navigate to="/login" />} />
      <Route path="/trending" element={isLoggedIn ? <Trending /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;