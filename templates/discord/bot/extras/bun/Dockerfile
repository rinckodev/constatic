FROM docker.io/oven/bun:latest

WORKDIR /app

COPY . .

RUN bun install

CMD ["bun", "run", "start"]