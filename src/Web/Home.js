import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [addr1List, setAddr1List] = useState([]);
  const [addr2List, setAddr2List] = useState([]);
  const [selectedAddr1, setSelectedAddr1] = useState("");
  const [selectedAddr2, setSelectedAddr2] = useState(""); // 상태 선언 추가
  const [currentTime, setCurrentTime] = useState("");
  const [hospitalList, setHospitalList] = useState([]);

  // 시간 업데이트 함수
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const date = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");

      setCurrentTime(`${year}-${month}-${date}(${hours}:${minutes})`);
    };

    updateTime(); // 처음 시간 설정
    const intervalId = setInterval(updateTime, 60000); // 매 분마다 업데이트

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 interval 정리
  }, []);

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

  // 병원 정보 가져오기
  const handleSearchClick = () => {
    if (!selectedAddr1 || !selectedAddr2) {
      alert("시도와 시군구를 선택해주세요.");
      return;
    }

    fetch(`http://10.125.121.222:8080/api/list?key1=${selectedAddr1}&key2=${selectedAddr2}`)
      .then((response) => response.json())
      .then((data) => {
        setHospitalList(data);
      })
      .catch((error) => {
        console.error("Error fetching hospitals:", error);
      });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "auto",
        padding: "20px",
      }}
    >
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <h2 style={{ marginBottom: "5px" }}>응급실 실시간 정보</h2>
        <p style={{ fontSize: "18px", fontWeight: "bold", marginTop: "5px" }}>{currentTime}</p>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
        <div>
          <select
            onChange={handleAddr1Change}
            value={selectedAddr1}
            style={{ padding: "8px", fontSize: "16px", width: "200px", textAlign: "center" }}
          >
            <option value="">== 시도 ==</option>
            {addr1List.map((addr1, index) => (
              <option key={index} value={addr1}>
                {addr1}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            onChange={(e) => setSelectedAddr2(e.target.value)}
            value={selectedAddr2}
            style={{ padding: "8px", fontSize: "16px", width: "200px", textAlign: "center" }}
          >
            <option value="">== 시군구 ==</option>
            {addr2List.map((addr2, index) => (
              <option key={index} value={addr2}>
                {addr2}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleSearchClick}
          style={{
            padding: "10px",
            fontSize: "15px",
            width: "420px",
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: "darkred",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          검색
        </button>
      </div>

      {hospitalList.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h3>병원 목록</h3>
          <table style={{ borderCollapse: "collapse", width: "100%", maxWidth: "600px", margin: "0 auto", tableLayout: "fixed" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px", width: "50%", textAlign: "left" }}>병원 이름</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", width: "50%", textAlign: "left" }}>주소</th>
              </tr>
            </thead>
            <tbody>
              {hospitalList.map((hospital) => (
                <tr key={hospital.id}>
                  <td style={{ border: "1px solid #ddd", padding: "8px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    <Link to={`/hospital/${hospital.hpid}`} style={{ color: "blue", textDecoration: "none" }}>
                      {hospital.dutyname}
                    </Link>
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {hospital.dutyaddr}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
