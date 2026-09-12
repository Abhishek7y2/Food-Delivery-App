# 🍔 Online Food Delivery Application

A modern, production-ready, full-stack food delivery application built with **Spring Boot 3.4**, **MongoDB**, **React 19**, **Vite**, and **Docker**.

---

## 📁 Repository Directory Structure

```text
Food Delivery app/
├── backend/            # Spring Boot REST API Microservice (Java 21)
├── frontend-customer/  # React + Vite Customer Web Application
├── frontend-admin/     # React + Vite Admin Control Panel
├── db/                 # MongoDB Database Seeding & Utility Scripts
├── files/              # Asset Media Storage
├── docker-compose.yml  # Production Docker Compose Orchestration
├── DEPLOYMENT.md       # Detailed Cloud & Container Deployment Guide
└── README.md           # Project Documentation
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **JDK 21**
- **Node.js 20+**
- **MongoDB 7.0+**

### 2. Local Development Setup

#### Step 1: Start MongoDB
Ensure MongoDB is running locally on port `27017` (or launch via Docker):
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

#### Step 2: Seed Initial Data
```bash
cd db
node seed.js
```

#### Step 3: Run Backend API
```bash
cd backend
./mvnw spring-boot:run
```
*API running at [http://localhost:8080](http://localhost:8080)*

#### Step 4: Run Customer App
```bash
cd frontend-customer
npm run dev
```
*Customer App running at [http://localhost:5173](http://localhost:5173)*

#### Step 5: Run Admin Panel
```bash
cd frontend-admin
npm run dev
```
*Admin Dashboard running at [http://localhost:5174](http://localhost:5174)*

---

## 🐳 Docker Deployment

To launch the complete application stack with Docker Compose:
```bash
docker compose up -d --build
```

Refer to [DEPLOYMENT.md](./DEPLOYMENT.md) for advanced cloud configuration and production security recommendations.
