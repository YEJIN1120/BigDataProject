// import TailButton from "./TailButton"
import React, { useState } from 'react';
import { IoPersonOutline } from 'react-icons/io5';
import { IoIosMenu } from 'react-icons/io';
import { Button } from 'reactstrap';
import Loginmodal from "./Login/Loginmodal";

export default function Navbar({ isLoggedIn, onLogout, onLoginClick }) {
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 메뉴 상태 관리
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 모달 열기
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 메뉴 열기/닫기
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  

  return (
    <div>
      {/* 로그인/로그아웃 버튼 */}
      <div className='login-btn'>
        <IoPersonOutline />
        {isLoggedIn ? (
          <Button color="danger" onClick={onLogout}>로그아웃</Button>
        ) : (
          <div onClick={onLoginClick} className='login'>로그인</div>
        )}
        {/* <div onClick={openModal} className='login'>로그인</div> */}
      </div>
      
      {/* 헤더 */}
      <div className='header'>
        <h1 className='title'>골든타임⏱</h1>
        <div className='menu-area'> 
          <button className="menu-button"
                  onClick={toggleMenu}
                  style={{ width: '40px', height:'40px' }}
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
