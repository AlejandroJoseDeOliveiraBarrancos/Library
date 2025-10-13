# Library Management System - Architecture

## Overview

This is a modern, full-stack library management system built with a React frontend, FastAPI backend, and PostgreSQL database, all containerized with Docker.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Browser                       │
│                    (React + TypeScript)                      │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS/HTTP
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                      Nginx (Port 80)                         │
│                   Serves React SPA                           │
│              Proxies /api to Backend                         │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼────────┐  ┌──────▼───────┐  ┌──────▼──────────┐
│   React SPA    │  │   FastAPI    │  │   PostgreSQL    │
│   (Port 3000)  │  │  (Port 8000) │  │   (Port 5432)   │
│                │  │              │  │                 │
│  - Material-UI │  │  - REST API  │  │  - Users        │
│  - React Router│  │  - Firebase  │  │  - Loans        │
│  - Firebase    │  │    Auth      │  │  - Wishlist     │
│  - Axios       │  │  - Google    │  │  - Status       │
│                │  │    Books API │  │                 │
└────────────────┘  └──────┬───────┘  └─────────────────┘
                           │
                    ┌──────▼─────────┐
                    │  Firebase Auth │
                    │  (External)    │
                    └────────────────┘
                           │
                    ┌──────▼─────────┐
                    │ Google Books   │
                    │ API (External) │
                    └────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) v5
- **Routing**: React Router DOM v6
- **State Management**: Context API
- **HTTP Client**: Axios
- **Authentication**: Firebase SDK
- **Styling**: Emotion (CSS-in-JS via MUI)

### Backend
- **Framework**: FastAPI (Python 3.11)
- **Authentication**: Firebase Admin SDK
- **Database ORM**: SQLAlchemy 2.0
- **Migrations**: Alembic
- **HTTP Client**: HTTPX (for async requests)
- **Validation**: Pydantic v2
- **ASGI Server**: Uvicorn

### Database
- **DBMS**: PostgreSQL 15
- **Connection Pooling**: SQLAlchemy Engine

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Web Server**: Nginx (for frontend)

### External Services
- **Authentication**: Firebase Authentication
- **Book Data**: Google Books API

## Directory Structure

```
Library/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Layout/        # Layout components (Navbar, Layout)
│   │   │   └── Books/         # Book-related components
│   │   ├── pages/             # Page components (routes)
│   │   ├── contexts/          # React contexts (Auth)
│   │   ├── services/          # API service layer
│   │   ├── theme/             # Material-UI theme configuration
│   │   ├── types/             # TypeScript type definitions
│   │   ├── config/            # App configuration (Firebase)
│   │   ├── App.tsx            # Main app component with routing
│   │   └── main.tsx           # Application entry point
│   ├── public/                # Static assets
│   ├── Dockerfile             # Production Docker image
│   ├── Dockerfile.dev         # Development Docker image
│   ├── nginx.conf             # Nginx configuration
│   └── package.json           # Node.js dependencies
│
├── backend/                    # FastAPI backend application
│   ├── app/
│   │   ├── routers/           # API route handlers
│   │   │   ├── books.py      # Book search and details
│   │   │   ├── loans.py      # Loan management
│   │   │   ├── wishlist.py   # Wishlist management
│   │   │   └── users.py      # User management
│   │   ├── services/          # Business logic services
│   │   │   └── google_books.py # Google Books API integration
│   │   ├── models.py          # SQLAlchemy database models
│   │   ├── database.py        # Database connection setup
│   │   ├── firebase_auth.py   # Firebase authentication
│   │   ├── config.py          # App configuration
│   │   └── main.py            # FastAPI application
│   ├── Dockerfile             # Backend Docker image
│   └── requirements.txt       # Python dependencies
│
├── Documentation/
│   ├── Product/
│   │   └── product_definition.md  # Product requirements
│   └── Architecture/
│       └── ARCHITECTURE.md        # This file
│
├── scripts/                    # Utility scripts
│   ├── check-setup.sh         # Setup verification (Unix)
│   └── check-setup.ps1        # Setup verification (Windows)
│
├── docker-compose.yml         # Production Docker Compose
├── docker-compose.dev.yml     # Development Docker Compose
├── Makefile                   # Convenience commands
├── README.md                  # Main documentation
└── QUICKSTART.md             # Quick start guide
```

## Data Flow

### 1. User Authentication Flow

```
User → Frontend → Firebase Auth → Frontend receives token
                                       ↓
                    Backend receives token → Firebase Admin verifies
                                       ↓
                              Request processed with user context
```

### 2. Book Search Flow

```
User enters search → Frontend → Backend API → Google Books API
                                       ↓
                              Transform response
                                       ↓
                              Return to Frontend
                                       ↓
                              Display books
```

### 3. Loan/Wishlist Flow (When Implemented)

```
User action → Frontend → Backend (with auth token) → Database
                                       ↓
                              Update database
                                       ↓
                              Return confirmation
                                       ↓
                              Update UI
```

## API Endpoints

### Books
- `GET /api/books/search` - Search books from Google Books API
  - Query params: `query`, `author`, `category`, `sortBy`, `maxResults`, `startIndex`
- `GET /api/books/{book_id}` - Get detailed book information
- `PUT /api/books/{book_id}/status` - Update reading status

### Loans (Protected)
- `GET /api/loans` - Get user's loans
- `POST /api/loans` - Borrow a book
- `PUT /api/loans/{loan_id}/return` - Return a book
- `GET /api/loans/{loan_id}` - Get loan details

