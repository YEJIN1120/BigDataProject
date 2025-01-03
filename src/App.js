import React, { useState } from 'react';
import { Routes, Route } from "react-router-dom";
import Home from "./Web/Home";
import Navbar from "./Web/Navbar";
import Loginmodal from './Web/Login/Loginmodal';
import HospitalDetail from './Web/HospitalDetail';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 로그인 성공 시 상태 변경
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsModalOpen(false);
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
    // <div style={{padding:'0 300px'}}>
    <div className="w-full h-full flex flex-col justify-start items-center">
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} onLoginClick={() => setIsModalOpen(true)} />
      <Loginmodal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onLoginSuccess={handleLoginSuccess} />
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path="/hospital/:hpid" element={<HospitalDetail />} />
        </Routes>
    </div>
  );
}

export default App;