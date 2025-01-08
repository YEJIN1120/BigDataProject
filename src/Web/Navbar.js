import React, { useState } from 'react';
import { IoPersonOutline } from 'react-icons/io5';
import { IoIosMenu } from 'react-icons/io';
import { useLocation, Link } from 'react-router-dom';

export default function Navbar({ hpid, onLogout }) {
  // 메뉴 상태 관리
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const location = useLocation();

  // 메뉴 열기/닫기
  const toggleMenu = () => {
    console.log("Toggling menu");
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    console.log("Closing menu");
    setIsMenuOpen(false);
  };

  // '/Login' 경로일 때 Navbar를 숨김
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <div>
      {/* 로그인/로그아웃 버튼 */}
      <div className='login-btn'>
        <IoPersonOutline />
          <button onClick={onLogout} className='auth-btn'>로그아웃</button>
      </div>

      {/* 헤더 */}
      <div className='header'>
        {/* title을 클릭하면 홈 화면으로 이동 */}
        <Link to="/" className='title'>
          <h1>골든타임⏱</h1>
        </Link>
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
          <li>
            <Link to="/" onClick={closeMenu} style={{ textDecoration: 'none', color: 'inherit'}}>HOME</Link>
          </li>
          <li>
            <Link to="/community" onClick={closeMenu} style={{ textDecoration: 'none', color: 'inherit' }}>
              커뮤니티
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
