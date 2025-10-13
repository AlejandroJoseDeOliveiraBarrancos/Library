.PHONY: help build up down restart logs clean install-frontend install-backend dev

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build all Docker containers
	docker-compose build

up: ## Start all services
	docker-compose up -d
	@echo "Services started!"
	@echo "Frontend: http://localhost"
	@echo "Backend: http://localhost:8000"
	@echo "API Docs: http://localhost:8000/docs"

down: ## Stop all services
	docker-compose down

restart: down up ## Restart all services

logs: ## Show logs for all services
	docker-compose logs -f

logs-backend: ## Show backend logs
	docker-compose logs -f backend

logs-frontend: ## Show frontend logs
	docker-compose logs -f frontend

logs-db: ## Show database logs
	docker-compose logs -f db

clean: ## Remove all containers, volumes, and images
	docker-compose down -v --rmi all

install-frontend: ## Install frontend dependencies
	cd frontend && npm install

install-backend: ## Install backend dependencies
	cd backend && pip install -r requirements.txt

dev: ## Start in development mode with hot reload
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

dev-build: ## Build and start in development mode
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

setup: ## Initial setup (copy env files)
	@echo "Setting up environment files..."
	@cp -n .env.example .env 2>/dev/null || true
	@cp -n frontend/env.example frontend/.env 2>/dev/null || true
	@cp -n backend/env.example backend/.env 2>/dev/null || true
	@echo "Environment files created. Please update them with your credentials."

shell-backend: ## Open shell in backend container
	docker-compose exec backend /bin/bash

shell-frontend: ## Open shell in frontend container
	docker-compose exec frontend /bin/sh

shell-db: ## Open PostgreSQL shell
	docker-compose exec db psql -U library_user -d library_db

migrate: ## Run database migrations
	docker-compose exec backend alembic upgrade head

migrate-create: ## Create a new migration
	docker-compose exec backend alembic revision --autogenerate -m "$(name)"

test-backend: ## Run backend tests
	docker-compose exec backend pytest

test-frontend: ## Run frontend tests
	cd frontend && npm test

format-backend: ## Format backend code
	cd backend && black app/

format-frontend: ## Format frontend code
	cd frontend && npm run lint

status: ## Show status of all services
	docker-compose ps

