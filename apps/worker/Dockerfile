FROM node:20-alpine
LABEL "language"="nodejs"

WORKDIR /src

COPY . .

# Match project pnpm version (v8)
RUN npm install -g pnpm@8.15.9

RUN pnpm install --frozen-lockfile

# Build dependencies and worker
RUN pnpm run build:worker

WORKDIR /src/apps/worker

EXPOSE 8080

CMD ["node", "dist/index.js"]
