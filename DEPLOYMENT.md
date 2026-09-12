# 🚢 Food Delivery Application - Deployment Guide

This guide provides step-by-step instructions for deploying the **Food Delivery Application** (Spring Boot REST API + MongoDB + React Customer App + React Admin Panel) to production.

---

## 🏗️ Architecture Overview

| Component | Standard Directory | Stack | Production Port |
| :--- | :--- | :--- | :--- |
| **MongoDB** | Containerized | Database (v7.0) | `27017` |
| **Backend API** | `backend/` | Spring Boot 3.4.1 (Java 21) | `8080` |
| **Customer App** | `frontend-customer/` | React / Vite SPA | `5173` (or `80` in container) |
| **Admin Panel** | `frontend-admin/` | React / Vite SPA | `5174` (or `80` in container) |
| **Database Seed** | `db/` | Node.js MongoDB Driver | - |

---

## 🚀 Deployment Option 1: Docker Compose (Recommended)

### Prerequisites
- Docker Engine 20.10+
- Docker Compose v2.0+

### Steps
1. **Clone repository onto your server:**
   ```bash
   git clone <repository_url>
   cd "Food Delivery app"
   ```

2. **Configure Environment Variables (Optional):**
   Edit `docker-compose.yml` or set environment variables:
   - `MONGODB_URI`: Connection string to MongoDB database
   - `JWT_SECRET`: Secret key for signing JWT tokens
   - `CORS_ALLOWED_ORIGINS`: Allowed domain origins (e.g. `https://myfoodiesapp.com,https://admin.myfoodiesapp.com`)
   - `SMTP_USERNAME` & `SMTP_PASSWORD`: App password for sending OTP emails

3. **Build & launch containerized stack:**
   ```bash
   docker compose up -d --build
   ```

4. **Verify running containers:**
   ```bash
   docker compose ps
   ```

5. **Seed Database:**
   ```bash
   cd db
   node seed.js
   ```

---

## ☁️ Deployment Option 2: Cloud Services (Render / AWS / Vercel)

### 1. Backend Service (`backend/`)
- Deploy as a **Web Service** using the multi-stage Dockerfile inside `backend/`.
- Set Environment Variables:
  - `MONGODB_URI`: Connection string to MongoDB Atlas
  - `JWT_SECRET`: Random 256-bit key
  - `RAZORPAY_KEY` & `RAZORPAY_SECRET`: Live Razorpay API credentials
  - `SMTP_USERNAME` & `SMTP_PASSWORD`: Gmail App Password

### 2. Frontends (`frontend-customer/` & `frontend-admin/`)
- Deploy as **Static Sites / Web Services** (Vercel, Render, or Netlify).
- Set Environment Variable during build:
  - `VITE_API_BASE_URL`: Full URL of your deployed backend (e.g., `https://api.myfoodiesapp.com/api`)

---

## 🛠️ Local Production Build Verification Commands

### Build Spring Boot JAR
```powershell
$env:JAVA_HOME = "C:\Users\Mobiloitte\.jdks\jdk-21.0.6+7"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
cd backend
.\mvnw.cmd clean package -DskipTests
```

### Build Customer Frontend
```powershell
cd frontend-customer
npm run build
```

### Build Admin Frontend
```powershell
cd frontend-admin
npm run build
```
