# Fullstack Java (Spring Boot) + React Monorepo

A modern, production-ready full-stack application architected in a single repository (monorepo), combining a **Java 21/25 Spring Boot 3.4 REST API** with a high-performance **React 18 + Vite** frontend.

---

## 📁 Repository Structure

```
fullstack-java-app/
├── backend/                       # Spring Boot 3.4.x REST API (Maven)
│   ├── pom.xml                    # Maven dependencies & build configuration
│   └── src/
│       ├── main/java/com/example/fullstack/
│       │   ├── FullstackApplication.java   # Spring Boot Application entrypoint
│       │   ├── config/CorsConfig.java      # Cross-Origin Resource Sharing settings
│       │   ├── controller/TaskController.java # REST API endpoints
│       │   ├── model/Task.java             # Task domain model
│       │   └── service/TaskService.java    # Business logic & thread-safe store
│       └── main/resources/
│           └── application.properties      # Server and logging settings
├── frontend/                      # React 18 + Vite Frontend
│   ├── package.json               # Node dependencies and scripts
│   ├── vite.config.js             # Vite configuration with backend proxy
│   ├── index.html                 # HTML shell with Inter typography
│   └── src/
│       ├── main.jsx               # React DOM entry point
│       ├── App.jsx                # Main full-stack dashboard
│       ├── index.css              # Custom CSS design system (glassmorphism & dark mode)
│       └── components/
│           ├── StatsCard.jsx      # Metrics overview cards
│           └── TaskModal.jsx      # Creation & editing dialog modal
├── .gitignore                     # Unified Git ignore rules for Java, Maven & Node
└── README.md                      # Project documentation and guide
```

---

## 🛠️ Prerequisites

- **Java Development Kit (JDK)**: Java 21 or higher (JDK 25 LTS installed)
- **Apache Maven**: 3.9+ (`mvn -v`)
- **Node.js**: v18+ (v24 LTS installed) & **npm**: 10+

---

## 🚀 Getting Started

### 1. Running the Backend (Spring Boot)

Open a terminal in the `backend/` directory:

```bash
cd backend
mvn spring-boot:run
```

- Backend server starts at: **`http://localhost:8080`**
- Health check endpoint: **`http://localhost:8080/api/health`**
- API base path: **`http://localhost:8080/api/tasks`**

### 2. Running the Frontend (React + Vite)

Open a second terminal in the `frontend/` directory:

```bash
cd frontend
npm install
npm run dev
```

- Frontend dev server starts at: **`http://localhost:5173`**
- The frontend includes an automatic proxy to route `/api/*` requests to the Spring Boot backend on port `8080`.

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and timestamp |
| `GET` | `/api/tasks` | Retrieve all tasks sorted by creation date |
| `GET` | `/api/tasks/stats` | Aggregated metrics (total, completed, in-progress, pending) |
| `GET` | `/api/tasks/{id}` | Retrieve specific task by UUID |
| `POST` | `/api/tasks` | Create a new task (body: `title`, `description`, `priority`, `status`) |
| `PUT` | `/api/tasks/{id}` | Update existing task attributes |
| `DELETE` | `/api/tasks/{id}` | Delete task by ID |

---

## 🚢 Pushing to a Remote Git Repository

This repository is initialized locally with Git. To push it to your GitHub/GitLab repository:

1. Create a new empty repository on [GitHub](https://github.com/new) (e.g. `fullstack-java-app`).
2. Run the following commands in the project root (`fullstack-java-app`):

```bash
# Add your remote repository URL (replace with your repository URL)
git remote add origin https://github.com/shivabeesam/fullstack-java-app.git

# Rename branch to main if not already
git branch -M main

# Push the codebase to remote
git push -u origin main
```
