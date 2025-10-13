# Library Management System

A modern, full-stack library management web application built with React, FastAPI, and PostgreSQL.

## Features

### Frontend (React + TypeScript + Material-UI)
- **Book Discovery**: Search and browse books from Google Books API
- **Advanced Search**: Filter by category, author, and sort by relevance/date
- **Book Details**: View comprehensive information about each book
- **Loan Management**: Borrow books and track due dates
- **Wish List**: Save books for later and get notifications
- **User Authentication**: Firebase authentication with Google sign-in
- **Responsive Design**: Mobile-first, works on all devices
- **Modern UI**: Clean, minimalist design with Material-UI components

### Backend (FastAPI + Python)
- **Google Books Integration**: Real-time book data from Google Books API
- **Firebase Authentication**: Secure token-based authentication
- **RESTful API**: Well-structured endpoints for all operations
- **Database Ready**: PostgreSQL integration with SQLAlchemy ORM
- **CORS Enabled**: Ready for cross-origin requests
- **Placeholder Endpoints**: Loans, wishlist, and reading status (ready for implementation)

### Infrastructure
- **Docker Compose**: Complete containerized setup
- **PostgreSQL Database**: Persistent data storage
- **Environment Variables**: Secure configuration management
- **Development & Production**: Separate configurations

## Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)
- Firebase Project (for authentication)
- Google Books API Key (optional but recommended)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Library
```

### 2. Configure Environment Variables

Copy the example environment files and fill in your credentials:

```bash
# Root .env file
cp .env.example .env

# Frontend .env
cp frontend/env.example frontend/.env

# Backend .env
cp backend/env.example backend/.env
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable Authentication → Email/Password and Google providers
4. Get your Firebase config from Project Settings
5. Download the service account key (Settings → Service Accounts)
6. Save it as `backend/firebase-credentials.json`
7. Update Firebase config in `frontend/.env` and `.env`

### 4. Google Books API Key (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google Books API
3. Create credentials (API Key)
4. Add the key to `backend/.env`:
   ```
   GOOGLE_BOOKS_API_KEY=your_api_key_here
   ```

### 5. Start the Application

#### Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d
```

The application will be available at:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Database**: localhost:5432

#### For Development with Hot Reload

```bash
# Use the development Docker Compose config
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### 6. Stop the Application

```bash
docker-compose down

# To remove volumes (database data)
docker-compose down -v
```

## Project Structure

```
Library/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts (Auth)
│   │   ├── services/        # API service layer
│   │   ├── theme/           # Material-UI theme
│   │   ├── types/           # TypeScript types
│   │   ├── config/          # Configuration files
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── Dockerfile           # Production build
│   ├── Dockerfile.dev       # Development build
│   └── package.json
│
├── backend/                 # FastAPI Python backend
│   ├── app/
│   │   ├── routers/         # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── models.py        # Database models
│   │   ├── database.py      # Database connection
│   │   ├── firebase_auth.py # Firebase authentication
│   │   ├── config.py        # Configuration
│   │   └── main.py          # FastAPI app
│   ├── Dockerfile
│   └── requirements.txt
│
├── Documentation/
│   └── Product/
│       └── product_definition.md
│
├── docker-compose.yml       # Production Docker Compose
├── docker-compose.dev.yml   # Development Docker Compose
├── .env.example             # Environment variables template
└── README.md
```

## Development

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:3000

### Backend Development

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Visit http://localhost:8000/docs for API documentation

### Database Migrations

```bash
# Run from backend directory
alembic revision --autogenerate -m "Description"
alembic upgrade head
```

## API Endpoints

### Books
- `GET /api/books/search` - Search books
- `GET /api/books/{book_id}` - Get book details
- `PUT /api/books/{book_id}/status` - Update reading status

### Loans
- `GET /api/loans` - Get user's loans
- `POST /api/loans` - Borrow a book
- `PUT /api/loans/{loan_id}/return` - Return a book

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/{item_id}` - Remove from wishlist

### Users
- `GET /api/users/me` - Get current user info
- `GET /api/users/profile` - Get user profile with stats

## Authentication Flow

1. User signs up/logs in via Firebase (Email/Password or Google)
2. Firebase returns an ID token
3. Frontend includes token in `Authorization: Bearer <token>` header
4. Backend verifies token with Firebase Admin SDK
5. Backend extracts user ID and processes request