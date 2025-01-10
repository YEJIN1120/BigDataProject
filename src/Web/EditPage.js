import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function PostEditPage() {
  const { id } = useParams(); // URL 파라미터에서 게시물 ID를 가져옵니다.
  const navigate = useNavigate();
  const [postDetail, setPostDetail] = useState(null); // 수정할 게시물 상태
  const [loadingDetail, setLoadingDetail] = useState(true); // 상세 내용 로딩 상태
  const [errorDetail, setErrorDetail] = useState(null); // 상세 내용 오류 상태

  // 게시물 상세 내용을 API에서 가져오는 함수
  useEffect(() => {
    const fetchPostDetail = async () => {
      setLoadingDetail(true);
      try {
        const response = await fetch(`http://10.125.121.222:8080/api/board/${id}`); // 게시글 상세 정보 API 요청
        if (!response.ok) {
          throw new Error('게시물 정보를 불러오는 데 실패했습니다.');
        }
        const data = await response.json(); // JSON 데이터로 변환
        setPostDetail(data); // 데이터 상태에 저장
      } catch (error) {
        setErrorDetail(error.message); // 오류 처리
      } finally {
        setLoadingDetail(false); // 로딩 완료
      }
    };

    fetchPostDetail();
  }, [id]);

  // 로그인한 사용자 정보
  const currentUser = sessionStorage.getItem("username");

  if (loadingDetail) {
    return <p>게시물 정보를 불러오는 중...</p>;
  }

  if (errorDetail) {
    return <p style={{ color: 'red' }}>{errorDetail}</p>;
  }

  if (!postDetail) {
    return <p>게시물이 없습니다.</p>;
  }

  // 게시글 작성자와 로그인한 사용자 비교
  if (currentUser !== postDetail.username) {
    return <p>수정 권한이 없습니다.</p>; // 작성자가 아닌 경우 수정 불가
  }

  return (
    <div>
      {/* 수정 페이지 내용 */}
      <h2>게시글 수정</h2>
      <form>
        <div>
          <label>제목</label>
          <input
            type="text"
            value={postDetail.title}
            onChange={(e) => setPostDetail({ ...postDetail, title: e.target.value })}
          />
        </div>
        <div>
          <label>내용</label>
          <textarea
            value={postDetail.content}
            onChange={(e) => setPostDetail({ ...postDetail, content: e.target.value })}
          />
        </div>
        <button type="submit">수정 완료</button>
      </form>
    </div>
  );
}