# 🏥 병원 정보 시각화 웹 애플리케이션

## 📌 프로젝트 소개
이 프로젝트는 공공 데이터 포털에서 제공하는 병원 정보를 활용하여, 사용자에게 병원 상세 정보를 시각적으로 제공하는 웹 애플리케이션입니다. React를 기반으로 개발되었으며, 사용자 친화적인 UI를 통해 병원 정보를 쉽게 탐색할 수 있도록 설계되었습니다.

---

## 🛠 기술 스택

| 구분        | 기술 |
|-------------|------|
| **Frontend** | React, HTML, CSS, JavaScript |
| **Backend**  | SpringBoot |
| **데이터**   | 공공 데이터 포털 API |

---

## 💡 주요 기능

- 병원 목록 조회 및 상세 정보 확인
- 병원별 위치 정보 및 진료 과목 표시
- 사용자 인터페이스를 통한 직관적인 정보 탐색

---

## 👩‍💻 담당 역할

- React를 활용한 프론트엔드 개발
- 공공 데이터 API 연동 및 데이터 처리
- 사용자 경험을 고려한 UI/UX 설계

---

## ▶ 시스템 흐름 및 실행 방식

1. **사용자 요청 (React 웹 페이지)**  
   사용자가 병원을 검색하거나 시/도/구를 선택하면, 프론트엔드는 필요한 데이터를 요청합니다.

2. **프론트엔드 → 백엔드 요청 (주소 목록)**  
   병원 검색 조건에 필요한 지역 정보(예: 시/도/구)는 Spring Boot 백엔드에서 받아옵니다.

3. **프론트엔드 → 공공데이터포털 API 직접 호출**  
   사용자의 선택값을 기반으로, 프론트엔드는 병원 데이터를 공공데이터포털 API에서 직접 받아옵니다.

4. **프론트엔드에서 데이터 가공 및 시각화**  
   응답받은 병원 데이터를 필터링/정렬하여 리스트 및 상세 페이지에 출력합니다.

---

### 💻 시스템 구조 요약도

```plaintext
[사용자]
   ↓
[React 프론트엔드]
 ├── 주소 요청 → [Spring Boot 백엔드]
 └── 병원 데이터 요청 → [공공데이터포털 API]
          ↓
 병원 리스트 + 상세 정보 시각화
```

---
