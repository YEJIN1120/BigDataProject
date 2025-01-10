import React, { useState } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Web/Home";
import Navbar from "./Web/Navbar";
import LoginPage from "./Web/LoginPage";
import HospitalDetail from './Web/HospitalDetail';
import Community from './Web/Community';
import PostPage from './Web/PostPage';
import PostDetailPage from './Web/PostDetailPage';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem("jwtToken")); // 초기 로그인 상태

  // 로그인 성공 시 상태 변경
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  }

  // 로그아웃 시 상태 변경
  const handleLogout = () => {
    sessionStorage.removeItem("jwtToken");
    sessionStorage.removeItem("username");
    setIsLoggedIn(false);
    sessionStorage.clear();

    console.log("logout");
  };

  return (
    <div className="w-full h-full flex flex-col justify-start items-center"> 
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        {/* 홈 페이지: 로그인 여부에 따라 접근 제한 */}
        <Route path='/' element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />

        {/* 병원 상세 페이지: 로그인 여부에 따라 접근 제한 */}
        <Route path="/hospital/:hpid"
          element={isLoggedIn ? <HospitalDetail /> : <Navigate to="/login" />} />

        {/* 로그인 페이지 */}
        <Route path="/login"
          element={isLoggedIn ? <Navigate to="/" /> : <LoginPage onLoginSuccess={handleLoginSuccess} />} />

        {/* 커뮤니티 페이지 */}
        <Route path="/community"
          element={isLoggedIn ? <Community /> : <Navigate to="/login" />} />

        {/* 게시글 페이지 */}
        <Route path="/post"
          element={isLoggedIn ? <PostPage /> : <Navigate to="/login" />} />

        {/* 게시글 상세 페이지 */}
        <Route path="/post/:id"
          element={isLoggedIn ? <PostDetailPage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;