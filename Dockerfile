# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2: Production ────────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled output (includes templates and database — nest-cli.json + tsc puts everything in dist/)
COPY --from=builder /app/dist ./dist

# Create log directory
RUN mkdir -p logs

EXPOSE 4000

CMD ["npm", "run", "start:prod"]
