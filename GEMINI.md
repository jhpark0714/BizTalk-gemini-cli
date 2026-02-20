# GEMINI.md - BizTone Converter (업무 말투 변환기)

이 파일은 **BizTone Converter** 프로젝트의 구조, 실행 방법 및 개발 컨벤션을 안내하는 가이드입니다. Gemini CLI와의 협업 시 이 문서를 컨텍스트로 활용하십시오.

---

## 1. 프로젝트 개요 (Project Overview)

**BizTone Converter**는 사용자의 일상적인 표현을 상황(상사, 동료, 고객)에 맞는 전문적인 비즈니스 말투로 자동 변환해 주는 AI 기반 웹 솔루션입니다.

- **목적**: 신입사원 및 주니어 직원의 비즈니스 커뮤니케이션 역량 강화 및 업무 생산성 향상.
- **핵심 기능**: 
  - 대상별(상사, 타팀 동료, 고객) 맞춤형 말투 변환.
  - 원문과 변환 결과의 실시간 비교 및 복사 기능.
  - 반응형 UI를 통한 다양한 디바이스 지원.

### 주요 기술 스택 (Tech Stack)
- **Backend**: Python 3.11, Flask (REST API)
- **Frontend**: HTML5, Vanilla JavaScript, Tailwind CSS v4
- **AI**: Groq API (Model: `moonshotai/kimi-k2-instruct-0905`)
- **Deployment**: Vercel (정적 호스팅 및 서버리스 함수)

---

## 2. 프로젝트 구조 (Directory Structure)

```text
D:\vibecoding\
├── backend\                # Flask 백엔드 서버 소스 코드
│   ├── app.py              # 메인 API 서버 및 Groq 연동 로직
│   └── requirements.txt    # Python 의존성 목록
├── frontend\               # 정적 웹 프론트엔드 리소스
│   ├── index.html          # 메인 UI 구조
│   ├── css\                # 스타일시트 (Tailwind CSS 포함)
│   └── js\                 # 클라이언트 사이드 로직 (script.js)
├── PRD.md                  # 제품 요구사항 문서 (상세 기획)
├── 프로그램개요서.md       # 프로젝트 초기 기획 및 아키텍처 문서
├── my_rules.md             # Gemini CLI를 위한 사용자 맞춤 지침
└── package.json            # 프론트엔드 도구(Tailwind 등) 설정
```

---

## 3. 설치 및 실행 방법 (Building and Running)

### 3.1. 백엔드 설정 (Backend Setup)

1. **가상 환경 생성 및 활성화**:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # macOS/Linux:
   source .venv/bin/activate
   ```

2. **의존성 설치**:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **환경 변수 설정**:
   루트 디렉토리에 `.env` 파일을 생성하고 Groq API 키를 추가합니다.
   ```env
   GROQ_API_KEY=your_api_key_here
   ```

4. **서버 실행**:
   ```bash
   python backend/app.py
   ```
   *서버는 기본적으로 `http://localhost:5000`에서 실행됩니다.*

### 3.2. 프론트엔드 설정 (Frontend Setup)

1. **Tailwind CSS 빌드** (필요한 경우):
   ```bash
   npm install
   # Tailwind CLI를 사용하여 CSS 빌드 (명령어는 환경에 따라 다를 수 있음)
   npx tailwindcss -i ./frontend/css/tailwind.css -o ./frontend/css/style.css --watch
   ```

---

## 4. 개발 컨벤션 (Development Conventions)

- **언어 및 소통**: 모든 문서, 주석, AI 응답은 **한국어**를 원칙으로 합니다. (IT 전문 용어 병기 가능)
- **API 설계**:
  - 엔드포인트: `/api/convert` (POST)
  - 요청 형식: `{"text": "원본", "target": "상사"}`
  - 응답 형식: `{"original_text": "...", "converted_text": "..."}`
- **코드 스타일**:
  - **Python**: PEP 8 표준을 준수하며, 명확한 함수 독스트링을 작성합니다.
  - **JavaScript**: ES6+ 문법을 사용하며, 비동기 처리는 `async/await`를 권장합니다.
  - **CSS**: Tailwind CSS를 활용하여 유틸리티 퍼스트 방식으로 스타일링합니다.
- **보안**: API 키와 같은 민감 정보는 절대로 코드에 하드코딩하지 않으며 `.env` 파일을 통해 관리합니다.
- **협업**: `PRD.md` 및 `프로그램개요서.md`에 정의된 요구사항을 최우선으로 준수합니다.

---

## 5. 주요 파일 가이드 (Key Files)

- `backend/app.py`: Flask 서버의 진입점입니다. Groq 클라이언트 초기화 및 `/api/convert` 라우트의 프롬프트 엔지니어링 로직이 포함되어 있습니다.
- `frontend/js/script.js`: DOM 조작, 글자 수 체크, 백엔드 API와의 비동기 통신 및 결과 화면 렌더링을 담당합니다.
- `PRD.md`: 기능 및 비기능 요구사항, UI 디자인 원칙, 릴리즈 계획이 상세히 기술되어 있습니다.
