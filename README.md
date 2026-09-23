# Ticket Sales - Fullstack Java (Spring Boot) + React Monorepo

A modern, high-performance **Ticket Sales** application architected in a single repository (monorepo), combining a **Java 21/25 Spring Boot 3.4 REST API** with a rich **React 18 + Vite** frontend.

---

## 📁 Repository Structure

```
ticket-sales/
├── backend/                       # Spring Boot 3.4.x REST API (Maven)
│   ├── pom.xml                    # Maven dependencies & build configuration
│   └── src/
│       ├── main/java/com/example/fullstack/
│       │   ├── FullstackApplication.java   # Spring Boot Application entrypoint
│       │   ├── config/CorsConfig.java      # Cross-Origin Resource Sharing settings
│       │   ├── controller/TicketController.java # REST API endpoints
│       │   ├── model/Ticket.java           # Ticket domain model
│       │   └── service/TicketService.java  # Business logic & thread-safe store
│       └── main/resources/
│           └── application.properties      # Server and logging settings
├── frontend/                      # React 18 + Vite Frontend
│   ├── package.json               # Node dependencies and scripts
│   ├── vite.config.js             # Vite configuration with backend proxy
│   ├── index.html                 # HTML shell with Inter typography
│   └── src/
│       ├── main.jsx               # React DOM entry point
│       ├── App.jsx                # Ticket Sales dashboard UI
│       ├── index.css              # Custom CSS design system (glassmorphism & dark mode)
│       └── components/
│           ├── StatsCard.jsx      # Metrics overview cards (Inventory, Sold, Revenue)
│           └── TicketModal.jsx    # Issue & edit ticket dialog modal
├── .gitignore                     # Unified Git ignore rules for Java, Maven & Node
└── README.md                      # Project documentation and guide
```

---

## 🛠️ Prerequisites

- **Java Development Kit (JDK)**: Java 21 or higher (JDK 25 LTS installed)
- **Apache Maven**: 3.9+ (`mvn -v`)
- **Node.js**: v18+ & **npm**: 10+

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
- API base path: **`http://localhost:8080/api/tickets`**
- Inventory stats: **`http://localhost:8080/api/tickets/stats`**

### 2. Running the Frontend (React + Vite)

Open a second terminal in the `frontend/` directory:

```bash
cd frontend
npm install
npm run dev
```

- Frontend dev server starts at: **`http://localhost:5173`**
- Includes automated reverse proxy to route `/api/*` to Spring Boot on port `8080`.

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and timestamp |
| `GET` | `/api/tickets` | Retrieve all tickets sorted by date |
| `GET` | `/api/tickets/stats` | Aggregated metrics (total inventory, available, reserved, sold, revenue) |
| `GET` | `/api/tickets/{id}` | Retrieve specific ticket by UUID |
| `POST` | `/api/tickets` | Issue/create a new ticket (eventName, ticketType, price, seatNumber, buyerName, status) |
| `PUT` | `/api/tickets/{id}` | Update ticket attributes / change status (AVAILABLE, RESERVED, SOLD) |
| `DELETE` | `/api/tickets/{id}` | Delete ticket listing by ID |

---

## 🚢 Pushing to a Remote Git Repository

This repository is initialized locally with Git. To push it to your GitHub/GitLab repository:

```bash
cd C:\Users\shiva\.gemini\antigravity-ide\scratch\ticket-sales

# 1. Add your remote repository URL (replace with your repository URL)
git remote add origin https://github.com/shivabeesam/ticket-sales.git

# 2. Push to main:
git push -u origin main
```
