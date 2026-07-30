FROM node:22-alpine
LABEL "language"="nodejs"
LABEL "framework"="next.js"

WORKDIR /src

COPY . .

# Match project pnpm version (v8)
RUN npm install -g pnpm@8.15.9

RUN pnpm install --frozen-lockfile

# Use root script added in Task 2
RUN pnpm run build:web

WORKDIR /src/apps/web

ENV PORT=8080
EXPOSE 8080

CMD ["pnpm", "start"]