### Wishlist (Protected)
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add book to wishlist
- `DELETE /api/wishlist/{item_id}` - Remove from wishlist

### Users (Protected)
- `GET /api/users/me` - Get current user info
- `GET /api/users/profile` - Get user profile with statistics

## Database Schema

```sql
-- Users table (synced with Firebase)
CREATE TABLE users (
    id VARCHAR PRIMARY KEY,  -- Firebase UID
    email VARCHAR UNIQUE NOT NULL,
    display_name VARCHAR,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Loans table
CREATE TABLE loans (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR REFERENCES users(id),
    book_id VARCHAR NOT NULL,
    borrowed_date TIMESTAMP DEFAULT NOW(),
    due_date TIMESTAMP NOT NULL,
    returned_date TIMESTAMP,
    status VARCHAR NOT NULL  -- 'active', 'returned', 'overdue'
);

-- Wishlist table
CREATE TABLE wishlist_items (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR REFERENCES users(id),
    book_id VARCHAR NOT NULL,
    added_date TIMESTAMP DEFAULT NOW(),
    notify_when_available BOOLEAN DEFAULT TRUE
);

-- Reading status table
CREATE TABLE reading_status (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR REFERENCES users(id),
    book_id VARCHAR NOT NULL,
    status VARCHAR NOT NULL,  -- 'reading', 'completed', 'wishlist'
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## Security

### Authentication & Authorization
- Firebase Authentication for user management
- JWT tokens validated on every protected endpoint
- Token verification using Firebase Admin SDK
- Secure token storage in browser (handled by Firebase SDK)

### API Security
- CORS configured for specific origins
- HTTPS enforced in production
- Input validation using Pydantic models
- SQL injection prevention via SQLAlchemy ORM
- XSS prevention via React's built-in escaping

### Environment Variables
- Sensitive data stored in `.env` files
- `.env` files excluded from version control
- Separate configs for dev/prod environments

## Deployment

### Development
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```
- Hot reload enabled for frontend and backend
- Volumes mounted for live code changes
- Debug logging enabled

### Production
```bash
docker-compose up --build
```
- Optimized React build (static files)
- Nginx serving React app
- Uvicorn with multiple workers
- Database with persistent volume

### Environment Configuration

**Frontend**:
- Firebase credentials
- API URL
- Build-time environment injection

**Backend**:
- Firebase service account
- Database URL
- Google Books API key (optional)
- CORS origins
- JWT secret

## Performance Considerations

### Frontend
- Code splitting with React Router
- Lazy loading of images
- Pagination for book results
- Material-UI's built-in performance optimizations
- Vite's fast build and HMR

### Backend
- Async/await throughout (FastAPI + HTTPX)
- Connection pooling for database
- Caching potential for Google Books API responses
- Efficient database queries with SQLAlchemy

### Infrastructure
- Nginx for efficient static file serving
- Docker multi-stage builds for smaller images
- PostgreSQL indexing on frequently queried fields

## Monitoring & Logging

### Frontend
- Browser console for debugging
- Error boundaries (can be added)
- React DevTools support

### Backend
- FastAPI automatic API documentation (`/docs`)
- Uvicorn access logs
- Exception handling with detailed responses
- Python logging module

### Infrastructure
- Docker container logs via `docker-compose logs`
- PostgreSQL query logs (can be enabled)

## Scalability

### Horizontal Scaling
- Frontend: Multiple Nginx instances behind load balancer
- Backend: Multiple Uvicorn workers, can run multiple containers
- Database: PostgreSQL replication (primary-replica setup)

### Vertical Scaling
- Increase container resources in docker-compose.yml
- Adjust worker counts in Uvicorn
- Increase PostgreSQL connection pool size

## Future Improvements

1. **Caching Layer**: Add Redis for API response caching
2. **Message Queue**: Add Celery for background tasks (notifications)
3. **Search Engine**: Add Elasticsearch for better book search
4. **CDN**: Serve static assets from CDN
5. **Monitoring**: Add Prometheus + Grafana
6. **CI/CD**: GitHub Actions for automated testing and deployment
7. **Testing**: Add unit tests, integration tests, E2E tests
8. **Analytics**: Add Google Analytics or similar
9. **Real-time**: Add WebSocket support for notifications
10. **Mobile App**: Create React Native app using same backend

## Development Workflow

1. Create feature branch
2. Develop locally with hot reload
3. Test with `docker-compose up`
4. Create database migrations if needed
5. Update documentation
6. Submit pull request
7. Deploy after review

## Troubleshooting

### Common Issues
1. **Port conflicts**: Change ports in docker-compose.yml
2. **Firebase auth fails**: Check credentials and environment variables
3. **Database connection error**: Ensure database is healthy
4. **API rate limits**: Add Google Books API key
5. **CORS errors**: Verify CORS_ORIGINS in backend config

### Debug Commands
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f [service_name]

# Restart service
docker-compose restart [service_name]

# Rebuild specific service
docker-compose build --no-cache [service_name]

# Access container shell
docker-compose exec [service_name] /bin/bash

# Check database
docker-compose exec db psql -U library_user -d library_db
```

## Conclusion

This architecture provides a solid foundation for a modern library management system with:
- ✅ Clean separation of concerns
- ✅ Scalable microservices approach
- ✅ Secure authentication and authorization
- ✅ Modern, responsive UI
- ✅ RESTful API design
- ✅ Easy local development with Docker
- ✅ Production-ready deployment setup

The system is designed to be maintainable, extensible, and follows industry best practices.

