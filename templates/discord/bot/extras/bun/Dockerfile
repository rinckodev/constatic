FROM docker.io/oven/bun:latest

WORKDIR /app

COPY package.json package.json

RUN bun install
COPY . .

CMD ["bun", "run", "start"]