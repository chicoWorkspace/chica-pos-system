FROM node:20-alpine
LABEL "language"="nodejs"

WORKDIR /src

COPY . .

RUN npm install -g pnpm@8.15.9

RUN pnpm install --frozen-lockfile

RUN pnpm run build:api

WORKDIR /src/apps/api

ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/app.js"]
