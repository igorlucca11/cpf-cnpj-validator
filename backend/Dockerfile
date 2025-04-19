# Estágio 1: Base (comum para dev e prod)
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./

# Estágio 2: Desenvolvimento
FROM base AS dev
ENV NODE_ENV=development
RUN npm install --include=dev
COPY . .
EXPOSE 3001
CMD ["npm", "run", "dev"]

# Estágio 3: Builder
FROM base AS builder
RUN npm ci
COPY . .
RUN npm run build

# Estágio 4: Produção
FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3001
CMD ["node", "dist/index.js"]
