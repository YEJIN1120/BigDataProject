import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function HospitalDetail() {
  const { hpid } = useParams(); // URL에서 병원 ID 가져오기
  console.log("Hospital HPID:", hpid);
  const [hospitalList, setHospitalList] = useState([]);
  const [hospitalDetail, setHospitalDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // XML 응답 파싱 함수
  const parseXML = (xmlString) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");
    const parseError = xmlDoc.querySelector("parsererror");

    if (parseError) {
      throw new Error("Error parsing XML");
    }

    // XML 데이터에서 모든 item 요소를 선택하여 배열로 반환
    const items = xmlDoc.querySelectorAll("item");
    const parsedData = Array.from(items).map((item) => {
      const hpid = item.querySelector("hpid")?.textContent || "N/A";
      const dutyname = item.querySelector("dutyName")?.textContent || "N/A";
      const dutyemclsname = item.querySelector("dutyEmclsName")?.textContent || "N/A";
      const dutyaddr = item.querySelector("dutyAddr")?.textContent || "N/A";
      const dutytel1 = item.querySelector("dutyTel1")?.textContent || "N/A";
      const dutytel3 = item.querySelector("dutyTel3")?.textContent || "N/A";

      return { hpid, dutyname, dutyemclsname, dutyaddr, dutytel1, dutytel3 };
    });

    return parsedData;
  };

  // 병원 상세 정보 API 호출
  useEffect(() => {
    const fetchHospitalList = async () => {
      const apiKey = "%2FHnA2iw3sOxo5sImlcxW2vV8HWPZbXqir1y0wWiIKNYscpxNK8FMTaMHUsATsEZVpohX5G4sa3tYmAb7M2Ntsw%3D%3D";
      const serviceUrl = `https://apis.data.go.kr/B552657/ErmctInfoInqireService/getEgytListInfoInqire`;
      const url = `${serviceUrl}?serviceKey=${apiKey}`;

      try {
        console.log("Fetching URL:", url);
        const response = await fetch(url);
        console.log("HTTP Response Status: ", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const xmlData = await response.text();
        console.log("XML Data Received: ", xmlData);

        const data = parseXML(xmlData);
        console.log("Parsed Data: ", data);

        setHospitalList(data);
      } catch (err) {
        console.error("Error fetching hospital detail: ", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalList();
  }, []); // 병원 목록 데이터 호출 (빈 배열로 의존성 설정)

  // 병원 상세 정보 찾기
  useEffect(() => {
    if (hpid && hospitalList.length > 0) {  // length로 수정
      const hospital = hospitalList.find(hospital => hospital.hpid === hpid);
      setHospitalDetail(hospital);
    }
  }, [hpid, hospitalList]);  // 종속성 배열에 hpid, hospitalList 추가

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      {hospitalDetail ? (  // hospitalDetail이 객체이면 해당 정보 출력
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
            <strong>{hospitalDetail.dutyname}</strong>
          </p>
          <p style={{ color: '#888', fontSize: '14px' }}>
            <strong>응급의료기관 분류:</strong> {hospitalDetail.dutyemclsname}
          </p>
          <p style={{ color: '#888', fontSize: '14px' }}>
            <strong>주소:</strong> {hospitalDetail.dutyaddr}
          </p>
          <p style={{ color: '#888', fontSize: '14px' }}>
            <strong>대표전화:</strong> {hospitalDetail.dutytel1}
          </p>
          <p style={{ color: '#888', fontSize: '14px' }}>
            <strong>응급실 전화:</strong> {hospitalDetail.dutytel3}
          </p>
        </div>
      ) : (
        <p>병원 정보를 불러올 수 없습니다.</p>
      )}
    </div>
  );
}
