import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // 추가

export default function PostPage() {
  const [addr1List, setAddr1List] = useState([]);
  const [addr2List, setAddr2List] = useState([]);
  const [selectedAddr1, setSelectedAddr1] = useState("");
  const [selectedAddr2, setSelectedAddr2] = useState("");
  const [hospitalList, setHospitalList] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [posts, setPosts] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();  // useNavigate 훅 추가

  // addr1 목록 가져오기
  useEffect(() => {
    fetch("http://10.125.121.222:8080/api/districts/addr1")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAddr1List(data);
        } else {
          setAddr1List([]);
        }
      })
      .catch((error) => console.error("Error fetching addr1:", error));
  }, []);

  // addr1 선택 시 addr2 목록 가져오기
  const handleAddr1Change = (e) => {
    const selected = e.target.value;
    setSelectedAddr1(selected);

    fetch(`http://10.125.121.222:8080/api/districts/addr2?addr1=${selected}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAddr2List(data);
        } else {
          setAddr2List([]);
        }
      })
      .catch((error) => console.error("Error fetching addr2:", error));
  };

  const handleSearchClick = () => {
    if (!selectedAddr1 || !selectedAddr2) {
      alert("지역을 선택해주세요.");
      return;
    }

    fetch(`http://10.125.121.222:8080/api/list?key1=${selectedAddr1}&key2=${selectedAddr2}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("검색된 병원 데이터:", data);

        if (Array.isArray(data) && data.length > 0) {
          const hospitalNames = data
            .filter(hospital => hospital.dutyname) // dutyname이 있는 항목만 필터링
            .map((hospital) => hospital.dutyname); // dutyname만 추출

          if (hospitalNames.length > 0) {
            setHospitalList(hospitalNames); // dutyname 목록만 저장
            setSelectedHospital(''); // 병원 선택 초기화
          } else {
            setHospitalList([]); // dutyname이 없는 경우 빈 배열로 설정
            alert("해당 지역에 병원이 없습니다.");
          }
        } else {
          setHospitalList([]); // 병원 목록이 없을 경우 빈 배열로 설정
          alert("해당 지역에 병원이 없습니다.");
        }
      })
      .catch((error) => {
        console.error("Error fetching hospitals:", error);
        alert("병원 정보를 가져오는 데 실패했습니다.");
      });
  };

  // 게시글 등록 API 호출
  const handlePostSubmit = (e) => {
    e.preventDefault();

    // 필수 값 체크
    if (!selectedHospital || !postTitle || !postContent) {
      alert("병원, 제목, 내용을 모두 입력해주세요.");
      return;
    }

    // 로그인한 사용자의 username을 가져오기
    const username = sessionStorage.getItem("username");

    if (!username) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 날짜 포맷 변경하기
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
      const timezoneOffset = date.getTimezoneOffset();
      const offsetSign = timezoneOffset > 0 ? '-' : '+';
      const offsetHours = String(Math.abs(Math.floor(timezoneOffset / 60))).padStart(2, '0');
      const offsetMinutes = String(Math.abs(timezoneOffset % 60)).padStart(2, '0');

      // ISO 8601 형식으로 포맷팅 (예: 2025-01-08T18:49:07.857+00:00)
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offsetSign}${offsetHours}:${offsetMinutes}`;
    };

    // 현재 날짜를 포맷팅
    const formattedDate = formatDate(new Date());
    console.log(formattedDate);

    const postData = {
      dutyname: selectedHospital,
      title: postTitle,
      content: postContent,
      username: username,
      createDate: formattedDate,
    };
    console.log(postData);

    // 게시글 등록 API 호출
    fetch('http://10.125.121.222:8080/api/board', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem("jwtToken")}`,
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            console.error('서버 응답 오류:', errorData);
            throw new Error(errorData.message || '게시글 등록에 실패했습니다.');
          });
        }
        return response.json();
      })
      .then((data) => {
        // API 호출 후, 로컬 상태에 새 게시글 추가
        setPosts([...posts, postData]);
        setPostTitle(''); // 제목 초기화
        setPostContent(''); // 내용 초기화
        navigate("/community");  // 글 등록 후 community 페이지로 이동
      })
      .catch((error) => {
        console.error("Error posting data:", error);
        alert("게시글 등록에 실패했습니다.");
      });
  };

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

  return (
    <div>
      {/* 병원 목록 로딩 상태 */}
      {loading && <p>병원 목록을 불러오는 중...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* 병원 선택 */}
      <div style={{ marginTop: "60px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", alignItems: "center" }}>
          <select
            onChange={handleAddr1Change}
            value={selectedAddr1}
            style={{ padding: "8px", fontSize: "16px", width: "229px", textAlign: "center", marginLeft: "45px", borderRadius: "4px",}}
          >
            <option value="">== 시도 ==</option>
            {addr1List.map((addr1, index) => (
              <option key={"add1" + index} value={addr1}>
                {addr1}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => setSelectedAddr2(e.target.value)}
            value={selectedAddr2}
            style={{ padding: "8px", fontSize: "16px", width: "229px", textAlign: "center", borderRadius: "4px", }}
          >
            <option value="">== 시군구 ==</option>
            {addr2List.map((addr2, index) => (
              <option key={"addr2" + index} value={addr2}>
                {addr2}
              </option>
            ))}
          </select>

          {/* 검색 버튼 */}
          <button
            onClick={handleSearchClick}
            style={{
              padding: "8px",
              fontSize: "15px",
              width: "140px",
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: "black",
              color: "white",
              border: "none",
              borderRadius: "4px",
              marginRight: "3px"
            }}
          >
            검색
          </button>
        </div>
      </div>

      {/* 병원 목록과 게시글 작성 부분 */}
      {!loading && !error && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", width: "100%" }}>
          <div style={{ width: "70%", maxWidth: "600px", marginLeft: "20px" }}>
            <select
              id="hospital"
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
              style={{
                width: "622px",
                height: "35px",
                textAlign: "center",
                fontSize: "16px",
                marginTop: "15px",
                marginBottom: "10px",
                borderRadius: "4px",
              }}
            >
              <option value="">== 병원 선택 ==</option>
              {hospitalList.length > 0 ? (
                hospitalList.map((hospitalName, index) => (
                  <option key={index} value={hospitalName}>
                    {hospitalName}
                  </option>
                ))
              ) : (
                <option>검색된 병원이 없습니다.</option>
              )}
            </select>

            {/* 제목 입력 */}
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="제목을 입력하세요."
              style={{
                width: '100%',
                maxWidth: '600px',
                height: '10px',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '4px',
                border: '1px solid black',
              }}
            />

            {/* 게시글 작성 */}
            <div style={{ position: "relative", width: "100%" }}>
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="내용을 입력하세요."
                rows="8"
                style={{
                  width: '100%',
                  height: "200px",
                  maxWidth: "600px",
                  marginBottom: "10px",
                  padding: "10px",
                  borderRadius: "4px",
                  resize: "none",
                }}
              />
              <button
                onClick={handlePostSubmit}
                style={{
                  position: "absolute",
                  right: "-23px",
                  padding: "5px 10px",
                  backgroundColor: "black",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                등록

              </button>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
