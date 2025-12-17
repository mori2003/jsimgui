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

ENV NVM_DIR="/root/.nvm"
ENV PATH="$PATH:$NVM_DIR/versions/node/v25.2.1/bin"
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash \
    && \. "$HOME/.nvm/nvm.sh" \
    && nvm install 25.2.1 \
    && npm install -g bun \
    && npm install -g deno \
    && node -v \
    && bun -v \
    && deno -v
