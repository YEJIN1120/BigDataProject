import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormGroup, Modal, ModalBody, ModalHeader, Label, Button, Form, Input } from 'reactstrap';
import styles from './Loginmodal.module.css';
import { IoMdClose } from "react-icons/io";

export default function Loginmodal({ isOpen, onClose, onLoginSuccess }) {
  // 로그인 폼 상태
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  // 입력 값 처리
  const handleSubmit = async(e) => {
    e.preventDefault();

    // 로그인 처리 로직 추가 (API 호출)
    const loginData = {
      username: userId,
      password: password,
    };

    await fetch('http://10.125.121.222:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData), //loginData 객체를 보냄
    }).then(res => {
      if (res.ok) {
        const token = res.headers.get('Authorization');
      if (token) {
        console.log("token:",token);
        sessionStorage.setItem("username", userId);
        sessionStorage.setItem("jwtToken", token);
        onLoginSuccess();
        navigate('/');
      } else {
        alert("로그인 실패");
      } 
    } else {
        alert("로그인 실패");
    }
    }).catch(error => {
      console.log('error', error);
    });
    console.log('로그인 시도:', userId, password);
  }

  return (
    <div className="Loginmodal">
      {/* 로그인 모달 */}
      <Modal className={styles.modal} isOpen={isOpen} toggle={onClose}>
        <ModalHeader className={styles.header}>
          로그인
          {/* 오른쪽 상단 닫기 버튼 */}
          <IoMdClose
            onClick={onClose} // 아이콘 클릭 시 모달 닫기
            style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}
            size={24} // 아이콘 크기
          />
        </ModalHeader>
        <ModalBody>
          {/* 로그인 폼 */}
          <Form onSubmit={handleSubmit}>
            <FormGroup className={styles.formGroup}>
              <Label for="userId">ID</Label>
              <Input
                className={styles.input}
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="아이디를 입력하세요"
              />
            </FormGroup>
            <FormGroup className={styles.formGroup}>
              <Label for="password">PW</Label>
              <Input
                className={styles.input}
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
              />
            </FormGroup>
            <Button className={styles.loginbutton} color="primary" type="submit">로그인</Button>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
}
