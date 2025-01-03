import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function HospitalDetail() {
  const { hpid } = useParams(); // URL에서 병원 ID 가져오기
  console.log("Hospital HPID:", hpid); // 병원 ID 확인용 로그
  const [hospitalList, setHospitalList] = useState([]);
  const [hospitalDetail, setHospitalDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 버튼 클릭 시 보여줄 정보 상태
  const [infoType, setInfoType] = useState(null);

  // 클릭된 버튼을 추적하는 상태
  const [clickedButton, setClickedButton] = useState(null);

  const [criticalInfo, setCriticalInfo] = useState(null);
  // 응급 및 중증질환 진료불가 메시지 데이터 상태
  const [emergencyInfo, setEmergencyInfo] = useState(null);

  // 병원 목록 데이터 호출
  useEffect(() => {
    const fetchHospitalList = async () => {
      const url = `http://10.125.121.222:8080/api/list/${hpid}`; // API URL 설정
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setHospitalList(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHospitalList();
  }, [hpid]); // 병원 ID(hpid)를 의존성으로 설정

  // 병원 상세 정보 찾기
  useEffect(() => {
    if (hospitalList.length > 0 && hpid) {
      // 병원 ID가 일치하는 병원을 찾기
      const hospital = hospitalList.find((hospital) => hospital.hpid === hpid);
      setHospitalDetail(hospital || null);
    }
  }, [hospitalList, hpid]);

  // 중증질환자 수용 가능 정보 가져오기
  useEffect(() => {
    if (infoType === "critical" && !criticalInfo) {
      const fetchCriticalInfo = async () => {
        const url = `http://10.125.121.222:8080/api/list/${hpid}`;
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          console.log("Critical Info Received: ", data);
          setCriticalInfo(data[0]);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchCriticalInfo();
    }
  }, [infoType, hpid, criticalInfo]);

  // 공공데이터 포털의 XML 데이터를 가져와서 파싱하는 useEffect
  useEffect(() => {
    if (infoType === 'emergency') {
      const fetchEmergencyInfo = async (page = 1, size = 50) => {
        const url = `https://apis.data.go.kr/B552657/ErmctInfoInqireService/getEmrrmSrsillDissMsgInqire?serviceKey=%2FHnA2iw3sOxo5sImlcxW2vV8HWPZbXqir1y0wWiIKNYscpxNK8FMTaMHUsATsEZVpohX5G4sa3tYmAb7M2Ntsw%3D%3D&/emergency.xml`;
        try {
          const response = await fetch(url);
          const data = await response.text();
          // XML 데이터 파싱
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, 'application/xml');

          const items = Array.from(xmlDoc.getElementsByTagName('item')).map(item => ({
            hpid: item.getElementsByTagName('hpid')[0]?.textContent,
            symBlkMsgTyp: item.getElementsByTagName('symBlkMsgTyp')[0]?.textContent,
            symTypCod: item.getElementsByTagName('symTypCod')[0]?.textContent,
            symBlkMsg: item.getElementsByTagName('symBlkMsg')[0]?.textContent,
            symBlkSttDtm: item.getElementsByTagName('symBlkSttDtm')[0]?.textContent,
            symBlkEndDtm: item.getElementsByTagName('symBlkEndDtm')[0]?.textContent,
          }));

          return items;
        } catch (error) {
          console.error('Error fetching emergency info:', error);
        }
      };

      const fetchAllEmergencyMessages = async () => {
        const totalItems = 980; // 총 데이터 수
        const pageSize = 50;    // 한 페이지당 데이터 수
        const totalPages = Math.ceil(totalItems / pageSize); // 총 페이지 수 계산

        let allMessages = [];

        for (let page = 1; page <= totalPages; page++) {
          const emergencyMessages = await fetchEmergencyInfo(page, pageSize);
          allMessages = [...allMessages, ...emergencyMessages]; // 모든 메시지 합치기
          console.log(`Fetched page ${page} of ${totalPages}`);
        }

        return allMessages;
      };

      // 데이터를 가져오고 화면에 표시하는 예시
      const getEmergencyMessages = async () => {
        const emergencyMessages = await fetchAllEmergencyMessages();
        console.log('Total Emergency Messages:', emergencyMessages);
        setEmergencyInfo(emergencyMessages); // 상태에 저장
      };

      getEmergencyMessages();
    }
  }, [infoType]);

  if (loading) return <p>Loading...</p>; // 로딩 상태 표시
  if (error) return <p>Error: {error}</p>; // 에러 메시지 표시

  // 각 버튼 클릭 시 infoType 상태 업데이트
  const handleButtonClick = (type) => {
    setInfoType(type);
    setClickedButton(type);
  };

  return (
    <div className="container">
      {hospitalDetail ? (
        <div className="card">
          <p className="title">
            <strong>{hospitalDetail.dutyname}</strong>
          </p>
          <p className="info">
            <strong>응급의료기관 분류:</strong> {hospitalDetail.dutyemclsname}
          </p>
          <p className="info">
            <strong>주소:</strong> {hospitalDetail.dutyaddr}
          </p>
          <p className="info">
            <strong>대표전화:</strong> {hospitalDetail.dutytel1}
          </p>
          <p className="info">
            <strong>응급실 전화:</strong> {hospitalDetail.dutytel3}
          </p>
        </div>
      ) : (
        <p>병원 정보를 불러올 수 없습니다.</p>
      )}

      <div className="button-container">
        <button
          className={`btn btn-primary ${clickedButton === 'beds' ? 'clicked' : ''}`}
          onClick={() => handleButtonClick('beds')}
        >
          실시간 병상정보
        </button>
        <button
          className={`btn btn-primary ${clickedButton === 'critical' ? 'clicked' : ''}`}
          onClick={() => handleButtonClick('critical')}
        >
          중증질환자 수용가능정보
        </button>
        <button
          className={`btn btn-primary ${clickedButton === 'emergency' ? 'clicked' : ''}`}
          onClick={() => handleButtonClick('emergency')}
        >
          응급 및 중증질환 진료불가 메시지
        </button>
      </div>

      {/* 버튼에 따라 각 정보 표시 */}
      {infoType === 'beds' && (
        <div className="info-content">
          <h4>실시간 병상정보</h4>
          <p>병상 정보가 여기에 표시됩니다.</p>
        </div>
      )}
      {infoType === 'critical' && (
        <div className="info-content">
          {hospitalDetail ? (
            <table
              border="1"
              style={{
                width: "600px",
                borderCollapse: "collapse",
                marginTop: "10px",
                border: "1px solid rgb(163, 163, 163)",
              }}
            >
              <thead>
                <tr>
                  <th style={{ padding: "8px", backgroundColor: "#f4f4f4" }}>항목</th>
                  <th style={{ padding: "8px", backgroundColor: "#f4f4f4" }}>가능여부</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "8px" }}>응급실</td>
                  <td style={{ padding: "8px" }}>{hospitalDetail.mkioskty28 || "N/A"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px" }}>뇌출혈수술</td>
                  <td style={{ padding: "8px" }}>{hospitalDetail.mkioskty1 || "N/A"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px" }}>뇌경색의재관류</td>
                  <td style={{ padding: "8px" }}>{hospitalDetail.mkioskty2 || "N/A"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px" }}>심근경색의재관류</td>
                  <td style={{ padding: "8px" }}>{hospitalDetail.mkioskty3 || "N/A"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px" }}>복부손상의수술</td>
                  <td style={{ padding: "8px" }}>{hospitalDetail.mkioskty4 || "N/A"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px" }}>사지접합의수술</td>
                  <td style={{ padding: "8px" }}>{hospitalDetail.mkioskty5 || "N/A"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px" }}>응급내시경</td>
                  <td style={{ padding: "8px" }}>{hospitalDetail.mkioskty6 || "N/A"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px" }}>응급투석</td>
                  <td style={{ padding: "8px" }}>{hospitalDetail.mkioskty7 || "N/A"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px" }}>조산산모</td>
                  <td style={{ padding: "8px" }}>{hospitalDetail.mkioskty8 || "N/A"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px" }}>정신질환자</td>
                  <td style={{ padding: "8px" }}>{hospitalDetail.mkioskty9 || "N/A"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px" }}>신생아</td>
                  <td style={{ padding: "8px" }}>{hospitalDetail.mkioskty10 || "N/A"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px" }}>중증화상</td>
                  <td style={{ padding: "8px" }}>{hospitalDetail.mkioskty11 || "N/A"}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p>No hospital details found.</p>
          )}
        </div>
      )}
      {infoType === 'emergency' && (
        <div className="info-content">
          <h4>응급 및 중증질환 진료불가 메시지</h4>
          {emergencyInfo && emergencyInfo.length > 0 ? (
            <table border="1" style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
              <thead>
                <tr>
                  <th style={{ padding: "8px", backgroundColor: "#f4f4f4" }}>응급/중증 구분</th>
                  <th style={{ padding: "8px", backgroundColor: "#f4f4f4" }}>항목</th>
                  <th style={{ padding: "8px", backgroundColor: "#f4f4f4" }}>불가 메시지</th>
                  <th style={{ padding: "8px", backgroundColor: "#f4f4f4" }}>날짜</th>
                </tr>
              </thead>
              <tbody>
                {emergencyInfo.map((info, index) => (
                  <tr key={index}>
                    <td style={{ padding: "8px" }}>{info.symBlkMsgTyp}</td>
                    <td style={{ padding: "8px" }}>{info.symTypCodMag}</td>
                    <td style={{ padding: "8px" }}>{info.symBlkMsg}</td>
                    <td style={{ padding: "8px" }}>{info.symBlkSttDtm} ~ {info.symBlkEndDtm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>응급 및 중증질환 진료불가 메시지가 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}
