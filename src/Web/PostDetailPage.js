import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function PostDetailPage() {
  const { id } = useParams(); // URL 파라미터에서 id 값을 받음
  const navigate = useNavigate(); // 수정 시 이동할 페이지를 위해 사용
  const [postDetail, setPostDetail] = useState(null);
  const [postTitle, setPostTitle] = useState(''); // 게시글 제목
  const [postContent, setPostContent] = useState(''); // 게시글 내용
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(''); // 오류 메시지
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부


  const currentUser = sessionStorage.getItem("username");

  const userId = sessionStorage.getItem('userId');
  console.log("Session User ID:", userId);

  useEffect(() => {
    if (!id) {
      setError('게시글 ID가 제공되지 않았습니다.');
      setLoading(false);
      return;
    }

    const fetchPostDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://10.125.121.222:8080/api/board/${id}`);
        if (!response.ok) {
          throw new Error('게시글을 불러오는 데 실패했습니다.');
        }
        const data = await response.json();
        console.log("데이터: ", data);
        setPostDetail(data);
        setPostTitle(data.title); // 제목 설정
        setPostContent(data.content); // 내용 설정
        setLoading(false);
      } catch (error) {
        setError(error.message || '게시글을 불러오는 데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [id]);

  // 게시글 수정 버튼 클릭 시 수정 모드 활성화
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // 게시글 수정 제출
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!postTitle || !postContent || !postDetail.dutyname) {
      alert('제목, 내용, 병원을 모두 입력해주세요.');
      return;
    }

    const updatedPost = {
      id: id,
      dutyname: postDetail.dutyname, // 병원명은 postDetail에서 가져옴
      title: postTitle,
      content: postContent,
    };

    try {
      const response = await fetch(`http://10.125.121.222:8080/api/board/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(updatedPost),
      });

      if (response.ok) {
        const data = await response.json();
        setPostDetail(data);
        alert('게시글이 수정되었습니다.');
        setIsEditing(false);

        // 수정 후 해당 게시글의 상세 페이지로 이동
        navigate(`/post/${id}`);
      } else {
        alert('수정 실패');
      }
    } catch (error) {
      console.error(error);
      alert('수정 실패');
    }
  };

  // 게시글 삭제
  const handleDeleteClick = async () => {
    try {
      const response = await fetch(`http://10.125.121.222:8080/api/board/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem("jwtToken")}`,
        },
      });

      if (response.ok) {
        navigate('/community'); // 게시글 삭제 후 community 페이지로 이동
      } else {
        alert('삭제 실패');
      }
    } catch (error) {
      console.error(error);
      alert('삭제 실패');
    }
  };

  return (
    <div style={{ width: "50%", margin: "auto", padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "10px" }}>
      {loading && <p>게시글 정보를 불러오는 중...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && postDetail && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", width: "100%" }}>
          <div style={{ width: "70%", maxWidth: "600px", marginLeft: "20px" }}>
            {/* 병원 이름 표시 */}
            <div
              style={{
                width: "100%",
                textAlign: "center",
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: "#333",
                marginBottom: "10px",
              }}
            >
              {postDetail.dutyname || "병원 이름이 없습니다."}
            </div>

            {/* 제목 입력 */}
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="제목을 입력하세요."
              style={{
                width: '100%',
                maxWidth: '580px',
                height: '10px',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
              disabled={!isEditing} // 수정 모드일 때만 입력 가능
            />

            {/* 게시글 작성 */}
            <div style={{ position: "relative", width: "100%", }}>
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="내용을 입력하세요."
                rows="8"
                style={{
                  width: '100%',
                  height: "200px",
                  maxWidth: "580px",
                  marginBottom: "10px",
                  padding: "10px",
                  borderRadius: "4px",
                  resize: "none",
                }}
                disabled={!isEditing} // 수정 모드일 때만 입력 가능
              />
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              marginTop: '10px',
            }}>
              {!isEditing && (
                <button
                  onClick={() => navigate('/community')}
                  style={{
                    padding: "5px 10px", 
                    background: "black", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "5px", 
                    cursor: "pointer",
                  }}
                >
                  목록
                </button>
              )}

              {/* 수정 및 삭제 버튼 그룹 */}
              {!isEditing && postDetail && currentUser && currentUser === postDetail.username && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px',
                    width: 'auto',
                    alignItems: 'stretch',
                  }}
                >
                  <button
                    onClick={handleEditClick}
                    style={{
                      padding: '5px 10px',
                      background: 'black',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    style={{
                      padding: '5px 10px',
                      background: 'black',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>

            {/* 수정 모드일 때 */}
            {isEditing && (
              <div>
                <button
                  onClick={handleEditSubmit}
                  style={{
                    padding: "5px 10px", background: "black", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginRight: "10px"
                  }}
                >
                  수정
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{
                    padding: "5px 10px", background: "black", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginRight: "10px"
                  }}
                >
                  취소
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
