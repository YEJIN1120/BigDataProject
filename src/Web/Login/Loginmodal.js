import React from 'react'
import { useState } from 'react';
import { FormGroup, Modal, ModalBody, ModalHeader, Label, Button, Form, Input} from 'reactstrap';
import styles from './Loginmodal.module.css';
import { IoMdClose } from "react-icons/io";

export default function Loginmodal({ isOpen, onClose }) {
  // 로그인 폼 상태
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  // 입력 값 처리
  const handleSubmit = (e) => {
    e.preventDefault();

    //로그인 처리 로직 추가(API 호출)
    console.log('로그인 시도:', userId, password);

    // 로그인 후 모달 닫기
    onClose();
  };

  return (
    <div className="Loginmodal">
      {/* 로그인 모달 */}
      <Modal className={styles.modal} isOpen={isOpen} toggle={onClose}>
        <ModalHeader className={styles.header}>
          로그인
          {/* 오른쪽 상단 닫기 버튼*/}
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
              <Input className={styles.input}
                      id="userId"
                      type="text"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="아이디를 입력하세요" />
            </FormGroup>
            <FormGroup className={styles.formGroup}>
              <Label for="password">PW</Label>
              <Input className={styles.input}
                     id="password" 
                     type="password" 
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="비밀번호를 입력하세요" />
            </FormGroup>
            <Button color="primary" type="submit">로그인</Button>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  )
}
