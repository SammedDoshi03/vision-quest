# Multi-stage production Dockerfile for Enterprise Mobile BFF Gateway
FROM node:22-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

# Copy monorepo manifests
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/bff-mobile/ ./apps/bff-mobile/

# Install dependencies and build contracts + BFF
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @internal/contracts build
RUN pnpm --filter @resonance/bff-mobile build

# Production runtime stage
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/packages/ ./packages/
COPY --from=builder /app/apps/bff-mobile/dist ./apps/bff-mobile/dist
COPY --from=builder /app/apps/bff-mobile/package.json ./apps/bff-mobile/package.json

RUN pnpm install --prod --frozen-lockfile

EXPOSE 4000

CMD ["node", "apps/bff-mobile/dist/src/main.js"]
