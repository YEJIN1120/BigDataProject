import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function HospitalDetail() {
  const { hpid } = useParams(); // URL에서 병원 ID 가져오기
  const [hospitalDetail, setHospitalDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [xmlData, setXmlData] = useState(null);

  const YorN = { "Y": "가능", "N": "불가능" };

  // 버튼 클릭 시 보여줄 정보 상태
  const [infoType, setInfoType] = useState(null);

  // 클릭된 버튼을 추적하는 상태
  const [clickedButton, setClickedButton] = useState(null);

  const [criticalInfo, setCriticalInfo] = useState(null);
  // 응급 및 중증질환 진료불가 메시지 데이터 상태
  const [emergencyInfo, setEmergencyInfo] = useState(null);

  // 병원 목록 데이터 호출
  useEffect(() => {
    const fetchHospitalDetail = async () => {
      const url = `http://10.125.121.222:8080/api/list/${hpid}`; // API URL 설정
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setHospitalDetail(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHospitalDetail();
  }, [hpid]); // 병원 ID(hpid)를 의존성으로 설정

  // 병원 상세 정보 찾기
  useEffect(() => {
    if (hospitalDetail && hospitalDetail.length > 0 && hpid) {
      // 병원 ID가 일치하는 병원을 찾기
      const hospital = hospitalDetail.find((hospital) => hospital.hpid === hpid);
      setHospitalDetail(hospital || null);
    }
  }, [hospitalDetail, hpid]);

  // 실시간 병상정보 XML 데이터 가져오기
  useEffect(() => {
    const fetchXmlBedsData = async () => {
      const url = `https://apis.data.go.kr/B552657/ErmctInfoInqireService/getEmrrmRltmUsefulSckbdInfoInqire?serviceKey=%2FHnA2iw3sOxo5sImlcxW2vV8HWPZbXqir1y0wWiIKNYscpxNK8FMTaMHUsATsEZVpohX5G4sa3tYmAb7M2Ntsw%3D%3D&pageNo=1&numOfRows=414&hpid=${hpid}`
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.text();

        // XML 파싱
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "application/xml");

        const items = Array.from(xmlDoc.getElementsByTagName("item")).map((item) => ({
          hpid: item.getElementsByTagName("hpid")[0]?.textContent,
          hvidate: item.getElementsByTagName("hvidate")[0]?.textContent,
          dutyTel3: item.getElementsByTagName("dutyTel3")[0]?.textContent,
          hvec: item.getElementsByTagName("hvec")[0]?.textContent,
          hvoc: item.getElementsByTagName("hvoc")[0]?.textContent,
          hvcc: item.getElementsByTagName("hvcc")[0]?.textContent,
          hvncc: item.getElementsByTagName("hvncc")[0]?.textContent,
          hvccc: item.getElementsByTagName("hvccc")[0]?.textContent,
          hvicc: item.getElementsByTagName("hvicc")[0]?.textContent,
          hvgc: item.getElementsByTagName("hvgc")[0]?.textContent,
          hv2: item.getElementsByTagName("hv2")[0]?.textContent,
          hv3: item.getElementsByTagName("hv3")[0]?.textContent,
          hv4: item.getElementsByTagName("hv4")[0]?.textContent,
          hv5: item.getElementsByTagName("hv5")[0]?.textContent,
          hv6: item.getElementsByTagName("hv6")[0]?.textContent,
          hv7: item.getElementsByTagName("hv7")[0]?.textContent,
          hv8: item.getElementsByTagName("hv8")[0]?.textContent,
          hv9: item.getElementsByTagName("hv9")[0]?.textContent,
          hv28: item.getElementsByTagName("hv28")[0]?.textContent,
          hv42: item.getElementsByTagName("hv42")[0]?.textContent,
          hvincuayn: item.getElementsByTagName("hvincuayn")[0]?.textContent,
          hvctayn: item.getElementsByTagName("hvctayn")[0]?.textContent,
          hvmriayn: item.getElementsByTagName("hvmriayn")[0]?.textContent,
          hvangioayn: item.getElementsByTagName("hvangioayn")[0]?.textContent,
          hvventiayn: item.getElementsByTagName("hvventiayn")[0]?.textContent,
          hvamyn: item.getElementsByTagName("hvamyn")[0]?.textContent,
          hvdnm: item.getElementsByTagName("hvdnm")[0]?.textContent,
          hv1: item.getElementsByTagName("hv1")[0]?.textContent,
          hv12: item.getElementsByTagName("hv12")[0]?.textContent,
        }));

        // hpid가 일치하는 데이터만 필터링
        const filteredItems = items.filter(item => item.hpid === hpid);
        setXmlData(filteredItems);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchXmlBedsData();
  }, [hpid]);

  // 중증질환자 수용가능정보 가져오기
  useEffect(() => {
    if (infoType === "critical" && !criticalInfo) {
      const fetchHospitalDetail = async () => {
        const url = `http://10.125.121.222:8080/api/list/${hpid}`;
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setCriticalInfo(data[0]);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchHospitalDetail();
    }
  }, [infoType, hpid, criticalInfo]);

  // 응급 및 중증질환 진료불가 메시지 XML 데이터 가져오기
  useEffect(() => {
    const fetchEmergencyMessages = async () => {
      const url = `https://apis.data.go.kr/B552657/ErmctInfoInqireService/getEmrrmSrsillDissMsgInqire?serviceKey=%2FHnA2iw3sOxo5sImlcxW2vV8HWPZbXqir1y0wWiIKNYscpxNK8FMTaMHUsATsEZVpohX5G4sa3tYmAb7M2Ntsw%3D%3D&pageNo=1&numOfRows=948&hpid=${hpid}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.text();
        console.log(data);

        // XML 파싱
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "application/xml");

        const message = Array.from(xmlDoc.getElementsByTagName("item")).map((item) => ({
          hpid: item.getElementsByTagName("hpid")[0]?.textContent,
          symBlkMsgTyp: item.getElementsByTagName("symBlkMsgTyp")[0]?.textContent,
          symTypCod: item.getElementsByTagName("symTypCodMag")[0]?.textContent,
          symBlkMsg: item.getElementsByTagName("symBlkMsg")[0]?.textContent,
          symBlkSttDtm: item.getElementsByTagName("symBlkSttDtm")[0]?.textContent,
          symBlkEndDtm: item.getElementsByTagName("symBlkEndDtm")[0]?.textContent,
        }
        ));

        console.log("Parsed Messages:", message);

        // hpid가 일치하는 데이터만 필터링
        const filteredMessages = message.filter(item => item.hpid === hpid);

        console.log("Filtered Messages:", filteredMessages);
        setEmergencyInfo(filteredMessages);

      } catch (err) {
        setError(err.message);
      }
    };
    fetchEmergencyMessages();
  }, [hpid]);

  // 각 버튼 클릭 시 infoType 상태 업데이트
  const handleButtonClick = (type) => {
    setInfoType(type);
    setClickedButton(type);
  };

  if (loading) return <p>Loading...</p>; // 로딩 상태 표시
  if (error) return <p>Error: {error}</p>; // 에러 메시지 표시

  return (
    <div className="container">
      {hospitalDetail && (
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
      )}

      <div
        className="button-container"
        style={{ display: "flex", justifyContent: "space-between", width: "800px", margin: "0 auto", marginTop: "10px" }}
      >
        <button
          className={`btn btn-primary ${clickedButton === 'beds' ? 'clicked' : ''}`}
          style={{ flex: "1", margin: "0px" }}
          onClick={() => handleButtonClick('beds')}
        >
          실시간 병상정보
        </button>
        <button
          className={`btn btn-primary ${clickedButton === 'critical' ? 'clicked' : ''}`}
          style={{ flex: "1", margin: "0px" }}
          onClick={() => handleButtonClick('critical')}
        >
          중증질환자 수용가능정보
        </button>
        <button
          className={`btn btn-primary ${clickedButton === 'emergency' ? 'clicked' : ''}`}
          style={{ flex: "1", margin: "0px" }}
          onClick={() => handleButtonClick('emergency')}
        >
          응급 및 중증질환 진료불가 메시지
        </button>
      </div>

      {/* 버튼에 따라 각 정보 표시 */}
      {infoType === 'beds' && xmlData && (
        <div className="info-content">
          <table
            border="1"
            style={{
              width: "800px",
              borderCollapse: "collapse",
              marginTop: "10px",
              border: "1px solid rgb(163, 163, 163)",
              fontSize: "15px"
            }}
          >
            <thead>
              <tr>
                <th style={{ padding: "8px", backgroundColor: "#f4f4f4" }}>항목</th>
                <th style={{ padding: "8px", backgroundColor: "#f4f4f4" }}>상태</th>
              </tr>
            </thead>
            <tbody>
              {xmlData.map((item, index) => {
                const parseDate = (dateString) => {
                  const year = dateString.substring(0, 4);
                  const month = dateString.substring(4, 6);
                  const day = dateString.substring(6, 8);
                  const hour = dateString.substring(8, 10);
                  const minute = dateString.substring(10, 12);
                  return new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
                };

                const formatDate = (date) => {
                  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                };

                const formattedDate = formatDate(parseDate(item.hvidate));

                return (
                  <React.Fragment key={index}>
                    <tr>
                      <td style={{ padding: "8px" }}>데이터 기준시간</td>
                      <td style={{ padding: "8px" }}>{formattedDate}</td>
                    </tr>
                    {[
                      { label: '응급실전화', value: item.dutyTel3 || '정보없음' },
                      { label: '응급실', value: item.hvec || '0' },
                      { label: '수술실', value: item.hvoc || '0' },
                      { label: '신경 중환자실', value: item.hvcc || '0' },
                      { label: '신생아 중환자실', value: item.hvncc || '0' },
                      { label: '흉부 중환자실', value: item.hvccc || '0' },
                      { label: '일반 중환자실', value: item.hvicc || '0' },
                      { label: '입원실', value: item.hvgc || '0' },
                      { label: '내과 중환자실', value: item.hv2 || '0' },
                      { label: '외과 중환자실', value: item.hv3 || '0' },
                      { label: '외과입원실(정형외과)', value: item.hv4 || '0' },
                      { label: '신경과 입원실', value: item.hv5 || '0' },
                      { label: '신경외과 중환자실', value: item.hv6 || '0' },
                      { label: '약물 중환자', value: item.hv7 || '0' },
                      { label: '화상 중환자', value: item.hv8 || '0' },
                      { label: '외상 중환자', value: item.hv9 || '0' },
                      { label: '소아', value: item.hv28 || '0' },
                      { label: '분만실', value: item.hv42 || '0' },
                      { label: '인큐베이터', value: item.hvincuayn ? YorN[item.hvincuayn.substring(0, 1)] : '0' },
                      { label: 'CT', value: item.hvctayn ? YorN[item.hvctayn.substring(0, 1)] : '0' },
                      { label: 'MRI', value: item.hvmriayn ? YorN[item.hvmriayn.substring(0, 1)] : '0' },
                      { label: '혈관촬영기', value: item.hvangioayn ? YorN[item.hvangioayn.substring(0, 1)] : '0' },
                      { label: '인공 호흡기', value: item.hvventiayn ? YorN[item.hvventiayn.substring(0, 1)] : '0' },
                      { label: '구급차 가용', value: item.hvamyn ? YorN[item.hvamyn.substring(0, 1)] : '0' },
                      { label: '당직의', value: item.hvdnm || '정보없음' },
                      { label: '당직의 연락처', value: item.hv1 || '정보없음' },
                      { label: '소아당직의 연락처', value: item.hv12 || '정보없음' },
                    ].map((row, i) => (
                      <tr key={i}>
                        <td style={{ padding: "8px" }}>{row.label}</td>
                        <td style={{ padding: "8px" }}>{row.value}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {infoType === 'critical' && hospitalDetail && (
        <div className="info-content">
          <table
            border="1"
            style={{
              width: "800px",
              borderCollapse: "collapse",
              marginTop: "10px",
              border: "1px solid rgb(163, 163, 163)",
              fontSize: "15px"
            }}
          >
            <thead>
              <tr>
                <th style={{ padding: "8px", backgroundColor: "#f4f4f4" }}>항목</th>
                <th style={{ padding: "8px", backgroundColor: "#f4f4f4" }}>가능여부</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: '뇌출혈수술', value: hospitalDetail.mkioskty1 },
                { label: '뇌경색의재관류', value: hospitalDetail.mkioskty2 },
                { label: '심근경색의재관류', value: hospitalDetail.mkioskty3 },
                { label: '복부손상의수술', value: hospitalDetail.mkioskty4 },
                { label: '사지접합의수술', value: hospitalDetail.mkioskty5 },
                { label: '응급내시경', value: hospitalDetail.mkioskty6 },
                { label: '응급투석', value: hospitalDetail.mkioskty7 },
                { label: '조산산모', value: hospitalDetail.mkioskty8 },
                { label: '정신질환자', value: hospitalDetail.mkioskty9 },
                { label: '신생아', value: hospitalDetail.mkioskty10 },
                { label: '중증화상', value: hospitalDetail.mkioskty11 },
              ].map((row, i) => (
                <tr key={i}>
                  <td style={{ padding: "8px" }}>{row.label}</td>
                  <td style={{ padding: "8px" }}>{row.value ? YorN[row.value.substring(0, 1)] : '0'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {infoType === 'emergency' && emergencyInfo && (
        <div className="info-content">
          <table
            border="1"
            style={{
              width: "800px",
              borderCollapse: "collapse",
              marginTop: "10px",
              border: "1px solid rgb(163, 163, 163)",
              fontSize: "14px"
            }}
          >
            <thead>
              <tr>
                <th style={{ padding: "8px", backgroundColor: "#f4f4f4" }}>구분</th>
                <th style={{ padding: "8px", backgroundColor: "#f4f4f4" }}>항목</th>
                <th style={{ padding: "8px", backgroundColor: "#f4f4f4" }}>불가 메시지</th>
                <th style={{ padding: "8px", backgroundColor: "#f4f4f4" }}>날짜</th>
              </tr>
            </thead>
            <tbody>
              {emergencyInfo.map((info, index) => {
                // symBlkSttDtm와 symBlkEndDtm 날짜 문자열을 수동으로 파싱
                const parseDate = (dateString) => {
                  const year = dateString.substring(0, 4);
                  const month = dateString.substring(4, 6);
                  const day = dateString.substring(6, 8);
                  const hour = dateString.substring(8, 10);
                  const minute = dateString.substring(10, 12);
                  return new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
                };

                // YYYY-MM-DD HH:MM 형태로 변환
                const formatDate = (date) => {
                  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                };

                // symBlkSttDtm와 symBlkEndDtm 날짜 문자열을 Date 객체로 변환
                const startDate = parseDate(info.symBlkSttDtm);
                const endDate = parseDate(info.symBlkEndDtm);

                const formattedStartDate = formatDate(startDate);
                const formattedEndDate = formatDate(endDate);

                return (
                  <tr key={index}>
                    <td style={{ padding: "8px" }}>{info.symBlkMsgTyp}</td>
                    <td style={{ padding: "8px" }}>{info.symTypCod}</td>
                    <td style={{ padding: "8px" }}>{info.symBlkMsg}</td>
                    <td style={{ padding: "8px" }}>{formattedStartDate} ~ {formattedEndDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}