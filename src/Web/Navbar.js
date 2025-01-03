import React, { useState } from 'react';
import { IoPersonOutline } from 'react-icons/io5';
import { IoIosMenu } from 'react-icons/io';
import Loginmodal from "./Login/Loginmodal";

export default function Navbar({ isLoggedIn, onLogout, onLoginClick }) {
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 메뉴 상태 관리
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 모달 열기
  const openModal = () => {
    console.log("Opening login modal");
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    console.log("Closing login modal");
    setIsModalOpen(false);
  };

  // 메뉴 열기/닫기
  const toggleMenu = () => {
    console.log("Toggling menu");
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    console.log("Closing menu");
    setIsMenuOpen(false);
  };

  return (
    <div>
      {/* 로그인/로그아웃 버튼 */}
      <div className='login-btn'>
        <IoPersonOutline />
        {isLoggedIn ? (
          <button onClick={onLogout} className='auth-btn'>로그아웃</button>
        ) : (
          <button onClick={onLoginClick} className='auth-btn'>로그인</button>
        )}
      </div>

      {/* 헤더 */}
      <div className='header'>
        <h1 className='title'>골든타임⏱</h1>
        <div className='menu-area'>
          <button className="menu-button"
                  onClick={toggleMenu}
                  style={{ width: '40px', height: '40px' }}
          >
            <IoIosMenu />
          </button>
        </div>
      </div>

      {/* 슬라이드 메뉴 */}
      {isMenuOpen && <div className="overlay" onClick={closeMenu}></div>}
      <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
        <ul>
          <li>커뮤니티</li>
          <li>2</li>
          <li>3</li>
        </ul>
      </div>

      {/* 로그인 모달 */}
      <Loginmodal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
