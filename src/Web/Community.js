import React, { useState, useEffect } from 'react'

export default function Community() {
  const [hospitalList, setHospitalList] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  


  
  // 병원 목록 API 호출
  useEffect(() => {
    const fetchHospitalList = async () => {
      try {
        const response = await fetch(`http://10.125.121.222:8080/api/list`);
        if (!response.ok) {
          throw new Error('병원 목록을 가져오는 데 실패했습니다.');
        }
        const data = await response.json();
        setHospitalList(data); // 병원 목록 상태 업데이트
      } catch (error) {
        setError(error.message); // 오류 상태 설정
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };

    fetchHospitalList();
  }, []);

  // 게시글 작성 핸들러
  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (selectedHospital && postContent) {
      setPosts([
        ...posts,
        { hospital: selectedHospital, content: postContent, date: new Date().toLocaleString() },
      ]);
      setPostContent(''); // 작성 후 입력란 초기화
    } else {
      alert('병원과 게시글 내용을 모두 입력해주세요.');
    }
  };

  return (
    <div>
      <h1>병원 커뮤니티</h1>

      {/* 병원 목록 로딩 상태 */}
      {loading && <p>병원 목록을 불러오는 중...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* 병원 선택 */}
      {!loading && !error && (
        <div>
          <label htmlFor="hospital">병원 선택: </label>
          <select
            id="hospital"
            value={selectedHospital}
            onChange={(e) => setSelectedHospital(e.target.value)}
          >
            <option value="">병원 선택</option>
            {hospitalList.map((hospital) => (
              <option key={hospital.id} value={hospital.name}>
                {hospital.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 게시글 작성 */}
      <div>
        <textarea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="게시글을 작성하세요."
          rows="5"
          style={{ width: '100%' }}
        />
        <button onClick={handlePostSubmit}>게시글 작성</button>
      </div>

      {/* 게시글 목록 */}
      <div>
        <h2>게시글 목록</h2>
        {posts.length === 0 ? (
          <p>게시글이 없습니다.</p>
        ) : (
          <ul>
            {posts.map((post, index) => (
              <li key={index}>
                <strong>{post.hospital}</strong> ({post.date})<br />
                <p>{post.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
