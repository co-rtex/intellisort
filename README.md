# IntelliSort

<p align="center">
  <img src="docs/banners/intellisort-banner.png" width="100%" alt="IntelliSort Banner" />
</p>

---

<p align="center">

  <!-- Repo metadata -->
  <a href="https://github.com/co-rtex/intellisort/stargazers">
    <img src="https://img.shields.io/github/stars/co-rtex/intellisort?style=for-the-badge" />
  </a>
  <a href="https://github.com/co-rtex/intellisort/network/members">
    <img src="https://img.shields.io/github/forks/co-rtex/intellisort?style=for-the-badge" />
  </a>

  <!-- License -->
  <a href="https://github.com/co-rtex/intellisort/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/co-rtex/intellisort?style=for-the-badge" />
  </a>

  <!-- Languages -->
  <img src="https://img.shields.io/github/languages/top/co-rtex/intellisort?style=for-the-badge" />
  <img src="https://img.shields.io/github/languages/count/co-rtex/intellisort?style=for-the-badge" />

  <!-- Last commit -->
  <img src="https://img.shields.io/github/last-commit/co-rtex/intellisort?style=for-the-badge" />

  <!-- Platform -->
  <img src="https://img.shields.io/badge/platform-web-%23007ACC?style=for-the-badge" />

</p>

---

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
</p>


Interactive sorting algorithm visualizer + AI-powered runtime prediction.

IntelliSort lets you:
- Watch classic sorting algorithms run step-by-step.
- Compare runtime, comparisons, and swaps across algorithms and input distributions.
- Query an AI model that predicts time-complexity class and estimated runtime for a given input size.

---

## 🔧 Tech Stack

**Frontend**
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- MUI (Material UI)
- D3.js (for charts)

**Backend**
- FastAPI (Python)
- SQLite (SQLAlchemy ORM)
- scikit-learn (RandomForest classifier + regressor)
- Uvicorn

---

## 🏗 Project Structure

```text
intellisort/
├── backend/
│   ├── main.py              # FastAPI app + endpoints
│   ├── models.py            # SQLAlchemy models (AlgorithmRun)
│   ├── schemas.py           # Pydantic schemas
│   ├── database.py          # DB engine + session
│   ├── sorting/
│   │   └── algorithms.py    # Sorting algorithms + array generators
│   └── ml/
│       └── runtime_model.py # Synthetic data + ML model training & prediction
└── frontend/
    ├── app/
    │   ├── page.tsx         # Visualizer page
    │   └── predict/page.tsx # AI predictor page
    ├── components/          # React components (Navbar, controls, charts, etc.)
    ├── lib/api.ts           # API client for backend
    └── theme.ts             # MUI dark theme

'''

## 📸 Screenshots

### Algorithm Visualizer
![Visualizer](docs/screenshots/visualizer.png)

### AI Runtime Predictor
![Predictor](docs/screenshots/predictor.png)

### Data Explorer
![Data](docs/screenshots/data.png)
