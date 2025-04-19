# Variáveis de ambiente (pode sobrescrever com make VAR=value)
BUILD_STAGE ?= dev
NODE_ENV ?= development
FRONTEND_BUILD_STAGE ?= dev
BACKEND_PORT ?= 3001
FRONTEND_PORT ?= 5173

# Sobe tudo em modo dev
dev:
	@echo "🔧 Iniciando ambiente de desenvolvimento..."
	@BUILD_STAGE=$(BUILD_STAGE) FRONTEND_BUILD_STAGE=$(FRONTEND_BUILD_STAGE) NODE_ENV=$(NODE_ENV) \
	BACKEND_PORT=$(BACKEND_PORT) FRONTEND_PORT=$(FRONTEND_PORT) \
	docker-compose build --no-cache && docker-compose up

# Sobe tudo em modo produção
prod:
	@echo "🚀 Iniciando ambiente de produção..."
	@BUILD_STAGE=prod FRONTEND_BUILD_STAGE=prod NODE_ENV=production \
	BACKEND_PORT=$(BACKEND_PORT) FRONTEND_PORT=80 \
	docker-compose up --build

# Apenas o backend
backend:
	@echo "▶️ Subindo apenas o backend..."
	@docker-compose up --build backend

# Apenas o frontend
frontend:
	@echo "▶️ Subindo apenas o frontend..."
	@docker-compose up --build frontend

# Derruba os containers
down:
	@echo "🛑 Derrubando containers..."
	@docker-compose down

# Limpa tudo (containers, volumes, cache)
clean:
	@echo "🔥 Limpando containers, volumes e cache..."
	@docker-compose down -v --rmi all --remove-orphans

# Builda sem subir
build:
	@echo "🔨 Buildando containers..."
	@docker-compose build
