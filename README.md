# Library Management System

A modern, full-stack library management web application built with React, FastAPI, and PostgreSQL.

**Live Demo**: https://library-bivg7dpsz-alejandritodeoliveiras-projects.vercel.app/

## Features

- **Book Discovery**: Search and browse books from Google Books API
- **Advanced Search**: Filter by category, author, and sort options
- **Loan Management**: Borrow books and track due dates
- **Wish List**: Save books for later and get notifications
- **User Authentication**: Firebase authentication with Google sign-in
- **Responsive Design**: Works on all devices
- **RESTful API**: FastAPI backend with PostgreSQL database

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Firebase Project (for authentication)
- Google Books API Key

### Setup

1. **Clone and configure**:
   ```bash
   git clone <repository-url>
   cd Library
   cp .env.example .env
   cp frontend/env.example frontend/.env
   cp backend/env.example backend/.env
   ```

2. **Firebase Setup**:
   - Create Firebase project and enable Authentication
   - Download service account key as `backend/firebase-credentials.json`
   - Update Firebase config in environment files

3. **Start the application**:
   ```bash
   docker-compose up --build
   ```

   Access at:
   - Frontend: http://localhost
   - Backend API: http://localhost:8000/docs

## Deployment

The application is deployed on two platforms:

### Frontend (Vercel)
The React frontend is deployed on Vercel at: https://library-bivg7dpsz-alejandritodeoliveiras-projects.vercel.app/

**Deployment Configuration**:
- Automatic deployments from main branch
- Environment variables configured in Vercel dashboard
- Firebase configuration for production

![Frontend Deployment](Documentation/Deployment/Screenshot%202025-10-19%20211206.png)
*Frontend deployment configuration on Vercel showing environment variables and build settings*

### Backend (Render)
The FastAPI backend is deployed on Render at: https://library-9mrb.onrender.com

**Deployment Configuration**:
- Docker-based deployment
- PostgreSQL database provided by Render
- Environment variables for Firebase credentials and database connection

![Backend Deployment](Documentation/Deployment/Screenshot%202025-10-19%20211227.png)
*Backend deployment configuration on Render showing service settings and environment variables*

![Deployment Logs](Documentation/Deployment/Screenshot%202025-10-19%20211242.png)
*Deployment logs showing successful build and startup process*

## API Endpoints

### Public Endpoints
- `GET /` - API info
- `GET /health` - Health check
- `GET /docs` - Interactive API documentation
- `GET /api/books/search` - Search books

### Protected Endpoints (Authentication Required)
- `GET /api/users/me` - Get current user info
- `GET /api/loans` - Get user's loans
- `POST /api/loans` - Borrow a book
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add to wishlist

## Development

For local development, see the detailed setup in the Quick Start section above.