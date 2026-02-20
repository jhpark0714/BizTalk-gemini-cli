# GEMINI.md - Backend Specialist Guide

이 파일은 **BizTone Converter**의 백엔드 아키텍처, API 명세 및 AI 연동 로직을 다루는 개발 지침서입니다. 백엔드 코드 수정 및 기능 확장 시 이 문서를 참조하십시오.

---

## 1. 백엔드 개요 (Backend Overview)

백엔드는 Flask 프레임워크를 기반으로 하며, 클라이언트의 요청을 받아 **Groq AI API**를 통해 적절한 비즈니스 말투로 변환하여 반환하는 API 게이트웨이 역할을 수행합니다.

- **주요 목적**: 자연어 변환 로직 처리 및 프롬프트 관리.
- **핵심 기술**: Python 3.11, Flask, Groq SDK, python-dotenv.
- **AI 모델**: `moonshotai/kimi-k2-instruct-0905` (Groq 인프라 활용).

---

## 2. API 명세 (API Specification)

### 2.1. 말투 변환 (POST `/api/convert`)
사용자 입력 텍스트를 선택한 대상에 맞는 말투로 변환합니다.

- **Request Body**:
  ```json
  {
    "text": "변환할 원문 텍스트 (최대 500자)",
    "target": "상사" | "타팀 동료" | "고객"
  }
  ```
- **Response (Success 200)**:
  ```json
  {
    "original_text": "...",
    "converted_text": "변환된 텍스트"
  }
  ```
- **Response (Error 400/500/503)**:
  ```json
  { "error": "에러 메시지 내용" }
  ```

### 2.2. 헬스 체크 (GET `/health`)
서버 상태를 확인합니다.
- **Response**: `{"status": "ok"}`

---

## 3. 프롬프트 엔지니어링 (Prompt Engineering)

`app.py` 내부에서 `target` 값에 따라 시스템 프롬프트가 동적으로 할당됩니다.

| Target (KR) | Target Key | 시스템 프롬프트 전략 |
| :--- | :--- | :--- |
| **상사** | `Upward` | 정중한 격식체, 결론 중심 보고, 신뢰성 강조 |
| **타팀 동료** | `Lateral` | 상호 존중 어투, 명확한 요청 사항 및 배경 설명 |
| **고객** | `External` | 극존칭 사용, 전문성 및 서비스 마인드 강조 |

---

## 4. 환경 설정 및 실행 (Setup & Execution)

### 의존성 설치
```bash
cd backend
pip install -r requirements.txt
```

### 환경 변수 (.env)
백엔드 루트 또는 프로젝트 루트에 반드시 존재해야 합니다.
```env
GROQ_API_KEY=your_groq_api_key
```

### 서버 실행
```bash
python app.py
```
- 기본 포트: `5000`
- 디버그 모드: 활성화 (`app.run(debug=True)`)

---

## 5. 백엔드 개발 컨벤션 (Coding Standards)

1. **에러 핸들링**: 
   - API 호출 실패나 잘못된 입력에 대해 명확한 HTTP 상태 코드와 JSON 에러 메시지를 반환합니다.
   - Groq 클라이언트 초기화 실패 시 500 에러를 반환하도록 설계되어 있습니다.
2. **대상 매핑**: 
   - 프론트엔드의 한글 키 값을 내부적으로 영문 키(`target_mapping`)로 변환하여 관리합니다.
3. **보안**: 
   - `GROQ_API_KEY`는 반드시 환경 변수로만 관리하며, 코드에 노출하지 않습니다.
4. **확장성**: 
   - 새로운 말투 대상을 추가할 경우 `target_mapping`과 `prompts` 딕셔너리에 새 키-값을 추가하는 것으로 대응 가능합니다.

---

## 6. 주요 모듈 설명

- `app.py`: 모든 라우팅과 AI 연동 로직이 집약된 메인 모듈입니다.
- `groq`: Groq AI와의 비동기/동기 통신을 담당하는 공식 SDK입니다.
- `flask_cors`: 프론트엔드와의 교차 출처 자원 공유를 처리합니다.
