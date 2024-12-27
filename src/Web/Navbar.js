// import TailButton from "./TailButton"
import { useNavigate } from "react-router-dom"
import React, { useState } from 'react';
import { IoPersonOutline } from 'react-icons/io5';
import { IoIosMenu } from 'react-icons/io';
import Loginmodal from "./Login/Loginmodal";
export default function Navbar() {
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 모달 열기
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // navigate 훅을 사용하여 페이지 이동
  const navigate = useNavigate();

  // 메뉴 리스트
  const menuList = ['병원', '질병', '커뮤니티'];

  // 메뉴 클릭 시 페이지 이동
  const handleMenuClick = (menu) => {
  
  };

  return (
    <div>
      {/* 로그인 버튼 */}
      <div className='login-btn'>
        <IoPersonOutline />
        <div onClick={openModal} className='login'>로그인</div>
      </div>
      
      {/* 헤더 */}
      <div className='header'>
        <h1 className='title'>골든타임⏱</h1>
        <div className='menu-area'> 
          <ul className='menu-list'>
              {menuList.map((menu)=>(
                <li>{menu}</li>))}
              <div style={{width:'40px', height:'40px'}}><IoIosMenu /></div>
          </ul>
        </div>
      </div>

      {/* 로그인 모달 */}
      <Loginmodal isOpen={isModalOpen} onClose={closeModal} />
     

      {/* <div className="w-10/12 grid grid-cols-3 m-5">
        <TailButton caption = "Home"
                    color = "red"
                    handleClick = {() => navigete('/')}
                    size />
        <TailButton caption = "Detail"
                    color = "red"
                    handleClick = {() => navigete('/detail')}
                    size />
      </div> */}
    </div>
  );
}
