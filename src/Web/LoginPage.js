import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormGroup, Label, Button, Form, Input } from 'reactstrap';
import styles from './LoginPage.module.css';

export default function LoginPage({ onLoginSuccess }) {
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

    try {
      const res = await fetch('http://10.125.121.222:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData), //loginData 객체를 보냄
    });

      if (res.ok) {
        const token = res.headers.get('Authorization');
      if (token) {
        console.log("token:",token);
        sessionStorage.setItem("username", userId);
        sessionStorage.setItem("jwtToken", token);
        onLoginSuccess();
        navigate('/');
      } else {
        alert("로그인 실패: 토큰 없음");
      } 
    } else {
        alert("로그인 실패");
    }
    } catch(error) {
      console.error('error', error);
    }
    console.log('로그인 시도:', userId, password);
  }

  return (
    <div className={styles.loginPage}>
      {/* 로그인 페이지 */}
      <div className={styles.loginContainer}>
        <h2 className={styles.header}>로그인</h2>
        <Form onSubmit={handleSubmit} className={styles.form}>
          <FormGroup className={styles.formGroup}>
            {/* <Label className={styles.label} for="userId">ID</Label> */}
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
            {/* <Label className={styles.label} for="password">PW</Label> */}
            <Input
              className={styles.input}
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
            />
          </FormGroup>
          <Button className={styles.loginbutton} color='primary' type='submit'>
            로그인
          </Button>
        </Form>
      </div>
    </div>
  );
}
