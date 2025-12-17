FROM ubuntu:25.10
VOLUME /workspace
WORKDIR /workspace

RUN apt-get update && apt-get install -y libatomic1 git curl

ENV PATH="$PATH:/root/.local/bin"
COPY --from=ghcr.io/astral-sh/uv:0.9.16 /uv /uvx /bin/
RUN uv python install 3.14.2 --default \
    && uv pip install --system --break-system-packages ply

ENV PATH="$PATH:/emsdk/upstream/emscripten:/emsdk/"
COPY --from=docker.io/emscripten/emsdk:4.0.17 /emsdk /emsdk/
COPY --from=node:25.2.1 /usr/local/bin/node /usr/local/bin/node
COPY --from=denoland/deno:2.6.1 /usr/bin/deno /usr/local/bin/deno
COPY --from=oven/bun:1.3.4 /usr/local/bin/bun /usr/local/bin/bun
