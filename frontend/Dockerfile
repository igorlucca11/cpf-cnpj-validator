###########################################
# Estágio 1: Base (comum para dev e prod) #
###########################################
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
ENV VITE_APP_API_BASE_URL=/api 

###########################################
# Estágio 2: Desenvolvimento (dev)        #
###########################################
FROM base AS dev
ENV NODE_ENV=development
RUN npm install --include=dev
COPY . .
CMD ["npm", "run", "dev"]  # Vite dev server

###########################################
# Estágio 3: Builder (compilação)         #
###########################################
FROM base AS builder
RUN npm ci
COPY . .
RUN npm run build  # Gera arquivos em /dist

###########################################
# Estágio 4: Produção (servidor web)      #
###########################################
FROM nginx:alpine AS prod
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80