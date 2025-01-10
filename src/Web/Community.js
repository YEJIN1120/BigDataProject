import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Community() {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  // 게시글 테스트 데이터 (No, 병원, 제목, 작성자, 게시글 작성 날짜)
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // 검색창 입력 상태
  const [appliedSearchTerm, setAppliedSearchTerm] = useState(""); // 검색 버튼 클릭 후 실제 적용된 검색어
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const postsPerPage = 10; // 페이지당 게시글 수

  // 게시물 목록 전체 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://10.125.121.222:8080/api/board/");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        console.log("Fetched Posts:", data);
        setPosts(data); // DB에서 가져온 게시물 목록 설정
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // 검색어에 따른 게시글 필터링
  const filteredPosts = posts.filter((post) => {
    if (post.dutyname && appliedSearchTerm) {
      return post.dutyname.toLowerCase().includes(appliedSearchTerm.toLowerCase());
    }
    return true; // 검색어가 없을 경우 모든 게시글을 표시
  });

  // No 값을 기준으로 내림차순 정렬
  const sortedPosts = [...filteredPosts].sort((a, b) => b.id - a.id);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

  // 현재 페이지에 표시할 게시글
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

  // 페이지 변경 함수
  const handlePageChange = (pageNumber) => {
    const newPage = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(newPage);
  };

  // 검색어 입력 핸들러
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // 검색 버튼 클릭 핸들러
  const handleSearchClick = () => {
    setAppliedSearchTerm(searchTerm); // 검색 버튼 클릭 시 적용
    setCurrentPage(1); // 검색 결과가 갱신되면 첫 페이지로 초기화
  };

  // 게시글 클릭 시 상세 페이지로 이동
  const handlePostClick = (id) => {
    navigate(`/post/${id}`); // 해당 게시물 상세 페이지로 이동
  }


  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", width: "100%" }}>
      <div style={{ width: "70%", marginTop: "10px" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", marginTop: "50px" }}>
          {/* 게시판 */}
          <div style={{ flexGrow: 1, textAlign: "center", marginRight: "20px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>커뮤니티</h2>
          </div>

          {/* 검색창과 버튼 */}
          <div style={{ display: "flex", alignItems: "center", marginRight: "20px" }}>
            <input
              type="text"
              placeholder="병원 이름으로 검색하세요"
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                padding: "10px 15px",
                border: "1px solid #ddd",
                borderRadius: "2px",
                marginRight: "5px",
                width: "300px",
                fontSize: "15px",
              }}
            />
            <button
              onClick={handleSearchClick}
              style={{
                padding: "10px 15px",
                borderRadius: "2px",
                backgroundColor: "black",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              검색
            </button>
          </div>

          {/* 글쓰기 버튼 */}
          <div style={{ flexGrow: 1, textAlign: "center" }}>
            <button
              style={{
                padding: "5px 10px",
                backgroundColor: "white",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => navigate('/post')}
            >
              글쓰기
            </button>
          </div>
        </div>

        {posts.length > 0 ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
            <table style={{ width: "1000px", justifyContent: "center", alignItems: "center", tableLayout: "fixed", }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: "2px solid #ddd", borderTop: "2px solid black", padding: "8px", textAlign: "center", }}>No</th>
                  <th style={{ borderBottom: "2px solid #ddd", borderTop: "2px solid black", padding: "8px", textAlign: "center", }}>병원</th>
                  <th style={{ borderBottom: "2px solid #ddd", borderTop: "2px solid black", padding: "8px", textAlign: "center", }}>제목</th>
                  <th style={{ borderBottom: "2px solid #ddd", borderTop: "2px solid black", padding: "8px", textAlign: "center", }}>작성자</th>
                  <th style={{ borderBottom: "2px solid #ddd", borderTop: "2px solid black", padding: "8px", textAlign: "center", }}>작성 날짜</th>
                </tr>
              </thead>
              <tbody>
                {currentPosts.length > 0 ? (
                  currentPosts.map((post, index) => {
                    const displayNo = posts.length - (indexOfFirstPost + index); // 총 게시글 수에서 현재 게시글 순서 계산

                    return (
                      <tr key={index}>
                        <td style={{ borderBottom: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{displayNo}</td>
                        <td
                          style={{
                            borderBottom: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                            cursor: "pointer",
                          }}
                          onClick={() => handlePostClick(post.id)}
                        >
                          {post.dutyname}
                        </td>
                        <td
                          style={{
                            borderBottom: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                            cursor: "pointer",
                          }}
                          onClick={() => handlePostClick(post.id)}
                        >
                          {post.title}
                        </td>
                        <td style={{ borderBottom: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{post.username}</td>
                        <td style={{ borderBottom: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{post.createDate}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>현재 페이지에 표시할 게시글이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p>게시글이 없습니다.</p>
        )}

        {/* 페이징 버튼 */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", alignItems: "center" }}>
          <button
            onClick={() => handlePageChange(1)}
            style={{
              margin: "0 5px",
              padding: "5px 10px",
              borderRadius: "3px",
              backgroundColor: "white",
              border: "1px solid #ddd",
              cursor: "pointer",
            }}
          >
            {"<<"}
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            style={{
              margin: "0 5px",
              padding: "5px 10px",
              borderRadius: "3px",
              backgroundColor: "white",
              border: "1px solid #ddd",
              cursor: "pointer",
            }}
          >
            {"<"}
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              style={{
                margin: "0 5px",
                padding: "5px 10px",
                borderRadius: "3px",
                backgroundColor: currentPage === pageNumber ? "black" : "white",
                color: currentPage === pageNumber ? "white" : "black",
                border: "1px solid #ddd",
                cursor: "pointer",
              }}
            >
              {pageNumber}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            style={{
              margin: "0 5px",
              padding: "5px 10px",
              borderRadius: "3px",
              backgroundColor: "white",
              border: "1px solid #ddd",
              cursor: "pointer",
            }}
          >
            {">"}
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            style={{
              margin: "0 5px",
              padding: "5px 10px",
              borderRadius: "3px",
              backgroundColor: "white",
              border: "1px solid #ddd",
              cursor: "pointer",
            }}
          >
            {">>"}
          </button>
        </div>
      </div>
    </div>
  );
}
